import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User as UserIcon, Trophy, Gamepad2, Star, Medal, Crown, Search as SearchIcon } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { fetchAllUsers, fetchAllUsersQuery, type User } from '../http/user'; // Vérifie le chemin
import { getThemeTokens, type Theme } from '../components/theme';

export default function Players() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. LOGIQUE MÉTIER (Votre code original) ---
    const { user } = useAuth();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [order, setOrder] = useState<number>(1);

    // J'ajoute juste un état pour la barre de recherche (filtre visuel uniquement)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const funFetchAllUsers = async () => {
            const res = await fetchAllUsers(order);
            setAllUsers(res);
        }
        const funFetchAllUsersQuery = async () => {
            const res = await fetchAllUsersQuery(searchTerm, order);
            setAllUsers(res);
        }
        if (searchTerm.length > 0) {
            void funFetchAllUsersQuery();
        } else {
            void funFetchAllUsers();
        }
    }, [order, searchTerm]);

    // --- 3. PRÉPARATION DES DONNÉES POUR L'AFFICHAGE ---
    
    // Filtrage client pour la barre de recherche
    const filteredUsers = allUsers.filter(u => 
        (u.nickname || 'Joueur sans pseudo').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Logique de classement (Podium)
    // Comme l'API renvoie déjà trié selon 'order', on prend les 3 premiers de la liste filtrée comme "Top"
    // Sauf si le tri est alphabétique (order 1), auquel cas le podium n'a pas trop de sens, mais on l'affiche quand même.
    const topPlayers = filteredUsers.slice(0, 3);
    
    // Helper pour le badge de rang
    const getRankBadge = (index: number) => {
        const rank = index + 1;
        if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'from-yellow-500 to-yellow-600', label: '1er' };
        if (rank === 2) return { icon: Medal, color: 'text-gray-300', bg: 'from-gray-400 to-gray-500', label: '2ème' };
        if (rank === 3) return { icon: Medal, color: 'text-orange-400', bg: 'from-orange-500 to-orange-600', label: '3ème' };
        return { icon: Star, color: t.text.muted, bg: 'from-purple-500 to-purple-600', label: `${rank}ème` };
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            
            {/* --- HEADER & FILTRES --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className={`text-3xl mb-2 font-bold ${t.text.main}`}>Profils Publics</h2>
                    <p className={`text-sm ${t.text.muted}`}>
                        {allUsers.length} joueur{allUsers.length > 1 ? 's' : ''} inscrits sur la plateforme
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Barre de recherche */}
                    <div className="relative flex-1 sm:w-64">
                        <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${t.text.muted}`} />
                        <input
                            type="text"
                            placeholder="Rechercher un joueur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl transition-all focus:outline-none border ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg} ${t.input.focusBorder}`}
                        />
                    </div>

                    {/* Sélecteur de Tri (Lié à votre state 'order') */}
                    <select
                        id="order"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value))}
                        className={`px-4 py-2.5 rounded-xl transition-all focus:outline-none border cursor-pointer ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.focusBg} ${t.input.focusBorder}`}
                    >
                        <option value={1}>Nom (A-Z)</option>
                        <option value={2}>Jeux suivis (Décroissant)</option>
                        <option value={3}>Succès suivis (Décroissant)</option>
                    </select>
                </div>
            </div>

            {/* --- PODIUM (TOP 3) --- */}
            {filteredUsers.length > 0 && order === 3 &&(
                <div className={`backdrop-blur-2xl rounded-3xl p-8 shadow-xl border ${t.card.bgGradient} ${t.card.border} ${t.card.shadow}`}>
                    <h3 className={`text-xl mb-6 flex items-center gap-2 font-bold ${t.text.main}`}>
                        <Trophy className={`w-6 h-6 ${t.text.highlight}`} />
                        Top Joueurs (selon tri actuel)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topPlayers.map((player, index) => {
                            const badge = getRankBadge(index);
                            return (
                                <div
                                    key={player.id}
                                    className={`relative backdrop-blur-xl rounded-2xl p-6 transition-all hover:scale-105 shadow-lg border ${t.card.base} ${t.card.border} ${t.card.hover}`}
                                >
                                    {/* Badge "C'est vous" */}
                                    {player.id === user?.id && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                                            VOUS
                                        </span>
                                    )}

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.bg} flex items-center justify-center text-white text-2xl shadow-xl font-bold`}>
                                                {player.nickname ? player.nickname.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${badge.bg} flex items-center justify-center shadow-lg border-2 border-white/20`}>
                                                <badge.icon className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-bold mb-0.5 ${t.text.main}`}>
                                                {player.nickname || 'Anonyme'}
                                            </h4>
                                            <p className={`text-sm ${badge.color} font-medium`}>{badge.label}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className={`rounded-xl p-3 text-center bg-black/5 dark:bg-white/5 border ${t.layout.border}`}>
                                            <p className={`text-xl font-bold mb-1 ${t.text.main}`}>{player.countFollowedAchievements}</p>
                                            <p className={`text-xs ${t.text.muted}`}>Succès</p>
                                        </div>
                                        <div className={`rounded-xl p-3 text-center bg-black/5 dark:bg-white/5 border ${t.layout.border}`}>
                                            <p className={`text-xl font-bold mb-1 ${t.text.main}`}>{player.countFollowedGames}</p>
                                            <p className={`text-xs ${t.text.muted}`}>Jeux</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* --- LISTE COMPLÈTE (GRILLE) --- */}
            <div>
                <h3 className={`text-xl mb-4 font-bold ${t.text.main}`}>Tous les joueurs</h3>
                
                {filteredUsers.length === 0 ? (
                    <div className={`backdrop-blur-2xl rounded-2xl p-12 text-center border ${t.card.base} ${t.card.border}`}>
                        <SearchIcon className={`w-16 h-16 mx-auto mb-4 opacity-50 ${t.text.muted}`} />
                        <p className={`${t.text.muted}`}>Aucun joueur trouvé pour "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredUsers.map((player, index) => (
                            <div
                                key={player.id}
                                className={`group backdrop-blur-2xl rounded-3xl p-6 transition-all shadow-lg hover:scale-[1.02] border ${t.card.base} ${t.card.border} ${t.card.hover}`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg font-bold bg-gradient-to-br from-purple-500 to-indigo-600`}>
                                            {player.nickname ? player.nickname.charAt(0).toUpperCase() : <UserIcon className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-bold mb-0.5 ${t.text.main}`}>
                                                {player.nickname || 'Anonyme'}
                                                {player.id === user?.id && <span className="ml-2 text-xs text-blue-500 font-normal">(Vous)</span>}
                                            </h4>
                                            <p className={`text-sm ${t.text.muted}`}>
                                                Inscrit le {new Date(player.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${t.layout.border} ${t.text.muted} bg-black/5 dark:bg-white/5`}>
                                        #{index + 1}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`rounded-xl p-3 text-center border ${t.layout.border} bg-white/40 dark:bg-black/20`}>
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Trophy className={`w-3 h-3 ${t.text.highlight}`} />
                                            <span className={`text-lg font-bold ${t.text.main}`}>{player.countFollowedAchievements}</span>
                                        </div>
                                        <p className={`text-xs ${t.text.muted}`}>Succès suivis</p>
                                    </div>
                                    <div className={`rounded-xl p-3 text-center border ${t.layout.border} bg-white/40 dark:bg-black/20`}>
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <Gamepad2 className={`w-3 h-3 ${t.text.muted}`} />
                                            <span className={`text-lg font-bold ${t.text.main}`}>{player.countFollowedGames}</span>
                                        </div>
                                        <p className={`text-xs ${t.text.muted}`}>Jeux suivis</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}