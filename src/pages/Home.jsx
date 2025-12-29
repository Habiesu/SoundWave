import Header from "../components/Header.jsx";
import { FeatureCard } from "../components/FeatureCard.jsx";
import { CategoryCard } from "../components/CategoryCard.jsx";
import { SectionTitle } from "../components/SectionTitle.jsx";
import { EpisodeList } from "../components/EpisodeList.jsx";
import styles from "../styles/Home.module.css"
export default function Home() {

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <FeatureCard />
                <SectionTitle title="Shows que te encantarán" span="VER TODO" />
                <CategoryCard />
                <EpisodeList />
            </div>
        </main>
    )
}