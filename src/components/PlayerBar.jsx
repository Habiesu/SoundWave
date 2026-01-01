import { useContext, useEffect, useRef, useState } from 'react';
import { AudioContext } from '../context/AudioContext';
import styles from '../styles/PlayerBar.module.css';

export default function PlayerBar() {
    const { currentSong, isPlaying, setIsPlaying, nextSong, prevSong } = useContext(AudioContext);
    const audioRef = useRef(null);

    // Estado local
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1); // 0 a 1
    const [isLooping, setIsLooping] = useState(false);

    // Efecto para Play/Pause
    useEffect(() => {
        if (currentSong && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Error reproduciendo:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentSong, isPlaying]);

    // Efecto para cambios de Volumen y Loop
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.loop = isLooping;
        }
    }, [volume, isLooping]);

    const togglePlay = () => {
        if (!currentSong) return;
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e) => {
        setVolume(Number(e.target.value));
    };

    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!currentSong) return null;

    return (
        <footer className={styles.playerBar}>
            {/* Elemento de Audio Oculto */}
            <audio
                ref={audioRef}
                src={currentSong.src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => {
                    if (!isLooping) nextSong(); // Autoplay siguiente si no está en loop
                }}
                onLoadedMetadata={(e) => setDuration(e.target.duration)}
                autoPlay={isPlaying}
            />

            {/* Izquierda: Información de la canción */}
            <div className={styles.playerInfo}>
                <img
                    src={currentSong.displayCover || "https://placehold.co/400x400/1e293b/white?text=Music"}
                    alt="Cover"
                    className={styles.playerCover}
                />
                <div className={styles.playerText}>
                    <h4>{currentSong.name}</h4>
                    <p>{currentSong.artist}</p>
                </div>
            </div>

            {/* Centro: Controles */}
            <div className={styles.playerControls}>
                <div className={styles.controlButtons}>
                    <button className={styles.btnIcon}><span className="material-symbols-outlined">shuffle</span></button>

                    <button className={styles.btnIcon} onClick={prevSong}>
                        <span className="material-symbols-outlined">skip_previous</span>
                    </button>

                    <button
                        className={`${styles.btnIcon} ${styles.btnPlay}`}
                        onClick={togglePlay}
                    >
                        <span className="material-symbols-outlined">
                            {isPlaying ? 'pause' : 'play_arrow'}
                        </span>
                    </button>

                    <button className={styles.btnIcon} onClick={nextSong}>
                        <span className="material-symbols-outlined">skip_next</span>
                    </button>

                    <button
                        className={styles.btnIcon}
                        style={{ color: isLooping ? 'var(--primary)' : 'inherit' }}
                        onClick={() => setIsLooping(!isLooping)}
                    >
                        <span className="material-symbols-outlined">repeat</span>
                    </button>
                </div>

                <div className={styles.progressContainer}>
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className={styles.progressBarInput}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Derecha: Volumen */}
            <div className={styles.playerExtra}>
                <button
                    className={styles.btnIcon}
                    onClick={() => setVolume(volume === 0 ? 1 : 0)} // Mute toggle
                >
                    <span className="material-symbols-outlined">
                        {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                    </span>
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={`${styles.progressBarInput} ${styles.volumeInput}`}
                />
            </div>
        </footer>
    );
}