import { useState, useEffect } from "react";
import { api } from "../api/client";
import Header from "../components/Header";
import homeStyles from "../styles/Home.module.css";
import styles from "../styles/Profile.module.css";

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, recent, favs] = await Promise.all([
                    api.getUser(),
                    api.getRecentlyPlayed(),
                    api.getTopFavorites()
                ]);
                setUserData(user);
                setRecentlyPlayed(recent);
                setFavorites(favs);
            } catch (err) {
                console.error("Error fetching profile data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <main className={styles.profileContainer}>
                <Header />
                <div className={homeStyles.container}>
                    <p style={{ color: 'white' }}>Cargando perfil...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.profileContainer}>
            <Header />

            <div className={homeStyles.container} style={{ paddingTop: 0 }}>
                {/* Profile Header */}
                <header className={styles.header}>
                    <div className={styles.avatarContainer}>
                        <soundwave-avatar
                            service="github"
                            username={userData?.username || "habiesu"}
                            size="200"
                            style={{ borderRadius: '50%', overflow: 'hidden', display: 'block' }}
                        ></soundwave-avatar>
                        <div className={styles.avatarOverlay}>
                            <span className="material-symbols-outlined text-white text-4xl">edit</span>
                        </div>
                    </div>

                    <div className={styles.headerInfo}>
                        <p className={styles.badge}>Perfil</p>
                        <h1 className={styles.name}>{userData?.name || "Usuario"}</h1>
                        <div className={styles.meta}>
                            <span className={styles.statsBadge}>PRO MEMBER</span>
                            <span>•</span>
                            <p>Miembro desde {userData?.stats?.memberSince || "2023"}</p>
                            <span>•</span>
                            <p>{userData?.stats?.playlists || "0"} Playlists públicas</p>
                        </div>
                    </div>

                    <button className={styles.editButton}>Editar Perfil</button>
                </header>

                <div className={styles.content}>
                    {/* Stats Grid */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <p className={styles.statValue}>{userData?.stats?.hours || "0"}</p>
                            <p className={styles.statLabel}>Horas Escuchadas</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statValue}>{userData?.stats?.following || "0"}</p>
                            <p className={styles.statLabel}>Siguiendo</p>
                        </div>
                        <div className={styles.statCard}>
                            <p className={styles.statValue}>{userData?.stats?.followers || "0"}</p>
                            <p className={styles.statLabel}>Seguidores</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <nav className={styles.tabs}>
                        <span className={`${styles.tab} ${styles.tabActive}`}>Vista General</span>
                        <span className={styles.tab}>Historial</span>
                        <span className={styles.tab}>Favoritos</span>
                        <span className={styles.tab}>Ajustes</span>
                    </nav>

                    {/* Recently Played */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Escuchado recientemente</h2>
                            <a href="#" className={styles.showAll}>Ver Todo</a>
                        </div>
                        <div className={styles.recentList}>
                            {recentlyPlayed.map((item) => (
                                <div key={item.id} className={styles.recentItem}>
                                    <div className={styles.recentImageContainer}>
                                        <img src={item.coverUrl} className={styles.recentImage} alt={item.title} />
                                    </div>
                                    <div className={styles.recentInfo}>
                                        <h3 className={styles.recentTitle}>{item.title}</h3>
                                        <p className={styles.recentSubtitle}>{item.show} • Episodio {item.episode}</p>
                                    </div>
                                    <div className={styles.progressContainer}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${item.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className={styles.timeText}>{item.time_left}</span>
                                    </div>
                                    <div className={styles.recentMeta}>
                                        <span className={styles.timeAgo}>{item.played_at}</span>
                                        <span className={`material-symbols-outlined ${styles.favoriteIcon}`}>favorite</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Top Favorites */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>Tus favoritos</h2>
                        </div>
                        <div className={styles.grid}>
                            {favorites.map((item) => (
                                <div key={item.id} className={styles.card}>
                                    <div className={styles.cardImageContainer}>
                                        <img src={item.coverUrl} className={styles.cardImage} alt={item.title} />
                                        <button className={styles.playButton}>
                                            <span className="material-symbols-outlined text-white text-3xl filled">play_arrow</span>
                                        </button>
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDescription}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
