import { useContext, useState } from "react";
import { Link } from "./Link";
import styles from "../styles/Sidebar.module.css";
import { AudioContext } from "../context/AudioContext";
import PlaylistContextMenu from "./PlaylistContextMenu";

export default function Sidebar({ isOpen, onClose }) {
    const { playlists, createPlaylist } = useContext(AudioContext);
    const [showAll, setShowAll] = useState(false);
    const [playlistMenu, setPlaylistMenu] = useState({ visible: false, x: 0, y: 0, playlist: null });

    const handleCreate = () => {
        const name = prompt("Nombre de la nueva playlist:");
        if (name && name.trim()) {
            createPlaylist(name.trim());
        }
    };

    const handlePlaylistContextMenu = (e, playlist) => {
        e.preventDefault();
        setPlaylistMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            playlist: playlist
        });
    };

    const handleClosePlaylistMenu = () => {
        setPlaylistMenu({ ...playlistMenu, visible: false });
    };

    const visiblePlaylists = showAll ? playlists : playlists.slice(0, 5);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className={styles.overlay} onClick={onClose}></div>}

            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
                <header className={styles.sidebarHeader}>
                    <a className={styles.logoAnchor} href="/">
                        <div className={styles.logoContainer}>
                            <span className="material-symbols-outlined text-white text-2xl">graphic_eq</span>
                        </div>
                        <h1>SoundWave</h1>
                    </a>
                </header>

                {/* NAVBAR | MENU */}
                <nav className={styles.nav}>
                    <Link href={"/"} onClick={onClose}>
                        <span className="material-symbols-outlined icon-thin">home</span>
                        <span>Inicio</span>
                    </Link>
                    <Link href="/explore" onClick={onClose}>
                        <span className="material-symbols-outlined icon-thin">explore</span>
                        <span>Explorar</span>
                    </Link>
                    <Link href="/library" onClick={onClose}>
                        <span className="material-symbols-outlined icon-thin">library_music</span>
                        <span>Tu Biblioteca</span>
                    </Link>
                </nav>

                <div className={styles.divider}></div>

                {/* OPCIONES DINÁMICAS | MENU */}
                <div className={styles.options}>
                    <div className={styles.playlistHeader}>
                        <Link href="/playlists" onClick={onClose} className={styles.headerLink}>
                            <h4>Tus Playlists</h4>
                        </Link>
                        <button className={styles.addBtn} onClick={handleCreate} title="Crear Playlist">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>

                    <div className={styles.playlistList}>
                        {playlists.length > 0 ? (
                            <>
                                {visiblePlaylists.map(pl => (
                                    <Link
                                        key={pl.id}
                                        href={`/playlists/${pl.slug}`}
                                        onClick={onClose}
                                        onContextMenu={(e) => handlePlaylistContextMenu(e, pl)}
                                    >
                                        <span>{pl.name}</span>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <p className={styles.emptyMsg}>No tienes playlists aún.</p>
                        )}
                    </div>
                </div>

                <div className={styles.install}>
                    <button className={styles.installButton}>
                        <span className="material-symbols-outlined">download_for_offline</span>
                        <span>Instalar App</span>
                    </button>
                </div>
            </aside>

            {playlistMenu.visible && (
                <PlaylistContextMenu
                    x={playlistMenu.x}
                    y={playlistMenu.y}
                    playlist={playlistMenu.playlist}
                    onClose={handleClosePlaylistMenu}
                />
            )}
        </>
    )
}
