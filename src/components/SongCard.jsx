import React from "react";
import styles from "../styles/Library.module.css";

const SongCard = React.memo(({ song, realIndex, onPlay, onDelete, onEdit }) => {
    return (
        <article className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={song.displayCover || "https://placehold.co/400x400/1e293b/white?text=Song"}
                    alt={song.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://placehold.co/400x400/1e293b/white?text=Song" }}
                />

                <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(realIndex);
                    }}
                    title="Eliminar de la biblioteca"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span>
                </button>

                <button
                    type="button"
                    className={styles.editBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(song);
                    }}
                    title="Editar información"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit</span>
                </button>

                <button
                    type="button"
                    className={styles.playBtn}
                    onClick={() => onPlay(realIndex)}
                >
                    <span className="material-symbols-outlined">play_arrow</span>
                </button>
            </div>
            <div className={styles.info}>
                <h3>{song.name}</h3>
                <p>{song.artist} • {song.album}</p>
            </div>
        </article>
    );
});

SongCard.displayName = "SongCard";

export default SongCard;
