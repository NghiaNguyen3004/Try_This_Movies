import {useAuth} from '../context/AuthContext.jsx';
import {Navigate} from 'react-router-dom';

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (user) {
        return <Navigate to="/" replace />; // Redirect to home if authenticated
    }
    return children;
}