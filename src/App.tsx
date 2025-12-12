import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Home from './pages/Home.tsx';

function App() {
    return (
        // 1. Enveloppez l'application avec le routeur
        <BrowserRouter>
            {/* 2. Définissez l'ensemble des routes */}
            <Routes>
                <Route element={<Layout />}>
                    {/* Route publique accessible à tous */}
                    <Route path="/" element={<Home />} />

                    {/* Route d'authentification */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes protégées (voir l'étape 3) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Gestion d'une route 404 (optionnel) */}
                    <Route path="*" element={<div>404 - Page non trouvée</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;