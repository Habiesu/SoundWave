import { useState, useEffect, useRef } from "react"
import { Link } from "./Link.jsx";
import { api } from "../api/client.js";
import styles from "../styles/Header.module.css"
import { useAuth } from '../hooks/useAuth.jsx'

export default function Header() {
    const [showMenu, setShowMenu] = useState(false)
    const [userData, setUserData] = useState(null)
    const menuRef = useRef(null)

    const toggleMenu = () => setShowMenu(!showMenu)
    const { isLoggedIn, Login, Logout } = useAuth()

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
                                <div className={styles.userMenu} >
                                    <Link href="/profile" className={styles.menuItem}>Mi perfil</Link>
                                    <Link href="/settings" className={styles.menuItem}>Ajustes</Link>
                                    <div className={styles.divider}></div>
                                    <button className={styles.menuItem} onClick={() => {
                                        Logout()
                                        setShowMenu(false)
                                    }}>
                                        Cerrar sesión
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