import { useRef, useEffect, useContext } from "react";
import styles from "../styles/ContextMenu.module.css";
import { AudioContext } from "../context/AudioContext";
import { useNavigate } from "react-router";

export default function PlaylistContextMenu({ x, y, playlist, onClose }) {
    const { deletePlaylist, renamePlaylist } = useContext(AudioContext);
    const navigate = useNavigate();
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

    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar "${playlist.name}"?`)) {
            await deletePlaylist(playlist.id);
            onClose();
            // If we are in the detail page of this playlist, we should navigate away
            if (window.location.pathname.includes(playlist.slug || playlist.id)) {
                navigate("/playlists");
            }
        }
    };

    const handleRename = () => {
        const newName = prompt("Nuevo nombre para la playlist:", playlist.name);
        if (newName && newName.trim()) {
            renamePlaylist(playlist.id, newName.trim());
        }
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className={styles.contextMenu}
            style={{ top: y, left: x }}
        >
            <button className={styles.item} onClick={() => {
                navigate(`/playlists/${playlist.slug || playlist.id}`);
                onClose();
            }}>
                <span className="material-symbols-outlined">open_in_new</span>
                Abrir Playlist
            </button>
            <button className={styles.item} onClick={handleRename}>
                <span className="material-symbols-outlined">edit</span>
                Renombrar
            </button>
            <div className={styles.divider}></div>
            <button className={`${styles.item} ${styles.danger}`} onClick={handleDelete}>
                <span className="material-symbols-outlined">delete</span>
                Eliminar
            </button>
        </div>
    );
}
