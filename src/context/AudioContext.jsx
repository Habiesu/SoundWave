/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useRef } from "react";
import { parseBlob } from "music-metadata";
import JSZip from "jszip";

export const AudioContext = createContext();

// --- IndexedDB Utils ---
const DB_NAME = "SoundWaveDB";
const STORE_NAME = "songs";

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveSongsToDB = async (songs) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    for (const song of songs) { store.add(song); }
    return new Promise((r) => tx.oncomplete = r);
};

const getAllSongsFromDB = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const updateSongInDB = async (songId, updates) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(songId);
    getReq.onsuccess = () => {
        if (getReq.result) {
            const data = { ...getReq.result, ...updates };
            store.put(data);
        }
    };
    return new Promise((r) => tx.oncomplete = r);
};

const deleteSongFromDB = async (songId) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(songId);
    return new Promise((r) => tx.oncomplete = r);
};

const clearAllSongsFromDB = async () => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.error("Error clearing DB:", err);
        throw err;
    }
};

// --- Invidious Instances (Youtube API) ---
const YT_INSTANCES = [
    "https://inv.nadeko.net",
    "https://invidious.nerdvpn.de",
    "https://inv.perditum.com",
    "https://invidious.privacyredirect.com",
    "https://vid.priv.au",
    "https://invidious.flokinet.to",
    "https://invidious.projectsegfau.lt",
    "https://iv.ggtyler.dev"
];

export const searchItunesMetadata = async (query) => {
    const cleanQuery = query.replace(/[,\-_]/g, ' ').replace(/\s+/g, ' ').trim();
    try {
        const itunesResp = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&media=music&limit=3`);
        const itunesData = await itunesResp.json();

        if (itunesData.results?.length > 0) {
            let match = itunesData.results.find(r =>
                cleanQuery.toLowerCase().includes("remix") || !r.trackName.toLowerCase().includes("remix")
            ) || itunesData.results[0];

            return {
                name: match.trackName,
                artist: match.artistName,
                coverUrl: match.artworkUrl100.replace('100x100', '600x600')
            };
        }
    } catch (err) {
        console.warn("[API] iTunes search falló");
    }
    return null;
};

// --- API Connector ---
const searchMetadata = async (query) => {
    // 1. Limpieza de query para aumentar precisión
    const cleanQuery = query
        .replace(/[,\-_]/g, ' ') // Quitar comas, guiones, underscores
        .replace(/\s+/g, ' ')    // Colapsar espacios
        .trim();

    console.log(`[Cleaner] Buscando: "${cleanQuery}" (Original: "${query}")`);

    // 2. PRIORIZADO: Youtube con rotación de instancias + Proxy para evitar CORS
    for (const instance of YT_INSTANCES) {
        try {
            // Usamos un proxy de CORS público para evitar los bloqueos en el navegador
            const proxy = "https://corsproxy.io/?";
            const targetUrl = `${instance}/api/v1/search?q=${encodeURIComponent(cleanQuery)}&type=video`;

            const ytResp = await fetch(proxy + encodeURIComponent(targetUrl), {
                signal: AbortSignal.timeout(6000)
            });

            if (!ytResp.ok) continue;
            const ytData = await ytResp.json();

            if (ytData?.[0]) {
                const best = ytData[0];
                if (!cleanQuery.toLowerCase().includes("remix") && best.title.toLowerCase().includes("remix")) {
                    if (ytData[1] && !ytData[1].title.toLowerCase().includes("remix")) {
                        const second = ytData[1];
                        const thumb = second.videoThumbnails?.find(t => t.quality === 'maxresdefault') || second.videoThumbnails?.[0];
                        return { name: second.title, artist: second.author, coverUrl: thumb?.url };
                    }
                }

                const thumb = best.videoThumbnails?.find(t => t.quality === 'maxresdefault') || best.videoThumbnails?.[0];
                return { name: best.title, artist: best.author, coverUrl: thumb?.url };
            }
        } catch (err) {
            console.warn(`[API Search] Error en ${instance}, intentando siguiente...`);
        }
    }

    // 3. FALLBACK: iTunes (usando la función dedicada)
    return await searchItunesMetadata(cleanQuery);
};

const fetchMetadataFromUrl = async (url) => {
    // 1. Usamos NoEmbed (CORS Compliant) como primera opción para evitar bloqueos
    try {
        const noembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
        const resp = await fetch(noembedUrl);
        if (resp.ok) {
            const data = await resp.json();
            if (data.title && !data.error) {
                console.log("[NoEmbed] Datos obtenidos con éxito");
                return {
                    name: data.title,
                    artist: data.author_name,
                    coverUrl: data.thumbnail_url?.replace('hqdefault', 'maxresdefault') || data.thumbnail_url
                };
            }
        }
    } catch (err) {
        console.warn("[NoEmbed] Falló, intentando Invidious...");
    }

    // 2. Fallback a Invidious con Proxy si NoEmbed falla
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(\/shorts\/))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[8].length === 11) ? match[8] : null;

    if (!videoId) return null;

    for (const instance of YT_INSTANCES) {
        try {
            const proxy = "https://corsproxy.io/?";
            const target = `${instance}/api/v1/videos/${videoId}`;
            const resp = await fetch(proxy + encodeURIComponent(target), {
                signal: AbortSignal.timeout(5000)
            });
            if (!resp.ok) continue;
            const data = await resp.json();

            const thumb = data.videoThumbnails?.find(t => t.quality === 'maxresdefault') || data.videoThumbnails?.[0];

            return {
                name: data.title,
                artist: data.author,
                coverUrl: thumb?.url
            };
        } catch (err) {
            console.warn(`[API Url] Error en ${instance} con proxy`);
        }
    }
    return null;
};

export function AudioProvider({ children }) {
    const [audioList, setAudioList] = useState([]);
    const [audioIndex, setAudioIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState("");

    const isClearingRef = useRef(false);
    const activeTasksRef = useRef(new Set());

    const updateProcessingState = (taskId, message, start = true) => {
        if (start) {
            activeTasksRef.current.add(taskId);
            setIsProcessing(true);
            setProcessingMessage(message);
        } else {
            activeTasksRef.current.delete(taskId);
            if (activeTasksRef.current.size === 0) {
                setIsProcessing(false);
                setProcessingMessage("");
            }
        }
    };

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const saved = await getAllSongsFromDB();
            if (saved.length > 0) {
                setAudioList(saved.map(s => ({
                    ...s,
                    displayCover: s.ytCoverUrl || (s.coverBlob ? URL.createObjectURL(s.coverBlob) : null),
                    src: null // Don't create src for all songs at once
                })));
            }
            setIsLoading(false);
        };
        load();

        // Cleanup all cover URLs on unmount
        return () => {
            setAudioList(prev => {
                prev.forEach(s => {
                    if (s.displayCover && s.displayCover.startsWith('blob:')) URL.revokeObjectURL(s.displayCover);
                    if (s.src) URL.revokeObjectURL(s.src);
                });
                return [];
            });
        };
    }, []);

    const enrichSong = async (index) => {
        const song = audioList[index];
        if (!song || !song.id) return;

        const taskId = `enrich-${song.id}`;
        updateProcessingState(taskId, `Buscando info para: ${song.name}...`);

        try {
            const data = await searchMetadata(song.name);
            if (data && !isClearingRef.current) {
                const updates = { name: data.name, artist: data.artist, ytCoverUrl: data.coverUrl, isEnriched: true };
                await updateSongInDB(song.id, updates);

                setAudioList(prev => prev.map(s => {
                    if (s.id === song.id) {
                        const updated = { ...s, ...updates, displayCover: data.coverUrl };
                        if (currentSong?.id === s.id) setCurrentSong(updated);
                        return updated;
                    }
                    return s;
                }));
            }
        } finally {
            updateProcessingState(taskId, "", false);
        }
    };

    const enrichAllSongs = async () => {
        if (audioList.length === 0) return;
        const taskId = "enrich-all";
        isClearingRef.current = false;
        updateProcessingState(taskId, "Iniciando mejora colectiva...");

        try {
            for (let i = 0; i < audioList.length; i++) {
                if (isClearingRef.current) break;
                const song = audioList[i];
                if (song.isEnriched) continue;

                setProcessingMessage(`Enriqueciendo (${i + 1}/${audioList.length}): ${song.name}...`);
                const data = await searchMetadata(song.name);

                if (data && !isClearingRef.current) {
                    const updates = { name: data.name, artist: data.artist, ytCoverUrl: data.coverUrl, isEnriched: true };
                    await updateSongInDB(song.id, updates);

                    setAudioList(prev => prev.map(s => {
                        if (s.id === song.id) {
                            const updated = { ...s, ...updates, displayCover: data.coverUrl };
                            if (currentSong?.id === s.id) setCurrentSong(updated);
                            return updated;
                        }
                        return s;
                    }));
                }
                await new Promise(r => setTimeout(r, 200));
            }
        } finally {
            updateProcessingState(taskId, "", false);
        }
    };

    const restoreMetadata = async (index) => {
        const s = audioList[index];
        if (s?.id) {
            const upds = { name: s.originalName, artist: s.originalArtist, ytCoverUrl: null, isEnriched: false };
            await updateSongInDB(s.id, upds);
            const newList = [...audioList];
            newList[index] = { ...newList[index], ...upds, displayCover: s.coverBlob ? URL.createObjectURL(s.coverBlob) : null };
            setAudioList(newList);
            if (currentSong?.id === s.id) setCurrentSong(newList[index]);
        }
    };

    const restoreAllSongs = async () => {
        setIsProcessing(true);
        const newList = [...audioList];
        for (let i = 0; i < newList.length; i++) {
            if (!newList[i].isEnriched) continue;
            const s = newList[i];
            const upds = { name: s.originalName, artist: s.originalArtist, ytCoverUrl: null, isEnriched: false };
            await updateSongInDB(s.id, upds);
            newList[i] = { ...newList[i], ...upds, displayCover: s.coverBlob ? URL.createObjectURL(s.coverBlob) : null };
        }
        setAudioList(newList);
        if (currentSong) {
            const updated = newList.find(s => s.id === currentSong.id);
            if (updated) setCurrentSong(updated);
        }
        setIsProcessing(false);
    };

    const updateSongMetadata = async (songId, updates) => {
        await updateSongInDB(songId, updates);
        setAudioList(prev => prev.map(s => {
            if (s.id === songId) {
                // If we are updating the cover, we should revoke the previous blob URL if it exists
                if (updates.ytCoverUrl && s.displayCover && s.displayCover.startsWith('blob:')) {
                    URL.revokeObjectURL(s.displayCover);
                }

                const updated = {
                    ...s,
                    ...updates,
                    displayCover: updates.ytCoverUrl || (s.coverBlob ? URL.createObjectURL(s.coverBlob) : null)
                };
                if (currentSong?.id === songId) setCurrentSong(updated);
                return updated;
            }
            return s;
        }));
    };

    const stopEnrichment = () => {
        isClearingRef.current = true;
        setIsProcessing(false);
        setProcessingMessage("Proceso detenido");
        setTimeout(() => setProcessingMessage(""), 2000);
    };

    const deleteSong = async (index) => {
        const song = audioList[index];
        if (song?.id) await deleteSongFromDB(song.id);

        // Revoke URLs for the deleted song
        if (song.displayCover && song.displayCover.startsWith('blob:')) URL.revokeObjectURL(song.displayCover);
        if (song.src) URL.revokeObjectURL(song.src);

        const newList = audioList.filter((_, i) => i !== index);
        setAudioList(newList);

        if (audioIndex === index) {
            setAudioIndex(null);
            setCurrentSong(null);
            setIsPlaying(false);
        } else if (audioIndex !== null && index < audioIndex) {
            setAudioIndex(audioIndex - 1);
        }
    };

    const deleteAllSongs = async () => {
        console.log("[Library] Iniciando borrado total...");
        isClearingRef.current = true;
        setIsLoading(true);
        try {
            // Revoke all existing URLs before clearing state
            audioList.forEach(s => {
                if (s.displayCover && s.displayCover.startsWith('blob:')) URL.revokeObjectURL(s.displayCover);
                if (s.src) URL.revokeObjectURL(s.src);
            });

            await clearAllSongsFromDB();
            console.log("[Library] Base de datos limpiada con éxito.");
        } catch (err) {
            console.error("[Library] Error al limpiar la base de datos:", err);
        } finally {
            setAudioList([]);
            setAudioIndex(null);
            setCurrentSong(null);
            setIsPlaying(false);
            setIsLoading(false);
            console.log("[Library] Estado de la aplicación reseteado.");
        }
    };

    const playSong = (index) => {
        if (index >= 0 && index < audioList.length) {
            const song = audioList[index];

            // Lazy load audio src only when needed
            let updatedSong = { ...song };
            if (!song.src) {
                updatedSong.src = URL.createObjectURL(song.file);
                // Update the song in the list with the new src URL
                setAudioList(prev => prev.map((s, i) => i === index ? updatedSong : s));
            }

            setAudioIndex(index);
            setCurrentSong(updatedSong);
            setIsPlaying(true);
        }
    };

    const handleFolderSelect = async (event) => {
        setIsLoading(true);
        isClearingRef.current = false;
        try {
            const files = Array.isArray(event) ? event : Array.from(event.target.files);
            const newAudioFiles = [];
            for (const file of files) {
                if (file.name.endsWith('.zip')) {
                    const zip = await new JSZip().loadAsync(file);
                    for (const filename of Object.keys(zip.files)) {
                        if (filename.match(/\.(mp3|wav|ogg)$/i)) {
                            const blob = await zip.files[filename].async('blob');
                            newAudioFiles.push(new File([blob], filename, { type: 'audio/mpeg' }));
                        }
                    }
                } else if (file.type.startsWith('audio/')) {
                    newAudioFiles.push(file);
                }
            }
            const processed = (await Promise.all(newAudioFiles.map(async (file) => {
                try {
                    const metadata = await parseBlob(file);
                    let coverBlob = metadata.common.picture?.[0] ? new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format }) : null;

                    let rawName = (metadata.common.title || file.name.split('/').pop()).replace(/\.(mp3|wav|ogg|m4a)$/i, '').replace(/^Musica\//i, '');
                    let artist = metadata.common.artist || "Desconocido";

                    if (artist === "Desconocido" && rawName.includes(" - ")) {
                        const parts = rawName.split(" - ");
                        artist = parts[0].trim();
                        rawName = parts.slice(1).join(" - ").trim();
                    }

                    return { file, coverBlob, name: rawName, artist, originalName: rawName, originalArtist: artist, album: metadata.common.album || "Desconocido", duration: metadata.format.duration, isEnriched: false };
                } catch { return null; }
            }))).filter(s => s);
            if (processed.length > 0) {
                await saveSongsToDB(processed);
                const saved = await getAllSongsFromDB();
                setAudioList(saved.map(s => ({
                    ...s,
                    displayCover: s.ytCoverUrl || (s.coverBlob ? URL.createObjectURL(s.coverBlob) : null),
                    src: null // Lazy load src later
                })));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AudioContext.Provider value={{
            audioList, isPlaying, setIsPlaying, currentSong, playSong,
            nextSong: () => audioIndex !== null && playSong((audioIndex + 1) % audioList.length),
            prevSong: () => audioIndex !== null && playSong((audioIndex - 1 + audioList.length) % audioList.length),
            handleFolderSelect, isLoading, isProcessing, processingMessage, enrichSong, enrichAllSongs, stopEnrichment, deleteAllSongs, deleteSong, restoreMetadata, restoreAllSongs,
            fetchMetadataFromUrl, updateSongMetadata, searchMetadata, searchItunesMetadata
        }}>
            {children}
        </AudioContext.Provider>
    );
}
