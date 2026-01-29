import { useRef, useEffect, useState, useContext } from "react";
import styles from "../styles/ContextMenu.module.css";
import { AudioContext } from "../context/AudioContext";

export default function ContextMenu({ x, y, song, onClose, onPlay, onEdit, onDelete }) {
    const { playlists, createPlaylist, addSongToPlaylist, toggleFavorite } = useContext(AudioContext);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleAddToPlaylist = async (playlistId) => {
        const success = await addSongToPlaylist(playlistId, song.id);
        if (success) {
            // Optional: Show a subtle toast instead of alert
        } else {
            alert("La canción ya está en esta playlist");
        }
        onClose();
    };

    const handleCreateAndAdd = async () => {
        const name = prompt("Nombre de la nueva playlist:");
        if (name && name.trim()) {
            const newId = await createPlaylist(name.trim());
            if (newId) {
                await addSongToPlaylist(newId, song.id);
            }
        }
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className={styles.contextMenu}
            style={{ top: y, left: x }}
        >
            <button className={styles.item} onClick={() => { onPlay(); onClose(); }}>
                <span className="material-symbols-outlined">play_arrow</span>
                Reproducir
            </button>
            <button className={styles.item} onClick={() => { onEdit(); onClose(); }}>
                <span className="material-symbols-outlined">edit</span>
                Editar
            </button>
            <button className={styles.item} onClick={() => { toggleFavorite(song.id); onClose(); }}>
                <span className={`material-symbols-outlined ${song.isFavorite ? styles.favorited : ""}`}>
                    {song.isFavorite ? "favorite" : "favorite_border"}
                </span>
                {song.isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
            </button>
            <div
                className={styles.itemHasSubmenu}
                onMouseEnter={() => setShowPlaylists(true)}
                onMouseLeave={() => setShowPlaylists(false)}
            >
                <div className={styles.item}>
                    <span className="material-symbols-outlined">playlist_add</span>
                    Añadir a playlist
                    <span className="material-symbols-outlined">chevron_right</span>
                </div>

                {showPlaylists && (
                    <div className={styles.submenu}>
                        <button className={styles.item} onClick={handleCreateAndAdd}>
                            <span className="material-symbols-outlined">add</span>
                            Crear nueva...
                        </button>
                        <div className={styles.divider}></div>
                        {playlists.map(pl => (
                            <button
                                key={pl.id}
                                className={styles.item}
                                onClick={() => handleAddToPlaylist(pl.id)}
                            >
                                {pl.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.divider}></div>
            <button className={`${styles.item} ${styles.danger}`} onClick={() => { onDelete(); onClose(); }}>
                <span className="material-symbols-outlined">delete</span>
                Eliminar
            </button>
        </div>
    );
}
