import { useState, useEffect } from "react";
import { createGame, fetchGames, updateGame, deleteGame, type Game, fetchALLGamesWithConsole } from "../http/game";
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";

const Games = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [editingGame, setEditingGame] = useState<Game | null>(null); 
    const { profile } = useAuth();

    const loadGames = async () => {
        const data = await fetchALLGamesWithConsole();
        setGames(data);
    };

    useEffect(() => {
        loadGames();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
            try {
                await deleteGame(id);
                loadGames();
                if (editingGame?.id === id) setEditingGame(null);
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer le jeu");
            }
        }
    };

    // Gestion de la soumission (Adaptée pour gérer les deux cas)
    const handleFormSubmit = async (formData: any, isUpdate: boolean, id?: number) => {
        if (isUpdate && id) {
            await updateGame(id, formData);
        } else {
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
                    {games.map((game) => {
                        // On vérifie si c'est CE jeu qui est en cours d'édition
                        const isEditingThisGame = editingGame?.id === game.id;

                        return (
                            <li key={game.id} className="p-4 border rounded bg-white shadow-sm flex flex-col gap-4">
                                {/* PARTIE AFFICHAGE (Toujours visible, ou tu peux la cacher si isEditingThisGame est vrai) */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        {game.image_url && (
                                            <img src={game.image_url} alt={game.name} className="mb-4 max-w-[200px] h-auto rounded" />
                                        )}
                                        <h3 className="text-lg font-bold">{game.name}</h3>
                                        <p>{game.description}</p>
                                        <p><strong>PEGI:</strong> {game.pegi}</p>
                                        {game.consoles && game.consoles.length > 0 && (
                                            <div className="mt-2">
                                                <strong>Consoles associées:</strong>
                                                <ul className="list-disc list-inside">
                                                    {game.consoles.map((console) => (
                                                        <li key={console.id}>{console.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Boutons d'action (Admin seulement) */}
                                    {isAdmin && !isEditingThisGame && (
                                        <div className="flex flex-col gap-2 justify-start">
                                            <button 
                                                onClick={() => setEditingGame(game)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(game.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* PARTIE FORMULAIRE D'ÉDITION (Affichée conditionnellement) */}
                                    {isEditingThisGame && (
                                        <div className="mt-4 pt-4 border-t-2 border-yellow-100 bg-yellow-50 -mx-4 px-4 pb-4 rounded-b">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-semibold text-yellow-800">Modification de {game.name}</h4>
                                                <button 
                                                    onClick={() => setEditingGame(null)}
                                                    className="text-sm text-gray-500 hover:text-red-500 underline"
                                                >
                                                    Fermer / Annuler
                                                </button>
                                            </div>
                                            
                                            <GenericAdminForm
                                                // CORRECTION 1 : On prépare les données pour que le champ 'gameconsoles' reçoive les IDs
                                                initialData={{
                                                    ...game,
                                                    gameconsoles: game.consoles ? game.consoles.map(c => c.id) : []
                                                }}
                                                // CORRECTION 2 : On ajoute foreignTables pour charger la liste des consoles
                                                foreignTables={['console']} 
                                                fields={[
                                                    { name: 'name', label: 'Name', type: 'text', required: true },
                                                    { name: 'description', label: 'Description', type: 'textarea' },
                                                    { name: 'pegi', label: 'PEGI', type: 'number' },
                                                    { name: 'image_url', label: 'Image', type: 'image' },
                                                    // Note: selectedForeignKeys n'est pas utilisé par ton GenericAdminForm actuel, 
                                                    // c'est initialData qui compte. On peut garder la ligne propre :
                                                    { name: 'gameconsoles', label: 'Consoles associées', type: 'superselect', foreignTable: 'console' }
                                                ]}
                                                onSubmit={(data) => handleFormSubmit(data, true, game.id)}
                                                onSuccess={() => {
                                                    alert('Jeu modifié !');
                                                    setEditingGame(null);
                                                    loadGames();
                                                }}
                                            />
                                        </div>
                                    )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* FORMULAIRE DE CRÉATION (Séparé en bas, toujours dispo pour AJOUTER) */}
            {isAdmin && (
                <div className="mt-10 p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">Ajouter un nouveau jeu</h3>
                    
                    {/* On force une key statique ici pour le mode création */}
                    <GenericAdminForm
                        key="create-form"
                        initialData={{}}
                        foreignTables={['console']}
                        fields={[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'pegi', label: 'PEGI', type: 'number' },
                            { name: 'image_url', label: 'Image', type: 'image' },
                            { name: 'gameconsoles', label: 'Consoles associées', type: 'superselect', foreignTable: 'console', selectedForeignKeys: []}
                        ]}
                        onSubmit={(data) => handleFormSubmit(data, false)}
                        onSuccess={() => {
                            alert('Nouveau jeu créé !');
                            loadGames();
                        }}
                    /> 
                </div>
            )}
        </div>
    );
};

export default Games;