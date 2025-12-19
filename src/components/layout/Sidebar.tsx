import { Link, useLocation } from 'react-router-dom';
import { Search, User, Gamepad2, Trophy } from 'lucide-react';
import { getThemeTokens } from '../theme';
import type { Theme } from '../theme';

interface SidebarProps {
    theme?: Theme;
}

export function Sidebar({ theme = 'dark' }: SidebarProps) {
    const location = useLocation();
    const t = getThemeTokens(theme);

    const isActive = (path: string) => location.pathname === path;

    const getLinkClass = (path: string) => {
        // Structure de base (padding, marges, rounded)
        const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1";

        // CAS 1 : Lien Actif
        // On utilise les tokens 'primaryAction' qui correspondent exactement à ton gradient violet + ombre
        if (isActive(path)) {
            return `${baseClass} ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`;
        }

        // CAS 2 : Lien Inactif
        // On utilise 'text.inactive' et 'iconButton.hover' pour l'effet de survol
        return `${baseClass} ${t.text.inactive} ${t.iconButton.hover} hover:${t.text.muted}`;
    };

    return (
        <aside className={`w-64 fixed inset-y-0 left-0 z-40 flex flex-col shadow-xl transition-colors duration-300 border-r ${t.layout.bg} ${t.layout.border}`}>

            {/* Logo */}
            <div className={`px-6 py-6 border-b transition-colors duration-300 ${t.layout.border}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-white font-bold">T</span>
                    </div>
                    <div>
                        <span className={`text-lg font-bold block leading-none ${t.text.main}`}>Track-R</span>
                        <p className={`text-xs mt-1 ${t.text.muted}`}>by artaLeau</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
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

            {/* User Profile */}
            <div className={`px-4 py-4 border-t transition-colors duration-300 ${t.layout.border}`}>
                <div className={`flex items-center gap-3 px-4 py-3 backdrop-blur-xl rounded-xl border transition-all ${t.card.bgGradient} ${t.card.border}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${t.text.main}`}>GamerPro</p>
                        <p className={`text-xs ${t.text.muted}`}>Niveau 12</p>
                    </div>
                </div>
            </div>

        </aside>
    );
}