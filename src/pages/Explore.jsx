import Header from "../components/Header.jsx";
import { SectionTitle } from "../components/SectionTitle.jsx";
import { TrendingPodcasts } from "../components/TrendingPodcasts.jsx";
import { ExploreCategory } from "../components/ExploreCategory.jsx";
import styles from "../styles/Home.module.css";
import exploreStyles from "../styles/Explore.module.css";

export default function Explore() {
    const filters = ["Todo", "Música", "Podcasts", "Eventos en vivo", "Hecho para ti", "Nuevos lanzamientos"];

    return (
        <main>
            <Header />
            <div className={styles.container}>
                {/* Filtros rápidos estilo Spotify */}
                <div className={exploreStyles.filterScroll}>
                    {filters.map((filter, i) => (
                        <button key={filter} className={i === 0 ? exploreStyles.filterBtnActive : exploreStyles.filterBtn}>
                            {filter}
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <SectionTitle title="Tendencias Ahora" span="Mostrar todo" />
                </div>
                <TrendingPodcasts />

                <div style={{ marginTop: '3.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <SectionTitle title="Explorar todo" />
                    </div>
                    <ExploreCategory />
                </div>
            </div>
        </main>
    );
}
