import { useNavigate } from 'react-router';
import styles from '../styles/NotFound.module.css';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <div className={styles.glitchContainer}>
                    <h1 className={styles.errorCode} data-text="404">404</h1>
                </div>
                <h2 className={styles.title}>Frecuencia Perdida</h2>
                <p className={styles.message}>
                    Parece que te has salido de la onda. La página que buscas se ha desvanecido en el ruido blanco.
                </p>
                <button
                    className={styles.homeButton}
                    onClick={() => navigate('/')}
                >
                    <span className="material-symbols-outlined">home</span>
                    Volver al Inicio
                </button>
            </div>

            {/* Visual elements */}
            <div className={styles.waveContainer}>
                <div className={`${styles.wave} ${styles.wave1}`}></div>
                <div className={`${styles.wave} ${styles.wave2}`}></div>
                <div className={`${styles.wave} ${styles.wave3}`}></div>
            </div>
        </main>
    );
}
