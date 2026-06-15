import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles/NavBar.module.css';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.brand}>
                🎬 Try This Movies
            </Link>

            <div className={styles.links}>
                {user ? (
                    <>
                        <Link to="/history" className={styles.link}>
                            History
                        </Link>
                        <span className={styles.username}>Hi, {user.username}</span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={styles.link}>
                            Login
                        </Link>
                        <Link to="/register" className={styles.registerBtn}>
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}