import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {apiRequest} from '../utils/api.js';
import styles from './styles/RecommendPage.module.css';

export default function RecommendPage() {
    const [film, setFilm] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const genres = searchParams.getAll('genre');

    const fetchRecommendation = async () => {
        setLoading(true);
        setError(null);
        setRating(0);

        try {
            const params = new URLSearchParams();
            genres.forEach(g => params.append('genre', g));
            const data = await apiRequest(`/films/recommend?${params.toString()}`);
            setFilm(data.film);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (genres.length === 0) {
            navigate('/');
            return;
        }
        fetchRecommendation();
    }, []);

    const handleRate = async (score) => {
        setRating(score);
        try {
            await apiRequest('/films/rate', {
                method: 'POST',
                body: JSON.stringify({ filmTmdbId: film.tmdbId, score }),
            });
        } catch (err) {
            console.error('Rating error:', err);
        }
    };

    const handleNext = () => {
        fetchRecommendation();
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Finding a film for you...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.error}>{error}</div>
                <button className={styles.btn} onClick={() => navigate('/')}>
                    ← Back to genres
                </button>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate('/')}>
                ← Back to genres
            </button>

            {!user && (
                <div className={styles.guestBanner}>
                    <span>Save your history by creating an account</span>
                    <Link to="/register">Register →</Link>
                </div>
            )}

            {film && (
                <>
                    <div className={styles.card}>
                        {film.posterUrl && (
                            <img
                                src={film.posterUrl}
                                alt={film.title}
                                className={styles.poster}
                            />
                        )}
                        <div className={styles.info}>
                            <p className={styles.meta}>
                                {film.releaseYear}
                            </p>
                            <h2 className={styles.filmTitle}>{film.title}</h2>
                            <p className={styles.desc}>{film.description}</p>
                        </div>
                    </div>

                    {user && (
                        <div className={styles.ratingSection}>
                            <p className={styles.ratingLabel}>Rate this film</p>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        className={`${styles.star} ${star <= (hoveredStar || rating) ? styles.filled : ''}`}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className={styles.btn} onClick={handleNext}>
                        Next recommendation →
                    </button>
                </>
            )}
        </div>
    );
}