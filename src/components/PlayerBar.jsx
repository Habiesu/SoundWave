import styles from '../styles/PlayerBar.module.css'

export default function PlayerBar() {
    return (
        <footer className={styles.playerBar}>
            {/* Izquierda */}
            <div className={styles.playerInfo}>
                <img src="tu-imagen.jpg" alt="Cover" className={styles.playerCover} />
                <div className={styles.playerText}>
                <h4>Fundamentos de REST</h4>
                <p>JSCamp • Midudev</p>
                </div>
            </div>

            {/* Centro */}
            <div className={styles.playerControls}>
                <div className={styles.controlButtons}>
                <button className={styles.btnIcon}><span className="material-symbols-outlined">shuffle</span></button>
                <button className={styles.btnIcon}><span className="material-symbols-outlined">skip_previous</span></button>
                <button className={`${styles.btnIcon} ${styles.btnPlay}`}><span className="material-symbols-outlined">play_arrow</span></button>
                <button className={styles.btnIcon}><span className="material-symbols-outlined">skip_next</span></button>
                <button className={styles.btnIcon}><span className="material-symbols-outlined">repeat</span></button>
                </div>
                
                <div className={styles.progressContainer}>
                <span>1:24</span>
                <div className={styles.progressBar}>
                    <div className={styles.progressCurrent}></div>
                </div>
                <span>42:10</span>
                </div>
            </div>

            {/* Derecha */}
            <div className={styles.playerExtra}>
                <button className={styles.btnIcon}><span className="material-symbols-outlined">queue_music</span></button>
                <div className={styles.volumeSlider}>
                <div className={styles.volumeLevel}></div>
                </div>
            </div>
        </footer>
    )
}