import data from './data.json';

const SIMULATE_DELAY = 500; // ms

export const api = {
    getFeatured: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const featured = data.find(item => item.type === 'featured');
                resolve(featured);
            }, SIMULATE_DELAY);
        });
    },
    getShows: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const shows = data.filter(item => item.type === 'show');
                resolve(shows);
            }, SIMULATE_DELAY);
        });
    },
    getEpisodes: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const episodes = data.filter(item => item.type === 'episode');
                resolve(episodes);
            }, SIMULATE_DELAY);
        });
    },
    getAll: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, SIMULATE_DELAY);
        });
    },
    getUser: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = data.find(item => item.type === 'user');
                resolve(user);
            }, SIMULATE_DELAY);
        });
    },
    getExploreCategories: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const categories = data.filter(item => item.type === 'explore_category');
                resolve(categories);
            }, SIMULATE_DELAY);
        });
    },
    getTrendingPodcasts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const trending = data.filter(item => item.type === 'trending');
                resolve(trending);
            }, SIMULATE_DELAY);
        });
    },
    getLibraryShows: async () => {
        const allData = await api.getAll();
        return allData.filter(item => item.type === 'library_show');
    },
    getRecentlyPlayed: async () => {
        const allData = await api.getAll();
        return allData.filter(item => item.type === 'recently_played');
    },
    getTopFavorites: async () => {
        const allData = await api.getAll();
        return allData.filter(item => item.type === 'top_favorite');
    }
};
