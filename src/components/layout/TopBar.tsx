import { Search, Sun, Moon, Bell, Plus } from 'lucide-react';
// Assure-toi que le chemin d'import est correct selon où tu as mis le fichier theme.ts
import type { Theme } from '../theme';
import { getThemeTokens } from '../theme';

interface TopBarProps {
    theme?: Theme;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onToggleTheme?: () => void;
    onOpenAddPlayer?: () => void;
    onOpenAddGame?: () => void;
}

export function TopBar({
                           theme = 'dark',
                           searchQuery = '',
                           onSearchChange,
                           onToggleTheme,
                           onOpenAddPlayer,
                           onOpenAddGame
                       }: TopBarProps) {

    // On récupère tous les tokens pour le thème actuel
    const t = getThemeTokens(theme);

    return (
        <header className={`sticky top-0 z-30 border-b transition-colors duration-300 ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>
            <div className="px-12 py-4 flex items-center justify-between">

                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.text.muted}`} />
                        <input
                            type="text"
                            placeholder="Rechercher des jeux, joueurs ou consoles..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className={`w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 border ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleTheme}
                        className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${t.iconButton.base} ${t.iconButton.hover}`}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${t.iconButton.base} ${t.iconButton.hover}`}>
                        <Bell className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onOpenAddPlayer}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.hover} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                    >
                        <Plus className="w-4 h-4" />
                        Joueur
                    </button>

                    <button
                        onClick={onOpenAddGame}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.hover} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                    >
                        <Plus className="w-4 h-4" />
                        Jeu
                    </button>
                </div>
            </div>
        </header>
    );
}