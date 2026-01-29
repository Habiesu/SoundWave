import { useState, useEffect } from "react";
import { api } from "../api/client";
import styles from "../styles/EpisodeList.module.css";
import { SectionTitle } from "./SectionTitle";

export function EpisodeList() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEpisodes = async () => {
            try {
                const data = await api.getEpisodes();
                setEpisodes(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEpisodes();
    }, []);

    if (loading) return (
        <section className={styles.section}>
            <SectionTitle title="Nuevos Episodios" />
            <div className={styles.list}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={`${styles.episodeItem} skeleton`} style={{ height: '80px', border: 'none' }}></div>
                ))}
            </div>
        </section>
    );

    return (
        <section className={styles.section}>
            <SectionTitle title="Nuevos Episodios" />
            <div className={styles.list}>
                {episodes.map((ep) => (
                    <article key={ep.id} className={styles.episodeItem}>
                        <div className={styles.imageWrapper}>
                            <img src={ep.coverUrl} alt={ep.title} />
                            <div className={styles.playOverlay}>
                                <span className="material-symbols-outlined">play_arrow</span>
                            </div>
                        </div>

                        <div className={styles.info}>
                            <h4>{ep.title}</h4>
                            <p>{ep.author} • {ep.timestamp}</p>
                        </div>

                        <div className={styles.duration}>
                            {ep.duration}
                        </div>

                        <button className={styles.addButton}>
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                    </article>
                ))}
            </div>
        </section>
    );
}
