import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Gamepad2, Plus, Edit2, Trash2, X, Star, Trophy, Heart } from 'lucide-react';
import { createGame, updateGame, deleteGame, type Game, fetchALLGamesWithConsole, fetchUserFollowedGamesIds, unlinkGameFromUser, linkGameToUser } from "../http/game";
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";
import { getThemeTokens } from "../components/theme";
import type { Theme } from "../components/theme";
import { fetchAchievementsForGame, fetchUserUnlockedAchievementsIds, linkAchievementToUser, unlinkAchievementFromUser, type Achievement } from "../http/achievement";


export default function Games() {
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    const [games, setGames] = useState<Game[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [achievementsForSelectedGame, setAchievementsForSelectedGame] = useState<Omit<Achievement, 'game'>[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [followedGameIds, setFollowedGameIds] = useState<number[]>([]); // Pour les jeux suivis
    const [followedAchievementsIds, setFollowedAchievementsIds] = useState<number[]>([]); // Pour les succès suivis

    const { profile, user } = useAuth();
    const isAdmin = profile && profile.rid === 2;

    const loadGames = async () => {
        try {
            const data = await fetchALLGamesWithConsole();
            setGames(data);

            if (user) {
                const ids = await fetchUserFollowedGamesIds(user.id);
                setFollowedGameIds(ids);
                const achIds = await fetchUserUnlockedAchievementsIds(user.id);
                setFollowedAchievementsIds(achIds);
            }
        } catch (error) {
            console.error("Erreur chargement jeux:", error);
        }
    };

    useEffect(() => {
        const funGetAchievements = async () => {
            if (selectedGame) {
                const res = await fetchAchievementsForGame(selectedGame.id);
                setAchievementsForSelectedGame(res);
            }
        };
        funGetAchievements();
    }, [selectedGame]);


    useEffect(() => {
        loadGames();
    }, []);

    // --- HANDLERS ---

    const handleToggleFollow = async (gameId: number) => {
        if (!user) return;

        const isFollowed = followedGameIds.includes(gameId);

        try {
            if (isFollowed) {
                // Unfollow
                const confirm = window.confirm("Voulez-vous arrêter de suivre ce jeu ?");
                if (!confirm) return;

                await unlinkGameFromUser(gameId, user.id);
                setFollowedGameIds(prev => prev.filter(id => id !== gameId));
            } else {
                // Follow
                await linkGameToUser(gameId, user.id);
                setFollowedGameIds(prev => [...prev, gameId]);
            }
        } catch (error) {
            console.error("Erreur suivi/désuivi:", error);
            alert("Une erreur est survenue lors de la mise à jour du suivi.");
        }
    };

    const handleToggleFollowAchievement = async (achievementId: number) => {
        if (!user) return;

        const isFollowed = followedAchievementsIds.includes(achievementId);

        try {
            if (isFollowed) {

                await unlinkAchievementFromUser(user.id, achievementId);
                setFollowedAchievementsIds(prev => prev.filter(id => id !== achievementId));
            } else {
                // Follow
                await linkAchievementToUser(user.id, achievementId);
                setFollowedAchievementsIds(prev => [...prev, achievementId]);
            }
        } catch (error) {
            console.error("Erreur suivi/désuivi succès:", error);
            alert("Une erreur est survenue lors de la mise à jour du suivi du succès.");
        }
    }

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
            try {
                await deleteGame(id);
                setSelectedGame(null);
                loadGames();
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer le jeu");
            }
        }
    };

    const handleFormSubmit = async (formData: any, isUpdate: boolean, id?: number) => {
        try {
            if (isUpdate && id) {
                await updateGame(id, formData);
                alert('Jeu modifié avec succès !');
                setIsEditing(false);
                setSelectedGame(null);
            } else {
                await createGame(formData);
                alert('Nouveau jeu créé !');
                setIsCreating(false);
            }
            loadGames();
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            alert("Une erreur est survenue.");
        }
    };

    // --- RENDER ---

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className={`text-3xl font-bold ${t.text.main}`}>Bibliothèque de jeux</h2>
                {isAdmin && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter un jeu</span>
                    </button>
                )}
            </div>

            {/* Empty State */}
            {games.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center ${t.card.base} ${t.card.border} ${t.card.shadow}`}>
                    <Gamepad2 className={`w-20 h-20 mx-auto mb-4 opacity-70 ${t.text.muted}`} />
                    <h3 className={`text-2xl mb-2 ${t.text.main}`}>Aucun jeu disponible</h3>
                    <p className={`${t.text.muted}`}>
                        {isAdmin ? "Commencez par ajouter des jeux à la bibliothèque." : "La bibliothèque est vide pour le moment."}
                    </p>
                </div>
            ) : (
                /* Grid des Jeux */
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => {
                                setSelectedGame(game);
                                setIsEditing(false);
                            }}
                            className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${t.card.base} border ${t.card.border} ${t.card.shadow} ${t.card.hover} ${t.card.hoverBorder}`}
                        >
                            {/* Cover Image */}
                            <div className={`aspect-[3/4] relative flex items-center justify-center overflow-hidden ${t.cover.bgGradient}`}>
                                {game.image_url ? (
                                    <img
                                        src={game.image_url}
                                        alt={game.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <Gamepad2 className="w-12 h-12 text-white/50" />
                                )}
                                {/* Badge Console */}
                                {game.consoles && game.consoles.length > 0 && (
                                    <div className={`absolute top-2 right-2 px-2 py-1 backdrop-blur-md rounded-md text-xs border ${t.layout.bg} ${t.layout.border} ${t.text.main}`}>
                                        {game.consoles[0].name}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className={`font-medium truncate mb-1 ${t.text.main}`} title={game.name}>{game.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs px-2 py-1 rounded ${t.text.muted} ${currentTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                                        PEGI {game.pegi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODALE DÉTAILS / ÉDITION --- */}
            {selectedGame && (
                <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 ${t.modal.overlay}`} onClick={() => setSelectedGame(null)}>

                    {/* Conteneur Modale */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-3xl max-w-2xl w-full p-8 relative ${t.modal.bgGradient} border ${t.modal.border} ${t.modal.shadow} overflow-hidden max-h-[90vh] overflow-y-auto`}
                    >

                        {isEditing && isAdmin ? (
                            /* --- MODE ÉDITION (ADMIN) --- */
                            <>
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${t.iconButton.base} ${t.iconButton.hover} bg-black/10`}
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-2xl font-bold flex items-center gap-2 ${t.text.main}`}>
                                        <Edit2 className={`w-6 h-6 ${t.text.muted}`} />
                                        Modifier {selectedGame.name}
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className={`text-sm underline ${t.text.muted} hover:${t.text.main}`}
                                    >
                                        Annuler
                                    </button>
                                </div>

                                <GenericAdminForm
                                    initialData={{
                                        ...selectedGame,
                                        gameconsoles: selectedGame.consoles ? selectedGame.consoles.map(c => c.id) : []
                                    }}
                                    foreignTables={['console']}
                                    fields={[
                                        { name: 'name', label: 'Nom du jeu', type: 'text', required: true },
                                        { name: 'description', label: 'Description', type: 'textarea' },
                                        { name: 'pegi', label: 'PEGI', type: 'number' },
                                        { name: 'image_url', label: 'Image URL', type: 'text' },
                                        { name: 'gameconsoles', label: 'Consoles associées', type: 'superselect', foreignTable: 'console' }
                                    ]}
                                    onSubmit={(data) => handleFormSubmit(data, true, selectedGame.id)}
                                    onSuccess={() => {}}
                                />
                            </>
                        ) : (
                            /* --- MODE VISUALISATION (DESIGN DEMANDÉ) --- */
                            <>
                                <div className="flex gap-6 mb-6">
                                    <div className={`w-32 h-44 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl overflow-hidden ${t.cover.bgGradient}`}>
                                        {selectedGame.image_url ? (
                                            <img src={selectedGame.image_url} alt={selectedGame.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Gamepad2 className="w-16 h-16 text-white/50" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-3xl font-bold mb-2 ${t.text.main}`}>{selectedGame.name}</h3>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedGame.consoles && selectedGame.consoles.length > 0 ? (
                                                selectedGame.consoles.map((c) => (
                                                    <span key={c.id} className={`text-xl ${t.text.muted}`}>{c.name}</span>
                                                ))
                                            ) : (
                                                <p className={`text-xl ${t.text.muted}`}>Aucune console associée</p>
                                            )}
                                        </div>

                                        <div className={`flex items-center gap-2 ${t.text.highlight}`}>
                                            <Trophy className="w-6 h-6" />
                                            <span className="text-xl">{achievementsForSelectedGame.length} succès disponibles</span>
                                        </div>

                                        {/* Description */}
                                        {selectedGame.description && (
                                            <p className={`mt-4 text-sm ${t.text.inactive} line-clamp-3`}>
                                                {selectedGame.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <h4 className={`text-xl mb-4 ${t.text.main}`}>Succès</h4>
                                <div className="space-y-3 mb-6 overflow-y-auto max-h-64">
                                    {achievementsForSelectedGame.length === 0 ? (
                                        <p className={`${t.text.muted}`}>Aucun succès disponible pour ce jeu.</p>
                                    ) : (
                                        achievementsForSelectedGame.map((ach) => (
                                            <div key={ach.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                                <div>
                                                <Star className={`w-6 h-6 text-yellow-400`} fill={followedAchievementsIds.includes(ach.id) ? "yellow" : "none"} onClick={async () => {
                                                    if (!user) return;
                                                    await handleToggleFollowAchievement(ach.id);
                                                }} />
                                                </div>
                                                <div>
                                                    <h5 className={`font-semibold ${t.text.main}`}>{ach.name}</h5>
                                                    <p className={`text-sm ${t.text.inactive}`}>{ach.description}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    {(() => {
                                        const isFollowed = followedGameIds.includes(selectedGame.id);
                                        if (user) {
                                            return (
                                                <button
                                                    onClick={() => handleToggleFollow(selectedGame.id)}
                                                    className={`flex-1 px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-bold ${
                                                        isFollowed
                                                            ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30" // Rouge si suivi
                                                            : "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/30" // Bleu sinon
                                                    }`}
                                                >
                                                    {isFollowed ? (
                                                        <>
                                                            <X className="w-5 h-5" />
                                                            Retirer
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Heart className="w-5 h-5" />
                                                            Suivre ce jeu
                                                        </>
                                                    )}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <button
                                        onClick={() => setSelectedGame(null)}
                                        className={`flex-1 px-6 py-3 rounded-xl shadow-lg transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
                                    >
                                        Fermer
                                    </button>

                                    {isAdmin && (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className={`px-4 py-3 rounded-xl border transition-colors ${t.iconButton.hover} ${t.layout.border}`}
                                                title="Modifier"
                                            >
                                                <Edit2 className={`w-5 h-5 ${t.text.main}`} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(selectedGame.id)}
                                                className={`px-4 py-3 rounded-xl border transition-colors border-red-500/30 text-red-500 hover:bg-red-500/10`}
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* --- MODALE CRÉATION (ADMIN) --- */}
            {isCreating && (
                <div className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 ${t.modal.overlay}`}>
                    <div className={`rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto ${t.layout.bg} border ${t.layout.border}`}>
                        <button
                            onClick={() => setIsCreating(false)}
                            className={`absolute top-4 right-4 ${t.iconButton.base} ${t.iconButton.hover}`}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${t.text.main}`}>
                            <Plus className={`w-6 h-6 ${t.text.muted}`} />
                            Ajouter un nouveau jeu
                        </h3>

                        <div>
                            <GenericAdminForm
                                key="create-form"
                                initialData={{}}
                                foreignTables={['console']}
                                fields={[
                                    { name: 'name', label: 'Nom du jeu', type: 'text', required: true },
                                    { name: 'description', label: 'Description', type: 'textarea' },
                                    { name: 'pegi', label: 'PEGI', type: 'number' },
                                    { name: 'image_url', label: 'URL de l\'image', type: 'text' },
                                    { name: 'gameconsoles', label: 'Consoles associées', type: 'superselect', foreignTable: 'console', selectedForeignKeys: []}
                                ]}
                                onSubmit={(data) => handleFormSubmit(data, false)}
                                onSuccess={() => {}}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};