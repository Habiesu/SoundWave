import { useState, useContext, useMemo } from "react";
import homeStyles from "../styles/Home.module.css";
import styles from "../styles/Profile.module.css";
import { AudioContext } from "../context/AudioContext";

export default function Profile() {
    const { recentlyPlayed, audioList, playSong, playlists } = useContext(AudioContext);

    // User data mock (could be moved to context later if needed)
    const userData = {
        name: "Javier H.",
        username: "habiesu",
        stats: {
            memberSince: "2024",
            playlists: playlists.length,
            hours: "128",
            following: "42",
            followers: "12"
        }
    };

    const [activeTab, setActiveTab] = useState("general");

    const favorites = useMemo(() =>
        audioList.filter(s => s.isFavorite),
        [audioList]);

    const history = useMemo(() =>
        audioList
            .filter(s => s.lastPlayed)
            .sort((a, b) => b.lastPlayed - a.lastPlayed),
        [audioList]);

    return (
        <main className={styles.profileContainer}>
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
                        <span
                            className={`${styles.tab} ${activeTab === 'general' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('general')}
                        >
                            Vista General
                        </span>
                        <span
                            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            Historial
                        </span>
                        <span
                            className={`${styles.tab} ${activeTab === 'favorites' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            Favoritos
                        </span>
                        <span
                            className={`${styles.tab} ${activeTab === 'settings' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Ajustes
                        </span>
                    </nav>

                    {/* VISTA GENERAL */}
                    {activeTab === "general" && (
                        <>
                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2>Escuchado recientemente</h2>
                                    <button className={styles.showAll} onClick={() => setActiveTab('history')}>Ver Todo</button>
                                </div>
                                <div className={styles.recentList}>
                                    {recentlyPlayed.length > 0 ? (
                                        recentlyPlayed.map((song) => (
                                            <div key={song.id} className={styles.recentItem} onClick={() => {
                                                const idx = audioList.findIndex(s => s.id === song.id);
                                                if (idx !== -1) playSong(idx);
                                            }}>
                                                <div className={styles.recentImageContainer}>
                                                    <img src={song.displayCover || "/default_album.jpg"} className={styles.recentImage} alt={song.name} />
                                                </div>
                                                <div className={styles.recentInfo}>
                                                    <h3 className={styles.recentTitle}>{song.name}</h3>
                                                    <p className={styles.recentSubtitle}>{song.artist} • {song.album || "Desconocido"}</p>
                                                </div>
                                                <div className={styles.recentMeta}>
                                                    <span className={styles.timeAgo}>
                                                        {new Date(song.lastPlayed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {song.isFavorite && (
                                                        <span className={`material-symbols-outlined ${styles.favoriteIcon}`}>favorite</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: 'var(--text-dim)', padding: '1rem' }}>No hay reproducciones recientes.</p>
                                    )}
                                </div>
                            </section>

                            <section className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2>Mis favoritos</h2>
                                    <button className={styles.showAll} onClick={() => setActiveTab('favorites')}>Ver Todo</button>
                                </div>
                                <div className={styles.grid}>
                                    {favorites.slice(0, 4).length > 0 ? (
                                        favorites.slice(0, 4).map((song) => (
                                            <div key={song.id} className={styles.card} onClick={() => {
                                                const idx = audioList.findIndex(s => s.id === song.id);
                                                if (idx !== -1) playSong(idx);
                                            }}>
                                                <div className={styles.cardImageContainer}>
                                                    <img src={song.displayCover || "/default_album.jpg"} className={styles.cardImage} alt={song.name} />
                                                    <button className={styles.playButton}>
                                                        <span className="material-symbols-outlined text-white text-3xl filled">play_arrow</span>
                                                    </button>
                                                </div>
                                                <h3 className={styles.cardTitle}>{song.name}</h3>
                                                <p className={styles.cardDescription}>{song.artist}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: 'var(--text-dim)', padding: '1rem' }}>Aun no tienes canciones favoritas.</p>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {/* HISTORIAL COMPLETO */}
                    {activeTab === "history" && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Historial completo</h2>
                            </div>
                            <div className={styles.recentList}>
                                {history.length > 0 ? (
                                    history.map((song) => (
                                        <div key={`history-${song.id}`} className={styles.recentItem} onClick={() => {
                                            const idx = audioList.findIndex(s => s.id === song.id);
                                            if (idx !== -1) playSong(idx);
                                        }}>
                                            <div className={styles.recentImageContainer}>
                                                <img src={song.displayCover || "/default_album.jpg"} className={styles.recentImage} alt={song.name} />
                                            </div>
                                            <div className={styles.recentInfo}>
                                                <h3 className={styles.recentTitle}>{song.name}</h3>
                                                <p className={styles.recentSubtitle}>{song.artist} • {song.album || "Desconocido"}</p>
                                            </div>
                                            <div className={styles.recentMeta}>
                                                <span className={styles.timeAgo}>
                                                    {new Date(song.lastPlayed).toLocaleDateString()} {new Date(song.lastPlayed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-dim)', padding: '1rem' }}>No hay canciones en el historial.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* FAVORITOS COMPLETO */}
                    {activeTab === "favorites" && (
                        <section className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2>Tus favoritos</h2>
                            </div>
                            <div className={styles.grid}>
                                {favorites.length > 0 ? (
                                    favorites.map((song) => (
                                        <div key={`fav-${song.id}`} className={styles.card} onClick={() => {
                                            const idx = audioList.findIndex(s => s.id === song.id);
                                            if (idx !== -1) playSong(idx);
                                        }}>
                                            <div className={styles.cardImageContainer}>
                                                <img src={song.displayCover || "/default_album.jpg"} className={styles.cardImage} alt={song.name} />
                                                <button className={styles.playButton}>
                                                    <span className="material-symbols-outlined text-white text-3xl filled">play_arrow</span>
                                                </button>
                                            </div>
                                            <h3 className={styles.cardTitle}>{song.name}</h3>
                                            <p className={styles.cardDescription}>{song.artist}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-dim)', padding: '1rem' }}>No has marcado ninguna canción como favorita.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* AJUSTES PLACEHOLDER */}
                    {activeTab === "settings" && (
                        <section className={styles.section}>
                            <h2>Ajustes</h2>
                            <p style={{ color: 'var(--text-dim)' }}>Próximamente...</p>
                        </section>
                    )}

                </div>
            </div>
        </main>
    );
}
