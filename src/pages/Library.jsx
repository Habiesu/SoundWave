import { useContext, useState, useRef } from "react";
import { AudioContext } from "../context/AudioContext";
import styles from "../styles/Library.module.css";
import homeStyles from "../styles/Home.module.css";
import Header from "../components/Header.jsx";
import { Spinner } from "../components/Spinner";
import SongCard from "../components/SongCard";

export default function Library() {
    const {
        audioList,
        playSong,
        isLoading,
        isProcessing,
        processingMessage,
        enrichSong,
        enrichAllSongs,
        stopEnrichment,
        restoreMetadata,
        handleFolderSelect,
        deleteSong,
        deleteAllSongs,
        restoreAllSongs,
        fetchMetadataFromUrl,
        updateSongMetadata,
        searchMetadata,
        searchItunesMetadata
    } = useContext(AudioContext);

    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dragCounter = useRef(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [songToEdit, setSongToEdit] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", artist: "", album: "", ytUrl: "" });
    const [isFetchingUrl, setIsFetchingUrl] = useState(false);

    const onDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current += 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        dragCounter.current = 0;

        const files = Array.from(e.dataTransfer.files);
        handleFolderSelect(files);
    };

    const handleOpenEdit = (song) => {
        setSongToEdit(song);
        setEditForm({
            name: song.name,
            artist: song.artist,
            album: song.album || "Desconocido",
            ytUrl: ""
        });
        setIsModalOpen(true);
    };

    const handleFetchByUrl = async () => {
        if (!editForm.ytUrl) return;
        setIsFetchingUrl(true);
        const data = await fetchMetadataFromUrl(editForm.ytUrl);
        if (data) {
            setEditForm(prev => ({
                ...prev,
                name: data.name,
                artist: data.artist,
                coverUrl: data.coverUrl
            }));
        } else {
            alert("No se pudo obtener información de este link.");
        }
        setIsFetchingUrl(false);
    };

    const handleMagicFix = async () => {
        setIsFetchingUrl(true);
        const data = await searchMetadata(editForm.name);
        if (data) {
            setEditForm(prev => ({
                ...prev,
                name: data.name,
                artist: data.artist,
                coverUrl: data.coverUrl
            }));
        } else {
            alert("No se encontró información automática para este nombre.");
        }
        setIsFetchingUrl(false);
    };

    const handleItunesSearch = async () => {
        setIsFetchingUrl(true);
        const data = await searchItunesMetadata(editForm.name);
        if (data) {
            setEditForm(prev => ({
                ...prev,
                name: data.name,
                artist: data.artist,
                coverUrl: data.coverUrl
            }));
        } else {
            alert("No se encontró información en iTunes para este nombre.");
        }
        setIsFetchingUrl(false);
    };

    const handleRestoreOriginal = () => {
        if (!songToEdit) return;
        setEditForm({
            name: songToEdit.originalName,
            artist: songToEdit.originalArtist,
            album: "Desconocido",
            ytUrl: "",
            coverUrl: null,
            isRestoring: true
        });
    };

    const handleSaveEdit = async () => {
        const updates = {
            name: editForm.name,
            artist: editForm.artist,
            album: editForm.album,
            isEnriched: editForm.isRestoring ? false : (!!editForm.coverUrl || songToEdit.isEnriched)
        };
        if (editForm.coverUrl) {
            updates.ytCoverUrl = editForm.coverUrl;
        } else if (editForm.isRestoring) {
            updates.ytCoverUrl = null;
        }
        await updateSongMetadata(songToEdit.id, updates);
        setIsModalOpen(false);
    };

    const hasEnrichedSongs = audioList.some(song => song.isEnriched);

    return (
        <main
            className={styles.main}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Header />
            <div className={homeStyles.container} style={{ paddingTop: 0 }}>
                {/* Hero Section */}
                <div className={styles.hero}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p className={styles.heroLabel}>Colección Local</p>
                            <h1 className={styles.heroTitle}>Tu Biblioteca</h1>
                            <div className={styles.heroStats}>
                                <span className={`material-symbols-outlined ${styles.statIcon}`}>equalizer</span>
                                <span>
                                    <strong>{audioList.length}</strong> {audioList.length === 1 ? 'Canción' : 'Canciones'} importadas
                                </span>
                                {isProcessing && (
                                    <div className={styles.processingBadge}>
                                        <span className="material-symbols-outlined rotate" style={{ fontSize: '1.1rem' }}>sync</span>
                                        {processingMessage}
                                        <button onClick={stopEnrichment} className={styles.miniBtn} title="Detener proceso">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>cancel</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {audioList.length > 0 && (
                                <>
                                    {hasEnrichedSongs && (
                                        <button
                                            onClick={restoreAllSongs}
                                            className={styles.tab}
                                            disabled={isProcessing || isLoading}
                                            style={{
                                                display: 'flex',
                                                gap: '8px',
                                                padding: '0.5rem 1.25rem',
                                                opacity: (isProcessing || isLoading) ? 0.5 : 1
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>undo</span>
                                            Deshacer todos los cambios
                                        </button>
                                    )}
                                    <button
                                        onClick={enrichAllSongs}
                                        className={styles.tabActive}
                                        disabled={isProcessing || isLoading}
                                        style={{
                                            display: 'flex',
                                            gap: '8px',
                                            padding: '0.5rem 1.25rem',
                                            opacity: (isProcessing || isLoading) ? 0.5 : 1
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>auto_fix_high</span>
                                        Mejorar toda la biblioteca
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("¿Seguro que quieres borrar TODA tu biblioteca? Esta acción no se puede deshacer.")) {
                                                try {
                                                    await deleteAllSongs();
                                                } catch (err) {
                                                    alert("Error al borrar la biblioteca. Revisa la consola.");
                                                }
                                            }
                                        }}
                                        className={styles.tab}
                                        disabled={isProcessing || isLoading}
                                        style={{
                                            display: 'flex',
                                            gap: '8px',
                                            padding: '0.5rem 1.25rem',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            borderColor: 'rgba(239, 68, 68, 0.2)',
                                            opacity: (isProcessing || isLoading) ? 0.5 : 1
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', color: '#ef4444' }}>delete_sweep</span>
                                        Borrar Todo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                {audioList.length > 0 && (
                    <div className={styles.searchBarContainer}>
                        <span className="material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por título o artista..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchBar}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className={styles.clearSearch}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Content Grid */}
                <div className={styles.grid}>
                    {isLoading ? (
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", padding: "4rem" }}>
                            <Spinner />
                        </div>
                    ) : audioList.length === 0 ? (
                        <label className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}>
                            <span className="material-symbols-outlined" style={{ fontSize: "4rem", marginBottom: "1rem", color: isDragging ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                {isDragging ? 'download' : 'folder_open'}
                            </span>
                            <h3>{isDragging ? 'Suelta para importar' : 'Aún no tienes música'}</h3>
                            <p style={{ marginBottom: "1rem", color: 'var(--text-secondary)' }}>
                                Elige una carpeta local o arrastra archivos .mp3 / .zip aquí.
                            </p>
                            <input
                                type="file"
                                webkitdirectory="true"
                                directory="true"
                                multiple
                                className={styles.hiddenInput}
                                onChange={handleFolderSelect}
                            />
                            <div
                                style={{
                                    backgroundColor: "var(--primary)",
                                    color: "white",
                                    padding: "0.75rem 2rem",
                                    borderRadius: "9999px",
                                    fontWeight: "600",
                                    marginTop: '1rem'
                                }}
                            >
                                Seleccionar Carpeta
                            </div>
                        </label>
                    ) : (
                        <>
                            {(() => {
                                const filtered = audioList.filter(s => {
                                    const name = s.name || "";
                                    const artist = s.artist || "";
                                    const query = searchQuery.toLowerCase();
                                    return name.toLowerCase().includes(query) ||
                                        artist.toLowerCase().includes(query);
                                });

                                if (filtered.length === 0 && searchQuery) {
                                    return (
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem' }}>search_off</span>
                                            <h3>No se encontraron coincidencias</h3>
                                            <p>Prueba con otros términos de búsqueda.</p>
                                        </div>
                                    );
                                }

                                return filtered.map((song) => {
                                    const realIndex = audioList.findIndex(item => item.id === song.id);
                                    return (
                                        <SongCard
                                            key={song.id}
                                            song={song}
                                            realIndex={realIndex}
                                            onPlay={playSong}
                                            onDelete={deleteSong}
                                            onEdit={handleOpenEdit}
                                        />
                                    );
                                });
                            })()}

                            {!isLoading && !searchQuery && (
                                <label className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`} style={{ minHeight: '150px', borderStyle: 'dashed' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>add_circle</span>
                                    <p>Arrastra más música para añadir</p>
                                    <input
                                        type="file"
                                        webkitdirectory="true"
                                        directory="true"
                                        multiple
                                        className={styles.hiddenInput}
                                        onChange={handleFolderSelect}
                                    />
                                </label>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Editar Información</h2>
                            <button className={styles.closeModal} onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>close</span>
                            </button>
                        </div>

                        <div className={styles.modalTools}>
                            <button
                                className={`${styles.toolBtn} ${styles.toolBtnActive}`}
                                onClick={handleMagicFix}
                                disabled={isFetchingUrl}
                            >
                                <span className="material-symbols-outlined">auto_fix_high</span>
                                Mejora Mágica
                            </button>
                            <button
                                className={`${styles.toolBtn}`}
                                onClick={handleItunesSearch}
                                disabled={isFetchingUrl}
                            >
                                <span className="material-symbols-outlined">library_music</span>
                                Buscar en iTunes
                            </button>
                            {songToEdit?.isEnriched && (
                                <button
                                    className={`${styles.toolBtn} ${styles.toolBtnUndo}`}
                                    onClick={handleRestoreOriginal}
                                >
                                    <span className="material-symbols-outlined">undo</span>
                                    Restaurar Original
                                </button>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Obtener de YouTube (Link)</label>
                            <div className={styles.urlInputGroup}>
                                <input
                                    type="text"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={editForm.ytUrl}
                                    onChange={e => setEditForm(prev => ({ ...prev, ytUrl: e.target.value }))}
                                />
                                <button onClick={handleFetchByUrl} disabled={isFetchingUrl || !editForm.ytUrl}>
                                    {isFetchingUrl ? (
                                        <span className="material-symbols-outlined rotate">sync</span>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">download</span>
                                            Auto
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Nombre de la Canción</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Artista</label>
                            <input
                                type="text"
                                value={editForm.artist}
                                onChange={e => setEditForm(prev => ({ ...prev, artist: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Álbum</label>
                            <input
                                type="text"
                                value={editForm.album}
                                onChange={e => setEditForm(prev => ({ ...prev, album: e.target.value }))}
                            />
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                            <button className={styles.btnSave} onClick={handleSaveEdit}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
