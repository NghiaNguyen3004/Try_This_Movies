import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages (you'll create these next)
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import GenrePickerPage from './pages/GenrePickerPage.jsx';
import RecommendPage from './pages/RecommendPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

// Components
import NavBar from './components/NavBar.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<GenrePickerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/history" element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}