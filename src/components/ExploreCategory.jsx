import { useState, useEffect } from "react";
import { api } from "../api/client.js";
import styles from "../styles/ExploreCategory.module.css";

export function ExploreCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await api.getExploreCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <div className={styles.grid}>
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`${styles.card} skeleton`} style={{ height: '192px' }}></div>
            ))}
        </div>
    );

    return (
        <div className={styles.grid}>
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className={styles.card}
                    style={{ backgroundColor: cat.color }}
                >
                    <span className={styles.title}>{cat.title}</span>
                    <img
                        src={cat.imageUrl}
                        alt={cat.title}
                        className={styles.image}
                    />
                </div>
            ))}
        </div>
    );
}
