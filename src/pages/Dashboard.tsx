import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Trophy, Edit, Gamepad2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getThemeTokens } from '../components/theme';
import type { Theme } from '../components/theme';

// Interfaces pour les données (Simulées pour l'instant)
interface GameProgress {
    gameId: number;
    title: string;
    console: string;
    hoursPlayed: number;
    lastPlayed: string;
    achievementsUnlocked: number;
    totalAchievements: number;
    coverUrl?: string;
}

export default function Dashboard() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. AUTHENTIFICATION ---
    const { user, profile } = useAuth();

    // --- 3. ÉTATS ---
    const [gameProgress, setGameProgress] = useState<GameProgress[]>([]);
    const [loading, setLoading] = useState(true);

    // --- 4. CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        // Simulation de la récupération des "Jeux suivis" depuis la BDD
        // Plus tard, cela viendra de : await supabase.from('user_games').select(...)
        const loadUserActivity = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 800)); // Petit délai pour l'effet

            const mockData: GameProgress[] = [
                {
                    gameId: 101,
                    title: 'The Legend of Zelda: TOTK',
                    console: 'Switch',
                    hoursPlayed: 125,
                    lastPlayed: 'À l\'instant',
                    achievementsUnlocked: 45,
                    totalAchievements: 50
                },
                {
                    gameId: 102,
                    title: 'God of War Ragnarök',
                    console: 'PS5',
                    hoursPlayed: 42,
                    lastPlayed: 'Hier',
                    achievementsUnlocked: 12,
                    totalAchievements: 36
                },
                {
                    gameId: 103,
                    title: 'Elden Ring',
                    console: 'PC',
                    hoursPlayed: 89,
                    lastPlayed: 'Il y a 3 jours',
                    achievementsUnlocked: 20,
                    totalAchievements: 42
                },
            ];
            setGameProgress(mockData);
            setLoading(false);
        };

        if (user) loadUserActivity();
    }, [user]);

    // Données calculées
    const displayName = profile?.nickname || user?.email?.split('@')[0] || 'Gamer';
    const playerLevel = 12; // À dynamiser plus tard
    const totalHours = gameProgress.reduce((sum, gp) => sum + gp.hoursPlayed, 0);
    const badgeCount = 4; // À dynamiser

    if (!user) return null; // Ou redirection gérée par le routeur/auth guard

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- COLONNE GAUCHE (PRINCIPALE) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 1. En-tête Joueur */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-5xl border-4 flex-shrink-0 shadow-xl overflow-hidden ${t.cover.bgGradient} ${t.layout.border} ${t.text.main}`}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Infos */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <h2 className={`text-4xl font-bold ${t.text.main}`}>{displayName}</h2>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold border ${t.layout.bg} ${t.layout.border} ${t.text.main}`}>
                                        {playerLevel}
                                    </div>
                                </div>
                                <p className={`${t.text.muted} text-lg`}>
                                    Membre depuis {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Activité Récente */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold ${t.text.main}`}>Activité récente</h3>
                            <p className={`${t.text.muted}`}>{totalHours} h jouées au total</p>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <p className={`text-center py-8 ${t.text.muted}`}>Chargement de vos exploits...</p>
                            ) : gameProgress.map((progress) => {
                                const percentage = Math.round((progress.achievementsUnlocked / progress.totalAchievements) * 100);

                                return (
                                    <div key={progress.gameId} className={`rounded-xl p-4 border transition-colors ${currentTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-100'}`}>
                                        <div className="flex gap-4 mb-4">
                                            {/* Cover Jeu */}
                                            <div className={`w-24 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${t.cover.bgGradient}`}>
                                                {progress.coverUrl ? (
                                                    <img src={progress.coverUrl} alt={progress.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Gamepad2 className="w-8 h-8 text-white/50" />
                                                )}
                                            </div>

                                            {/* Détails Jeu */}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-lg font-bold ${t.text.main}`}>{progress.title}</h4>
                                                    <span className={`text-xs px-2 py-1 rounded border ${t.layout.border} ${t.text.muted}`}>
                                                        {progress.console}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span className={`${t.text.muted}`}>{progress.hoursPlayed} h jouées</span>
                                                    <span className={`${t.text.inactive}`}>Dernière session : {progress.lastPlayed}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barre de Progression Succès */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className={`w-4 h-4 ${t.text.highlight}`} />
                                                    <span className={`${t.text.main}`}>Succès débloqués</span>
                                                </div>
                                                <span className={`${t.text.muted}`}>{progress.achievementsUnlocked} / {progress.totalAchievements} ({percentage}%)</span>
                                            </div>

                                            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                                                <div
                                                    className={`h-full transition-all duration-1000 ease-out ${t.primaryAction.bgGradient}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {gameProgress.length === 0 && !loading && (
                                <div className={`text-center py-8 border-2 border-dashed rounded-xl ${t.layout.border}`}>
                                    <p className={`${t.text.muted}`}>Vous ne suivez aucun jeu pour le moment.</p>
                                    <Link to="/games" className={`inline-flex items-center gap-2 mt-2 font-medium ${t.text.highlight} hover:underline`}>
                                        Explorer la bibliothèque <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- COLONNE DROITE (SIDEBAR) --- */}
                <div className="space-y-6">

                    {/* Carte Niveau */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`text-xl font-bold ${t.text.main}`}>
                                Niveau <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ml-2 text-sm border ${t.layout.bg} ${t.layout.border}`}>{playerLevel}</span>
                            </h3>
                        </div>

                        <p className={`text-sm mb-6 ${t.text.muted}`}>
                            Gagnez de l'XP en débloquant des succès et en ajoutant des jeux à votre collection.
                        </p>

                        <Link to="/settings" className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border ${t.layout.bg} ${t.layout.border} ${t.text.main} hover:bg-black/5`}>
                            <Edit className="w-4 h-4" />
                            Modifier le profil
                        </Link>
                    </div>

                    {/* Badges */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <h3 className={`font-bold mb-4 ${t.text.main}`}>
                            Badges <span className={`${t.text.muted} font-normal ml-1`}>{badgeCount}</span>
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((badge) => (
                                <div key={badge} className={`aspect-square rounded-xl flex items-center justify-center shadow-md ${t.cover.bgGradient}`}>
                                    <Trophy className="w-6 h-6 text-white" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Liens Rapides / Stats */}
                    <div className={`rounded-2xl p-4 border shadow-lg space-y-1 ${t.card.base} ${t.card.border}`}>
                        <Link to="/games" className={`block w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-purple-500/10 ${t.text.main}`}>
                            Jeux suivis <span className={`${t.text.muted} ml-1`}>{gameProgress.length}</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}