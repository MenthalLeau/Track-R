import { useState, useEffect } from "react";
import { createGame, fetchGames, updateGame, deleteGame, type Game } from "../http/game";
// import { useNavigate } from "react-router-dom"; // Plus besoin de navigate(0) si on gère bien l'état
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";

const Games = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [editingGame, setEditingGame] = useState<Game | null>(null); // État pour savoir quel jeu on modifie
    const { profile } = useAuth();

    // Fonction pour recharger la liste (DRY - Don't Repeat Yourself)
    const loadGames = async () => {
        const data = await fetchGames();
        setGames(data);
    };

    useEffect(() => {
        loadGames();
    }, []);

    // Gestion de la suppression
    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
            try {
                await deleteGame(id);
                loadGames(); // On recharge la liste
                // Si on supprimait le jeu en cours d'édition, on annule l'édition
                if (editingGame?.id === id) setEditingGame(null);
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer le jeu");
            }
        }
    };

    // Gestion de la soumission du formulaire (Création OU Édition)
    const handleFormSubmit = async (formData: any) => {
        if (editingGame) {
            // Mode ÉDITION
            await updateGame(editingGame.id, formData);
        } else {
            // Mode CRÉATION
            await createGame(formData);
        }
    };

    const isAdmin = profile && profile.rid === 2;

    return (
        <div className="games-list mt-6 p-4 border-t">
            <h2 className="text-xl font-semibold mb-4">Games</h2>
            
            {/* LISTE DES JEUX */}
            {games.length === 0 ? (
                <p>No games available.</p>
            ) : (
                <ul className="space-y-4">
                    {games.map((game) => (
                        <li key={game.id} className="p-4 border rounded flex flex-col md:flex-row gap-4">
                            {/* Image et infos */}
                            <div className="flex-1">
                                {game.image_url && (
                                    <img src={game.image_url} alt={game.name} className="mb-4 max-w-[200px] h-auto rounded" />
                                )}
                                <h3 className="text-lg font-bold">{game.name}</h3>
                                <p>{game.description}</p>
                                <p><strong>PEGI:</strong> {game.pegi}</p>
                            </div>

                            {/* Boutons d'action (Admin seulement) */}
                            {isAdmin && (
                                <div className="flex flex-col gap-2 justify-start">
                                    <button 
                                        onClick={() => setEditingGame(game)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(game.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* FORMULAIRE D'ADMINISTRATION */}
            {isAdmin && (
                <div className="mt-10 p-4 border-t-2 border-gray-200 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">
                            {editingGame ? `Modifier : ${editingGame.name}` : "Ajouter un nouveau jeu"}
                        </h3>
                        {editingGame && (
                            <button 
                                onClick={() => setEditingGame(null)}
                                className="text-gray-500 hover:text-gray-700 underline text-sm"
                            >
                                Annuler l'édition
                            </button>
                        )}
                    </div>

                    {/* IMPORTANT : La prop `key` est cruciale ici.
                        Quand `editingGame?.id` change, React détruit et recrée le formulaire.
                        Cela permet de réinitialiser les champs avec les nouvelles `initialData`.
                    */}
                    <GenericAdminForm
                        key={editingGame ? editingGame.id : 'create-form'} 
                        initialData={editingGame || {}} // Si null, objet vide
                        fields={[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'pegi', label: 'PEGI', type: 'number' },
                            { name: 'image_url', label: 'Image', type: 'image' },
                        ]}
                        onSubmit={handleFormSubmit}
                        onSuccess={() => {
                            alert(editingGame ? 'Jeu modifié !' : 'Jeu créé !');
                            setEditingGame(null); // On repasse en mode création
                            loadGames(); // On rafraichit la liste
                        }}
                    /> 
                </div>
            )}
        </div>
    );
};

export default Games;