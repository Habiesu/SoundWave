import { Link } from "./Link";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar() {
    return (
        <aside>
            {/* LOGO | Header*/}
            <header>
                <a className={styles.logoAnchor} href="/">
                    <div className={styles.logoContainer}>
                        <span className="material-symbols-outlined text-white text-2xl">graphic_eq</span>
                    </div>
                    <h1>SoundWave</h1>
                </a>
            </header>

            {/* NAVBAR | MENU */}
            <nav className={styles.nav}>
                <Link href={"/"}>
                    <span className="material-symbols-outlined icon-thin">home</span>
                    <span>Inicio</span>
                </Link>
                <Link href="/explore">
                    <span className="material-symbols-outlined icon-thin">explore</span>
                    <span>Explorar</span>
                </Link>
                <Link href="/library">
                    <span className="material-symbols-outlined icon-thin">library_music</span>
                    <span>Tu Biblioteca</span>
                </Link>
            </nav>

            <div className={styles.divider}></div>

            {/* OPCIONES DINÁMICAS | MENU */}
            <div className={styles.options}>
                <h4>Tus Playlists</h4>
                <a href="/"><span>Favoritos de Tech</span></a>
                <a href="/"><span>Meditaciones</span></a>
                <a href="/"><span>Relajación</span></a>
                <a href="/"><span>Roadtrip 2024</span></a>
                <a href="/"><span>Deep Work Focus</span></a>
            </div>

            <div className={styles.install}>
                <button className={styles.installButton}>
                    <span className="material-symbols-outlined">download_for_offline</span>
                    <span>Instalar App</span>
                </button>
            </div>
        </aside>
    )
}
