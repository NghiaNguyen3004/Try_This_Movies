import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {apiRequest} from '../utils/api.js';
import styles from './styles/GenrePicker.module.css';

export default function GenrePickerPage() {
    const [genres, setGenres] = useState([]);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await apiRequest('/films/genres');
                setGenres(data.genres);
            } catch (err) {
                setError('Failed to load genres. Please try again.');
            }
        };
        fetchGenres();
    }, []);

    const toggleGenre = (value) => {
        setSelected(prev =>
            prev.includes(value)
                ? prev.filter(g => g !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = () => {
        if (selected.length === 0) {
            setError('Please select at least one genre.');
            return;
        }
        setError(null);
        const params = new URLSearchParams();
        selected.forEach(g => params.append('genre', g));
        navigate(`/recommend?${params.toString()}`);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>What are you in the mood for?</h1>
            <p className={styles.subtitle}>Pick one or more genres to get a film recommendation.</p>

            <p className={styles.sectionLabel}>Genres</p>

            <div className={styles.chips}>
                {genres.map(genre => (
                    <button
                        key={genre.value}
                        className={`${styles.chip} ${selected.includes(genre.value) ? styles.selected : ''}`}
                        onClick={() => toggleGenre(genre.value)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.btn} onClick={handleSubmit}>
                Get recommendation →
            </button>
        </div>
    );
}