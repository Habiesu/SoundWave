import React from "react";
import styles from "../styles/Library.module.css";

const SongCard = React.memo(({ song, realIndex, onPlay, onDelete, onEdit, onContextMenu, isPlaying, currentSongId }) => {
    const isThisSongPlaying = currentSongId === song.id && isPlaying;
    return (
        <article
            className={styles.card}
            onContextMenu={onContextMenu}
            onClick={() => onPlay(realIndex)}
        >
            <div className={styles.imageContainer}>
                <img
                    src={song.displayCover || "https://placehold.co/400x400/1e293b/white?text=Song"}
                    alt={song.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = "https://placehold.co/400x400/1e293b/white?text=Song" }}
                />

                {!isThisSongPlaying && (
                    <div className={styles.playBtn}>
                        <span className="material-symbols-outlined">play_arrow</span>
                    </div>
                )}
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
