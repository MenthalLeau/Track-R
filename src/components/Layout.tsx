import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { TopBar } from './layout/TopBar';

export default function Layout() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        // Ce div englobe toute l'application
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark' ? 'bg-slate-950' : 'bg-purple-50'
        }`}>

            {/* La Sidebar reste 'fixed', elle flotte au-dessus */}
            <Sidebar theme={theme} />

            {/* --- C'EST ICI QUE LA MAGIE OPÈRE --- */}
            {/* On ajoute 'ml-64' pour pousser tout ce bloc à droite de la sidebar */}
            <div className="ml-64 flex flex-col min-h-screen transition-all duration-300">

                {/* La Navbar sera maintenant collée au bord droit de la sidebar */}
                <TopBar
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />

                {/* Le contenu changeant (Outlet) s'affiche ici */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}