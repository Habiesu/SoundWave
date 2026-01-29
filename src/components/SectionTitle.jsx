import styles from "../styles/SectionTitle.module.css";
import { Link } from "./Link.jsx";

export function SectionTitle({title, span}) {
    return (
        <>
            <div className={styles.title}>
                <h2>{title}</h2>
                {span && <Link href="/">{span}</Link>}
            </div>
        </>
    )
}