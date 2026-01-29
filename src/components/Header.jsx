import { useState, useEffect, useRef, useContext } from "react"
import { Link } from "./Link.jsx";
import { api } from "../api/client.js";
import styles from "../styles/Header.module.css"
import { useAuth } from '../hooks/useAuth.jsx'
import { AudioContext } from "../context/AudioContext.jsx";

export default function Header({ onMenuClick }) {
    const [showMenu, setShowMenu] = useState(false)
    const [userData, setUserData] = useState(null)
    const menuRef = useRef(null)

    const toggleMenu = () => setShowMenu(!showMenu)
    const { isLoggedIn, Login, Logout } = useAuth()
    const { recentlyPlayed, audioList, playSong, downloadLibrary } = useContext(AudioContext);

    /* Efecto para obtener el usuario */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await api.getUser()
                setUserData(user)
            } catch (err) {
                console.error(err)
            }
        }
        fetchUser()
    }, [])
    /* Efecto para cada vez que se hace click fuera del menu de login */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showMenu])

    return (
        <header className={styles.header}>
            <button className={styles.hamburgerBtn} onClick={onMenuClick} aria-label="Abrir menú">
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Mobile Logo Logo */}
            <Link href="/" className={styles.mobileLogo}>
                <div className={styles.logoContainer}>
                    <span className="material-symbols-outlined">graphic_eq</span>
                </div>
                <span className={styles.logoText}>SoundWave</span>
            </Link>

            <div className={styles.searchContainer}>
                <label className={styles.searchLabel}>
                    <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Buscar podcasts, artistas o episodios..."
                    />
                </label>
            </div>

            <div className={styles.headerRight}>
                {/* Notificaciones */}
                <button type="button" className={styles.navButton}>
                    <span className="material-symbols-outlined">notifications</span>
                    <span className={styles.notificationDot}></span>
                </button>

                <div className={styles.userMenuContainer} ref={menuRef}>
                    {!isLoggedIn ? (
                        <button className={styles.loginButton} onClick={Login}>Iniciar Sesión</button>
                    ) : (
                        <>
                            <button className={styles.userButton} onClick={toggleMenu}>
                                <soundwave-avatar
                                    service="github"
                                    username={userData?.username || "habiesu"}
                                    size="32"
                                    style={{ borderRadius: '50%', overflow: 'hidden' }}
                                ></soundwave-avatar>
                                <span className={styles.userName}>{userData?.name || "Cargando..."}</span>
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>

                            {showMenu && (
                                <div className={styles.userMenu}>
                                    <div className={styles.menuHeader}>
                                        <p className={styles.menuHeaderName}>{userData?.name || "Usuario"}</p>
                                        <p className={styles.menuHeaderEmail}>{'@' + userData?.username || "@habiesu"}</p>
                                    </div>
                                    <div className={styles.divider}></div>

                                    {/* SECCIÓN ESCUCHADO RECIENTEMENTE (MAX 3) */}
                                    {recentlyPlayed.length > 0 && (
                                        <div className={styles.recentDropdownSection}>
                                            <p className={styles.recentSectionTitle}>Escuchado recientemente</p>
                                            {recentlyPlayed.map((song) => (
                                                <button
                                                    key={song.id}
                                                    className={styles.recentMenuItem}
                                                    onClick={() => {
                                                        const idx = audioList.findIndex(s => s.id === song.id);
                                                        if (idx !== -1) playSong(idx);
                                                        setShowMenu(false);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined">history</span>
                                                    <div className={styles.recentMenuItemInfo}>
                                                        <p className={styles.recentMenuItemTitle}>{song.name}</p>
                                                        <p className={styles.recentMenuItemArtist}>{song.artist}</p>
                                                    </div>
                                                </button>
                                            ))}
                                            <div className={styles.divider}></div>
                                        </div>
                                    )}

                                    <Link href="/profile" className={styles.menuItem} onClick={() => setShowMenu(false)}>
                                        <span className="material-symbols-outlined">person</span>
                                        <span>Mi perfil</span>
                                    </Link>
                                    <button className={styles.menuItem} onClick={() => { downloadLibrary(); setShowMenu(false); }}>
                                        <span className="material-symbols-outlined">download</span>
                                        <span>Descargar Biblioteca</span>
                                    </button>
                                    <Link href="/settings" className={styles.menuItem} onClick={() => setShowMenu(false)}>
                                        <span className="material-symbols-outlined">settings</span>
                                        <span>Ajustes</span>
                                    </Link>
                                    <div className={styles.divider}></div>
                                    <button className={`${styles.item || styles.menuItem} ${styles.logoutItem}`} onClick={() => {
                                        Logout()
                                        setShowMenu(false)
                                    }}>
                                        <span className="material-symbols-outlined">logout</span>
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}