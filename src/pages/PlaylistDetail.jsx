import { useContext, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AudioContext } from "../context/AudioContext";
import styles from "../styles/Library.module.css";
import homeStyles from "../styles/Home.module.css";
import SongCard from "../components/SongCard";
import ContextMenu from "../components/ContextMenu";

export default function PlaylistDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const {
        playlists,
        audioList,
        playSong,
        isPlaying,
        currentSong,
        deletePlaylist,
        renamePlaylist,
        removeSongFromPlaylist
    } = useContext(AudioContext);

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, song: null });

    const playlist = useMemo(() =>
        playlists.find(p => p.slug === slug),
        [playlists, slug]);

    const playlistSongs = useMemo(() => {
        if (!playlist) return [];
        return playlist.songIds.map(songId =>
            audioList.find(s => s.id === songId)
        ).filter(Boolean);
    }, [playlist, audioList]);

    if (!playlist) {
        return (
            <main className={styles.main}>
                <div className={homeStyles.container}>
                    <h2>Playlist no encontrada</h2>
                    <button onClick={() => navigate("/playlists")} className={styles.tabActive}>
                        Volver a Playlists
                    </button>
                </div>
            </main>
        );
    }

    const handleRename = () => {
        const newName = prompt("Nuevo nombre para la playlist:", playlist.name);
        if (newName && newName.trim()) {
            renamePlaylist(playlist.id, newName.trim());
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar "${playlist.name}"?`)) {
            await deletePlaylist(playlist.id);
            navigate("/playlists");
        }
    };

    const handleContextMenu = (e, song) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            song: song
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    return (
        <main className={styles.main}>
            <div className={homeStyles.container}>
                <div className={styles.hero}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p className={styles.heroLabel}>Playlist</p>
                            <h1 className={styles.heroTitle}>{playlist.name}</h1>
                            <div className={styles.heroStats}>
                                <span className="material-symbols-outlined">playlist_play</span>
                                <span><strong>{playlistSongs.length}</strong> canciones</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={handleRename} className={styles.tab}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit</span>
                                Renombrar
                            </button>
                            <button
                                onClick={handleDelete}
                                className={styles.tab}
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
                                Eliminar Playlist
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    {playlistSongs.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem' }}>music_note</span>
                            <h3>Esta playlist está vacía</h3>
                            <p>Haz clic derecho en canciones de tu biblioteca para añadirlas.</p>
                        </div>
                    ) : (
                        playlistSongs.map((song) => {
                            const realIndexInLibrary = audioList.findIndex(s => s.id === song.id);
                            return (
                                <SongCard
                                    key={song.id}
                                    song={song}
                                    realIndex={realIndexInLibrary}
                                    onPlay={playSong}
                                    onDelete={() => {
                                        if (window.confirm("¿Quitar canción de la playlist?")) {
                                            removeSongFromPlaylist(playlist.id, song.id);
                                        }
                                    }}
                                    onEdit={() => { }}
                                    onContextMenu={(e) => handleContextMenu(e, song)}
                                    isPlaying={isPlaying}
                                    currentSongId={currentSong?.id}
                                />
                            );
                        })
                    )}
                </div>
            </div>

            {contextMenu.visible && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    song={contextMenu.song}
                    onClose={handleCloseContextMenu}
                    onPlay={() => playSong(audioList.findIndex(s => s.id === contextMenu.song.id))}
                    onEdit={() => { }}
                    onDelete={() => removeSongFromPlaylist(playlist.id, contextMenu.song.id)}
                />
            )}
        </main>
    );
}
