import { useState, useEffect } from "react";
import { api } from "../api/client";
import styles from "../styles/CategoryCard.module.css";

export function TrendingPodcasts() {
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await api.getTrendingPodcasts();
                setPodcasts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) return (
        <section className={styles.container}>
            {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.show} style={{ minHeight: '280px' }}>
                    <div className="skeleton" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '0.75rem', marginBottom: '1rem' }}></div>
                    <div className="skeleton" style={{ width: '80%', height: '1.2rem', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton" style={{ width: '60%', height: '1rem' }}></div>
                </div>
            ))}
        </section>
    );

    if (!podcasts) return null;

    return (
        <section className={styles.container}>
            {podcasts.map((pod) => (
                <article key={pod.id} className={styles.show}>
                    <div className={styles.imageContainer}>
                        <img src={pod.coverUrl} alt={pod.title} />
                        <button className={styles.playBtn}>
                            <span className="material-symbols-outlined">play_arrow</span>
                        </button>
                    </div>
                    <h4>{pod.title}</h4>
                    <p>{pod.description}</p>
                </article>
            ))}
        </section>
    );
}
