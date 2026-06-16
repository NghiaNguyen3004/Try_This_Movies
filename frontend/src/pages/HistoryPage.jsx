import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {apiRequest} from '../utils/api.js';
import styles from './styles/HistoryPage.module.css';

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const LIMIT = 20;

    const fetchHistory = async (pageNum) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest(`/films/history?page=${pageNum}&limit=${LIMIT}`);
            setHistory(data.history);
            setHasMore(data.history.length === LIMIT);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(page);
    }, [page]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        return `${diffDays} days ago`;
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Loading your history...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Your history</h1>
            <p className={styles.subtitle}>Films you've been recommended.</p>

            {history.length === 0 ? (
                <div className={styles.empty}>
                    No recommendations yet.{' '}
                    <span
                        className={styles.link}
                        onClick={() => navigate('/')}
                    >
                        Get your first one →
                    </span>
                </div>
            ) : (
                <>
                    <div className={styles.list}>
                        {history.map((item, index) => (
                            <div key={index} className={styles.card}>
                                {item.posterUrl ? (
                                    <img
                                        src={item.posterUrl}
                                        alt={item.title}
                                        className={styles.poster}
                                    />
                                ) : (
                                    <div className={styles.posterPlaceholder}>
                                        No image
                                    </div>
                                )}
                                <div className={styles.details}>
                                    <h2 className={styles.filmTitle}>{item.title}</h2>
                                    <p className={styles.meta}>
                                        {item.releaseYear} · Recommended {formatDate(item.recommendedAt)}
                                    </p>
                                    {item.score ? (
                                        <div className={styles.stars}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    className={`${styles.star} ${star <= item.score ? styles.filled : ''}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className={styles.noRating}>Not rated yet</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.pagination}>
                        <button
                            className={styles.pgBtn}
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 1}
                        >
                            ← Previous
                        </button>
                        <span className={styles.pgInfo}>Page {page}</span>
                        <button
                            className={styles.pgBtn}
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hasMore}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}