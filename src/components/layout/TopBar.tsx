import { Search, Sun, Moon, Bell, Plus } from 'lucide-react';

interface TopBarProps {
    theme?: 'dark' | 'light';
    searchQuery?: string;
    // Ces fonctions sont optionnelles, juste là pour que les boutons ne soient pas "morts" visuellement si tu veux les brancher plus tard
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
    return (
        <header className={`sticky top-0 z-30 ${
            theme === 'dark'
                ? 'bg-gray-900/60 backdrop-blur-2xl border-b border-purple-500/20 shadow-sm shadow-purple-500/10'
                : 'bg-white/60 backdrop-blur-2xl border-b border-purple-200/30 shadow-sm shadow-purple-500/5'
        }`}>
            <div className="px-12 py-4 flex items-center justify-between">

                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Rechercher des jeux, joueurs ou consoles..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className={`w-full pl-11 pr-4 py-2.5 backdrop-blur-xl rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                                theme === 'dark'
                                    ? 'bg-gray-800/80 border border-purple-500/20 text-white placeholder-purple-400/60 focus:bg-gray-800'
                                    : 'bg-purple-50/80 border border-purple-200/30 text-indigo-900 placeholder-purple-400 focus:bg-purple-50'
                            }`}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleTheme}
                        className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${
                            theme === 'dark'
                                ? 'text-purple-400 hover:bg-purple-500/20'
                                : 'text-purple-600 hover:bg-purple-100/50'
                        }`}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button className={`p-2.5 rounded-xl transition-all backdrop-blur-xl ${
                        theme === 'dark'
                            ? 'text-purple-400 hover:bg-purple-500/20'
                            : 'text-purple-600 hover:bg-purple-100/50'
                    }`}>
                        <Bell className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onOpenAddPlayer}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Joueur
                    </button>

                    <button
                        onClick={onOpenAddGame}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm rounded-xl shadow-lg shadow-purple-500/30 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Jeu
                    </button>
                </div>
            </div>
        </header>
    );
}