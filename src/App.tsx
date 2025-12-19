import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import Players from './pages/Players.tsx';
import Games from './pages/Games.tsx';
import Consoles from './pages/Consoles.tsx';
import Settings from './pages/Settings.tsx';


function App() {
    return (
        // 1. Enveloppez l'application avec le routeur
        <BrowserRouter>
            {/* 2. Définissez l'ensemble des routes */}
            <Routes>
                <Route element={<Layout />}>
                    {/* Route publique accessible à tous */}
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/consoles" element={<Consoles />} />

                    {/* Route d'authentification */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Routes protégées (voir l'étape 3) */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/players" element={<Players />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Gestion d'une route 404 (optionnel) */}
                    <Route path="*" element={<div>404 - Page non trouvée</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;