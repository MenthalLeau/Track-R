import { Link, useLocation } from 'react-router-dom';
import { Search, User, Gamepad2, Trophy } from 'lucide-react';

interface SidebarProps {
    theme?: 'dark' | 'light';
}

export function Sidebar({ theme = 'dark' }: SidebarProps) {
    const location = useLocation();

    // Vérifie si le chemin actuel correspond au lien pour activer le style
    const isActive = (path: string) => location.pathname === path;

    // Génère les classes dynamiques pour les liens
    const getLinkClass = (path: string) => {
        const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1";

        // Si le lien est actif (sélectionné)
        if (isActive(path)) {
            return `${baseClass} bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30`;
        }

        // Si le lien est inactif (selon le thème)
        return theme === 'dark'
            ? `${baseClass} text-gray-300 hover:bg-purple-500/20 hover:text-purple-300`
            : `${baseClass} text-indigo-700 hover:bg-purple-100/50 hover:text-purple-700`;
    };

    return (
        <aside className={`w-64 fixed inset-y-0 left-0 z-40 flex flex-col shadow-xl ${
            theme === 'dark'
                ? 'bg-gray-900/60 backdrop-blur-2xl border-r border-purple-500/20 shadow-purple-500/10'
                : 'bg-white/60 backdrop-blur-2xl border-r border-purple-200/30 shadow-purple-500/5'
        }`}>

            {/* Logo */}
            <div className={`px-6 py-6 ${
                theme === 'dark' ? 'border-b border-purple-500/20' : 'border-b border-purple-200/30'
            }`}>
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-white font-bold">T</span>
                    </div>
                    <div>
            <span className={`text-lg font-bold block leading-none ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>
              Track-R
            </span>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`}>
                            by artaLeau
                        </p>
                    </div>
                </Link>
            </div>

            {/* TopBar */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <Link to="/" className={getLinkClass('/')}>
                    <Search className="w-5 h-5" />
                    Accueil
                </Link>

                <Link to="/players" className={getLinkClass('/players')}>
                    <User className="w-5 h-5" />
                    Joueurs
                </Link>

                <Link to="/games" className={getLinkClass('/games')}>
                    <Gamepad2 className="w-5 h-5" />
                    Jeux
                </Link>

                <Link to="/consoles" className={getLinkClass('/consoles')}>
                    <Trophy className="w-5 h-5" />
                    Consoles
                </Link>
            </nav>

            {/* User Profile Footer */}
            <div className={`px-4 py-4 ${
                theme === 'dark' ? 'border-t border-purple-500/20' : 'border-t border-purple-200/30'
            }`}>
                <div className={`flex items-center gap-3 px-4 py-3 backdrop-blur-xl rounded-xl cursor-pointer transition-colors ${
                    theme === 'dark'
                        ? 'bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/20 hover:border-purple-500/40'
                        : 'bg-gradient-to-br from-purple-100/80 to-purple-50/80 border border-purple-200/30 hover:border-purple-300/50'
                }`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>
                            GamerPro
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            Niveau 12
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}