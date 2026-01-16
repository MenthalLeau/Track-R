import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Trophy, Edit, Gamepad2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getThemeTokens } from '../components/theme';
import type { Theme } from '../components/theme';
import { fetchGamesLinkedToUserWithAllAchievements, type Game } from '../http/game';
import { fetchUserUnlockedAchievementsIds } from '../http/achievement';

export default function Dashboard() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. AUTHENTIFICATION ---
    const { user, profile } = useAuth();

    // --- 3. ÉTATS ---
    const [loading, setLoading] = useState(true);
    const [gameLinkedToUser, setGameLinkedToUser] = useState<Game[]>([]);
    const [followedAchievementsIds, setFollowedAchievementsIds] = useState<number[]>([]);

    // Chargement des données réelles
    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const games = await fetchGamesLinkedToUserWithAllAchievements(user.id);
                setGameLinkedToUser(games);

                const achievementIds = await fetchUserUnlockedAchievementsIds(user.id);
                setFollowedAchievementsIds(achievementIds);
            } catch (error) {
                console.error("Erreur lors du chargement du dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    // --- 4. DONNÉES CALCULÉES ---
    const displayName = profile?.nickname || user?.email?.split('@')[0] || 'Gamer';
    
    // Données statiques pour le moment (car absentes de l'interface Game)
    const playerLevel = 12; 
    const badgeCount = 4;

    // Calculs globaux basés sur les données réelles
    const totalGames = gameLinkedToUser.length;
    // On compte ceux que l'utilisateur a réellement (longueur du tableau d'IDs suivis)
    const totalUnlockedAchievements = followedAchievementsIds.length;

    if (!user) return null;

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

                    {/* 2. Bibliothèque de Jeux (Dynamique) */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-bold ${t.text.main}`}>Ma Bibliothèque</h3>
                            <p className={`${t.text.muted}`}>
                                {totalUnlockedAchievements} succès débloqués
                            </p>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {/* Squelette de chargement simple */}
                                    {[1, 2].map(i => (
                                        <div key={i} className={`h-32 rounded-xl animate-pulse ${t.layout.bg === 'bg-white' ? 'bg-gray-200' : 'bg-white/5'}`} />
                                    ))}
                                    <p className={`text-center py-4 ${t.text.muted}`}>Synchronisation de votre collection...</p>
                                </div>
                            ) : (
                                gameLinkedToUser.map((game) => {
                                    // Calculs par jeu
                                    const gameTotalAchievements = game.achievements?.length || 0;
                                    // On compte combien d'achievements de CE jeu sont dans la liste globale des suivis
                                    const gameUnlockedAchievements = game.achievements?.filter(a => followedAchievementsIds.includes(a.id)).length || 0;
                                    console.log("Game:", game.name, "Total Achievements:", gameTotalAchievements, "Unlocked:", gameUnlockedAchievements);
                                    const percentage = gameTotalAchievements > 0 
                                        ? Math.round((gameUnlockedAchievements / gameTotalAchievements) * 100) 
                                        : 0;

                                    // Gestion de l'affichage des consoles
                                    const consoleDisplay = game.consoles && game.consoles.length > 0 
                                        ? game.consoles.map(c => c.name).join(', ') 
                                        : 'Console inconnue';

                                    return (
                                        <div key={game.id} className={`rounded-xl p-4 border transition-colors ${currentTheme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-purple-50 border-purple-100'}`}>
                                            <div className="flex gap-4 mb-4">
                                                {/* Cover Jeu */}
                                                <div className={`w-24 h-16 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden ${t.cover.bgGradient}`}>
                                                    {game.image_url ? (
                                                        <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Gamepad2 className="w-8 h-8 text-white/50" />
                                                    )}
                                                </div>

                                                {/* Détails Jeu */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`text-lg font-bold ${t.text.main}`}>{game.name}</h4>
                                                        {game.pegi && (
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${t.layout.border} ${t.text.muted}`}>
                                                                PEGI {game.pegi}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between text-sm mt-1">
                                                        <span className={`${t.text.muted}`}>{consoleDisplay}</span>
                                                        {/* Heures jouées retirées car non dispo dans l'API */}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Barre de Progression Succès */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className={`w-4 h-4 ${t.text.highlight}`} />
                                                        <span className={`${t.text.main}`}>Succès</span>
                                                    </div>
                                                    <span className={`${t.text.muted}`}>
                                                        {gameUnlockedAchievements} / {gameTotalAchievements} ({percentage}%)
                                                    </span>
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
                                })
                            )}

                            {gameLinkedToUser.length === 0 && !loading && (
                                <div className={`text-center py-8 border-2 border-dashed rounded-xl ${t.layout.border}`}>
                                    <p className={`${t.text.muted}`}>Vous n'avez aucun jeu lié pour le moment.</p>
                                    <Link to="/games" className={`inline-flex items-center gap-2 mt-2 font-medium ${t.text.highlight} hover:underline`}>
                                        Ajouter des jeux <ArrowRight className="w-4 h-4" />
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
                            Gagnez de l'XP en complétant votre collection.
                        </p>

                        <Link to="/settings" className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border ${t.layout.bg} ${t.layout.border} ${t.text.main} hover:bg-black/5`}>
                            <Edit className="w-4 h-4" />
                            Modifier le profil
                        </Link>
                    </div>

                    {/* Badges (Statique pour l'instant) */}
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

                    {/* Liens Rapides / Stats globales */}
                    <div className={`rounded-2xl p-4 border shadow-lg space-y-1 ${t.card.base} ${t.card.border}`}>
                        <Link to="/games" className={`block w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-purple-500/10 ${t.text.main}`}>
                            Jeux suivis <span className={`${t.text.muted} ml-1`}>{totalGames}</span>
                        </Link>
                        <div className={`block w-full text-left px-3 py-2 rounded-lg ${t.text.main}`}>
                            Total Succès <span className={`${t.text.muted} ml-1`}>{totalUnlockedAchievements}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}