import {createContext, useContext, useState, useEffect} from 'react';
import {apiRequest} from '../utils/api.js';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const checkAuth = async () => {
            try{
                const data = await apiRequest('/auth/me',{});
                setUser(data.user);
            } catch(error){
                console.error('Error checking auth status:', error);
            } finally {
                setLoading(false);
            }

        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try{
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            setUser(data.user);
            return { success: true };
        } catch(error){
            console.error('Login error:', error);
            return { success: false, message: error.message };
        }
    }

    const register = async (username, email, password) => {
        try{
            const data = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
            });
            setUser(data.user);
            return { success: true };
        } catch(error){
            console.error('Registration error:', error);
            return { success: false, message: error.message };
        }
    }

    const logout = async () => {
        try{
            await apiRequest('/auth/logout', { method: 'POST' });
            setUser(null);
        } catch(error){
            console.error('Logout error:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);