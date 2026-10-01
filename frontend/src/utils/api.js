const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiRequest = async (endpoint, options = {}) =>{
    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (response.status === 401){
        window.location.href = '/login';
        return;
    }
    
    const data = await response.json();
    if (!response.ok){
        throw new Error(data.message || 'API request failed');
    }
    return data;
}

