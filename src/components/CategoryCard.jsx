import { useState, useEffect } from "react";
import { api } from "../api/client";
import styles from "../styles/CategoryCard.module.css";
import { SectionTitle } from "./SectionTitle";

export function CategoryCard() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const data = await api.getShows();
                setShows(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchShows();
    }, [])

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

    if (!shows) return null;

    return (
        <section className={styles.container}>
            {shows.map((show) => (
                <article key={show.id} className={styles.show}>
                    <div className={styles.imageContainer}>
                        <img src={show.coverUrl} alt={show.title} />
                        <button className={styles.playBtn}>
                            <span className="material-symbols-outlined">play_arrow</span>
                        </button>
                    </div>
                    <h4>{show.title}</h4>
                    <p>{show.description}</p>
                </article>
            ))}
        </section>
    )
}