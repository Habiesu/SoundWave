import { useState, useEffect } from "react";
import { api } from "../api/client";
import styles from "../styles/Library.module.css";
import homeStyles from "../styles/Home.module.css";
import Header from "../components/Header.jsx";

export default function Library() {
    const [libraryShows, setLibraryShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Todo");

    const tabs = ["Todo", "Podcasts", "Episodios", "Autores"];

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const data = await api.getLibraryShows();
                setLibraryShows(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    return (
        <main className={styles.main}>
            <Header />
            <div className={homeStyles.container} style={{ paddingTop: 0 }}>
                {/* Hero Section - Al principio */}
                <div className={styles.hero}>
                    <p className={styles.heroLabel}>Colección Privada</p>
                    <h1 className={styles.heroTitle}>Tu Biblioteca</h1>
                    <p className={styles.heroStats}>7 Suscripciones • 142 Episodios guardados</p>
                </div>

                {/* Sticky Tabs Bar */}
                <div className={styles.stickyBar}>
                    <div className={styles.tabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={activeTab === tab ? styles.tabActive : styles.tab}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className={styles.grid}>
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className={`${styles.skeletonCard} skeleton`}></div>
                        ))
                    ) : (
                        libraryShows.map((show) => (
                            <article key={show.id} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    <img src={show.coverUrl} alt={show.title} />
                                    <button type="button" className={styles.playBtn}>
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </button>
                                </div>
                                <div className={styles.info}>
                                    <h3>{show.title}</h3>
                                    <p>{show.category} • {show.frequency}</p>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
