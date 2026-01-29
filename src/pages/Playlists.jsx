import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AudioContext } from "../context/AudioContext";
import styles from "../styles/Library.module.css";
import homeStyles from "../styles/Home.module.css";
import PlaylistContextMenu from "../components/PlaylistContextMenu";

export default function Playlists() {
    const { playlists, createPlaylist } = useContext(AudioContext);
    const [playlistMenu, setPlaylistMenu] = useState({ visible: false, x: 0, y: 0, playlist: null });
    const navigate = useNavigate();

    const handleCreate = () => {
        const name = prompt("Nombre de la nueva playlist:");
        if (name && name.trim()) {
            createPlaylist(name.trim());
        }
    };

    const handleContextMenu = (e, playlist) => {
        e.preventDefault();
        setPlaylistMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            playlist: playlist
        });
    };

    const handleCloseMenu = () => {
        setPlaylistMenu({ ...playlistMenu, visible: false });
    };

    return (
        <main className={styles.main}>
            <div className={homeStyles.container}>
                <div className={styles.hero}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <p className={styles.heroLabel}>Tu Colección</p>
                            <h1 className={styles.heroTitle}>Playlists</h1>
                        </div>
                        <button onClick={handleCreate} className={styles.tabActive} style={{ display: 'flex', gap: '8px', padding: '0.5rem 1.5rem' }}>
                            <span className="material-symbols-outlined">add</span>
                            Nueva Playlist
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    {playlists.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem', marginBottom: '1rem' }}>playlist_add</span>
                            <h3>No tienes playlists</h3>
                            <p>Crea tu primera lista para empezar a organizar tu música.</p>
                        </div>
                    ) : (
                        playlists.map((pl) => (
                            <div
                                key={pl.id}
                                className={styles.card}
                                onClick={() => navigate(`/playlists/${pl.slug}`)}
                                onContextMenu={(e) => handleContextMenu(e, pl)}
                            >
                                <div className={styles.imageContainer} style={{ background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}>
                                        library_music
                                    </span>
                                </div>
                                <div className={styles.info}>
                                    <h3>{pl.name}</h3>
                                    <p>{pl.songIds.length} canciones</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {playlistMenu.visible && (
                <PlaylistContextMenu
                    x={playlistMenu.x}
                    y={playlistMenu.y}
                    playlist={playlistMenu.playlist}
                    onClose={handleCloseMenu}
                />
            )}
        </main>
    );
}
