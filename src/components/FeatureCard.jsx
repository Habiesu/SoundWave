import { useState, useEffect } from "react";
import { api } from "../api/client";
import styles from "../styles/FeatureCard.module.css";

export function FeatureCard() {
    const [featuredData, setFeaturedData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getFeatured();
                setFeaturedData(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [])

    if (!featuredData) return (
        <div className={`${styles.card} skeleton`} style={{ height: '320px', border: 'none' }}></div>
    );

    return (
        <section className={styles.card}>
            {/* Gradient */}
            <div className={styles.gradient}></div>
            {/* Image */}
            <div className={styles.image}></div>
            {/* Overlay */}
            <div className={styles.overlay}>
                {/* Badge */}
                <div className={styles.badge}>
                    <span className={styles.dot}></span>
                    <span>{featuredData.badge.toUpperCase()}</span>
                </div>
                <h2>{featuredData.title}:
                    <br />
                    <span className={styles.subtitle}>
                        {featuredData.subtitle}
                    </span>
                </h2>
                <p>{featuredData.description}</p>
                <div className={styles.actions}>
                    <button className={styles.playBtn}>
                        <span className="material-symbols-outlined">play_arrow</span>
                        <span>Escuchar Ahora</span>
                    </button>
                    <button className={styles.saveBtn}>
                        <span className="material-symbols-outlined">bookmark_add</span>
                    </button>
                </div>
            </div>
        </section>
    )
}