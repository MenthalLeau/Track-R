import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
    Trophy, 
    Gamepad2, 
    User as UserIcon, 
    Calendar, 
    ArrowRight, 
    Loader2, 
    Monitor 
} from 'lucide-react';

import { fetchUsersWithMostFollowedAchievements, type User } from '../http/user';
import { fetchMostFollowedGames, type Game } from '../http/game';
import { fetchConsolesByDate, type GameConsole } from '../http/console';
import { getThemeTokens, type Theme } from '../components/theme';

export default function Home() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. LOGIQUE MÉTIER (STRICTEMENT CONSERVÉE) ---
    const [bestUsers, setBestUsers] = useState<User[]>([]);
    const [bestGames, setBestGames] = useState<Game[]>([]);
    const [latestConsoles, setLatestConsoles] = useState<GameConsole[]>([]);
    const [loading, setLoading] = useState(true); // Ajout d'un état de chargement pour l'UX

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const funBestUsers = async () => {
                    const res = await fetchUsersWithMostFollowedAchievements(2);
                    setBestUsers(res);
                }
                const funBestGames = async () => {
                    const res = await fetchMostFollowedGames(3);
                    setBestGames(res);
                }
                const funLatestConsoles = async () => {
                    const res = await fetchConsolesByDate();
                    setLatestConsoles(res);
                }
                
                // On exécute tout en parallèle
                await Promise.all([funBestUsers(), funBestGames(), funLatestConsoles()]);
            } catch (error) {
                console.error("Erreur chargement dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadAllData();
    }, []);

    // --- 3. RENDU VISUEL ---
    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-500">
            
            {/* --- HERO SECTION --- */}
            <section className={`rounded-3xl p-12 shadow-2xl backdrop-blur-xl border ${t.layout.border} ${
                currentTheme === 'dark' 
                ? 'bg-gradient-to-br from-purple-900/80 to-indigo-900/80 shadow-purple-500/20' 
                : 'bg-gradient-to-br from-purple-500 to-indigo-500 shadow-purple-500/30 text-white'
            }`}>
                <div className="max-w-2xl">
                    <h1 className={`text-4xl font-bold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-white'}`}>
                        Bienvenue sur Track-R
                    </h1>
                    <p className={`text-lg mb-8 ${currentTheme === 'dark' ? 'text-purple-200' : 'text-purple-100'}`}>
                        Suivez vos jeux, comparez vos succès et découvrez les dernières nouveautés sur toutes vos consoles préférées.
                    </p>
                    <div className="flex gap-4">
                        <Link 
                            to="/games" 
                            className="px-6 py-3 bg-white text-purple-900 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg"
                        >
                            Voir la bibliothèque
                        </Link>
                        <Link 
                            to="/players" 
                            className="px-6 py-3 bg-purple-700/50 text-white border border-white/20 rounded-xl font-medium hover:bg-purple-700/70 transition-colors backdrop-blur-md"
                        >
                            Chercher un joueur
                        </Link>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="text-center">
                        <Loader2 className={`w-10 h-10 animate-spin mx-auto mb-4 ${t.text.muted}`} />
                        <p className={t.text.muted}>Chargement des données...</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* --- TOP UTILISATEURS --- */}
                    {bestUsers.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold mb-1 ${t.text.main}`}>Top Joueurs</h2>
                                    <p className={`text-sm ${t.text.muted}`}>Les chasseurs de succès les plus actifs</p>
                                </div>
                                <Link to="/players" className={`flex items-center gap-1 text-sm font-medium ${t.text.highlight} hover:underline`}>
                                    Voir tout <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {bestUsers.map((user, index) => (
                                    <div 
                                        key={user.id} 
                                        className={`group relative flex items-center gap-6 p-6 rounded-3xl transition-all hover:scale-[1.02] shadow-lg border ${t.card.base} ${t.card.border} ${t.card.shadow} ${t.card.hover}`}
                                    >
                                        {/* Badge Rang */}
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${t.layout.bg} ${t.layout.border} ${t.text.muted}`}>
                                            #{index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl ${t.cover.bgGradient}`}>
                                            {user.nickname ? user.nickname.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
                                        </div>

                                        {/* Infos */}
                                        <div className="flex-1">
                                            <h3 className={`text-xl font-bold mb-1 ${t.text.main}`}>
                                                {user.nickname || 'Joueur Anonyme'}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                                    <span className={`font-bold ${t.text.main}`}>{user.countFollowedAchievements}</span>
                                                    <span className={`text-xs ${t.text.muted}`}>succès</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- JEUX LES PLUS SUIVIS --- */}
                    {bestGames.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold mb-1 ${t.text.main}`}>Jeux Populaires</h2>
                                    <p className={`text-sm ${t.text.muted}`}>Les titres les plus suivis par la communauté</p>
                                </div>
                                <Link to="/games" className={`flex items-center gap-1 text-sm font-medium ${t.text.highlight} hover:underline`}>
                                    Voir tout <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {bestGames.map((game) => (
                                    <div 
                                        key={game.id} 
                                        className={`group overflow-hidden rounded-2xl cursor-pointer transition-all hover:scale-105 shadow-lg border ${t.card.base} ${t.card.border} ${t.card.shadow}`}
                                    >
                                        <div className={`aspect-video relative flex items-center justify-center overflow-hidden ${t.cover.bgGradient}`}>
                                            {game.image_url ? (
                                                <img src={game.image_url} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <Gamepad2 className="w-12 h-12 text-white/50" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-white font-bold text-lg truncate">{game.name}</h3>
                                            </div>
                                        </div>
                                        <div className="p-4 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${t.layout.border} ${t.text.muted}`}>
                                                    PEGI {game.pegi}
                                                </span>
                                            </div>
                                            {/* Note: Ajoutez countFollowers dans l'interface Game si disponible */}
                                            <Gamepad2 className={`w-5 h-5 ${t.text.muted}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- DERNIÈRES CONSOLES --- */}
                    {latestConsoles.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold mb-1 ${t.text.main}`}>Dernières Consoles</h2>
                                    <p className={`text-sm ${t.text.muted}`}>Les consoles récemment ajoutées à la base</p>
                                </div>
                                <Link to="/consoles" className={`flex items-center gap-1 text-sm font-medium ${t.text.highlight} hover:underline`}>
                                    Voir tout <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {latestConsoles.map((consoleItem) => (
                                    <div 
                                        key={consoleItem.id} 
                                        className={`p-6 rounded-2xl border transition-all hover:border-purple-500/50 shadow-md ${t.card.base} ${t.card.border} ${t.card.hover}`}
                                    >
                                        <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${t.cover.bgGradient} shadow-lg`}>
                                            <Monitor className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className={`font-bold text-lg mb-1 truncate ${t.text.main}`}>{consoleItem.name}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className={`w-4 h-4 ${t.text.muted}`} />
                                            <span className={t.text.muted}>{consoleItem.release_year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};