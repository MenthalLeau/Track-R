import { Search, Sun, Moon, Bell, Plus } from 'lucide-react';
import type { Theme } from '../theme';
import { getThemeTokens } from '../theme';
import { useAuth } from '../../context/AuthContext.tsx';


interface TopBarProps {
    theme?: Theme;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onToggleTheme?: () => void;
    onOpenAddConsole?: () => void;
    onOpenAddGame?: () => void;
}

export function TopBar({
                           theme = 'dark',
                           searchQuery = '',
                           onSearchChange,
                           onToggleTheme,
                           onOpenAddConsole,
                           onOpenAddGame
                       }: TopBarProps) {

    const { user, loading, profile } = useAuth();

    const t = getThemeTokens(theme);

    return (
        <header className={`sticky top-0 z-30 border-b transition-colors duration-300 ${t.layout.bg} ${t.layout.border}`}>
            {/* Ajustement du padding pour être responsive : px-6 sur mobile, px-12 sur desktop */}
            <div className="px-6 md:px-12 py-4 flex items-center justify-between">

                {/* Search */}
                <div className="flex-1 max-w-xl mr-4">
                    <div className="relative group">
                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${t.text.muted} group-focus-within:text-purple-500`} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            aria-label="Rechercher"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 border ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        onClick={onToggleTheme}
                        aria-label="Changer le thème"
                        className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${t.iconButton.base} ${t.iconButton.hover}`}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        aria-label="Notifications"
                        className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${t.iconButton.base} ${t.iconButton.hover}`}
                    >
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-gray-200/20 mx-1"></div>

                    {/* Boutons d'action : Texte caché sur mobile pour gagner de la place */}
                    {!loading && user && profile?.rid>1 &&(
                        <>
                            <button
                                onClick={onOpenAddConsole}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.hover} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                                title="Ajouter une console"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden md:inline font-medium">Console</span>
                            </button>

                            <button
                                onClick={onOpenAddGame}
                                className={`flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.hover} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                                title="Ajouter un jeu"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden md:inline font-medium">Jeu</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}