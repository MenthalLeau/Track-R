import { useState, useEffect } from "react";
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";
import { createAchievement, deleteAchievement, fetchAchievements,  updateAchievement,  type Achievement } from "../http/achievement";
import { fetchGamesToSelect } from "../http/game";

const Achievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
    const [gamesOptions, setGamesOptions] = useState<{ value: number; label: string }[]>([]);
    const { profile } = useAuth();

    const loadAchievements = async () => {
        const data = await fetchAchievements();
        setAchievements(data);
    };

    const loadGamesOptions = async () => {
        const options = await fetchGamesToSelect();
        setGamesOptions(options);
    }

    useEffect(() => {
        loadAchievements();
        loadGamesOptions();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce succès ?")) {
            try {
                await deleteAchievement(id);
                loadAchievements();
                if (editingAchievement?.id === id) setEditingAchievement(null);
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer le succès");
            }
        }
    };

    // Gestion unifiée de la soumission (Création vs Édition)
    const handleFormSubmit = async (formData: any, isUpdate: boolean, id?: number) => {
        if (isUpdate && id) {
            await updateAchievement(id, formData);
        } else {
            await createAchievement(formData);
        }
    };

    const isAdmin = profile && profile.rid === 2;

    return (
        <div className="achievements-list mt-6 p-4 border-t">
            <h2 className="text-xl font-semibold mb-4">Succès</h2>
            
            {/* LISTE DES SUCCÈS */}
            {achievements.length === 0 ? (
                <p>No achievements available.</p>
            ) : (
                <ul className="space-y-4">
                    {achievements.map((achievementItem) => {
                        // On vérifie si c'est CETTE achievement qui est en cours d'édition
                        const isEditingThisAchievement = editingAchievement?.id === achievementItem.id;

                        return (
                            <li key={achievementItem.id} className="p-4 border rounded bg-white shadow-sm flex flex-col gap-4">
                                {/* PARTIE AFFICHAGE */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold">{achievementItem.name}</h3>
                                        <p className="text-gray-600 font-medium">{achievementItem.game.name}</p>
                                        <p>{achievementItem.description}</p>
                                    </div>

                                    {/* Boutons d'action (Admin seulement) - Cachés si on édite déjà */}
                                    {isAdmin && !isEditingThisAchievement && (
                                        <div className="flex flex-col gap-2 justify-start">
                                            <button 
                                                onClick={() => setEditingAchievement(achievementItem)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(achievementItem.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* PARTIE FORMULAIRE D'ÉDITION (INLINE) */}
                                {isEditingThisAchievement && (
                                    <div className="mt-4 pt-4 border-t-2 border-yellow-100 bg-yellow-50 -mx-4 px-4 pb-4 rounded-b">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-yellow-800">Modification de {achievementItem.name}</h4>
                                            <button 
                                                onClick={() => setEditingAchievement(null)}
                                                className="text-sm text-gray-500 hover:text-red-500 underline"
                                            >
                                                Fermer / Annuler
                                            </button>
                                        </div>
                                        
                                        <GenericAdminForm
                                            initialData={achievementItem} 
                                            fields={[
                                                { name: 'name', label: 'Name', type: 'text', required: true },
                                                { name: 'description', label: 'Description', type: 'textarea' },
                                                { name: 'gid', valueFromObject: 'game.id', label: 'Jeu', type: 'select', options: gamesOptions, required: true },
                                            ]}
                                            onSubmit={(data) => handleFormSubmit(data, true, achievementItem.id)}
                                            onSuccess={() => {
                                                alert('Console modifiée !');
                                                setEditingAchievement(null);
                                                loadAchievements();
                                            }}
                                        /> 
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* FORMULAIRE DE CRÉATION (Toujours visible en bas) */}
            {isAdmin && (
                <div className="mt-10 p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">Ajouter une nouvelle console</h3>
                    
                    <GenericAdminForm
                        key="create-form"
                        initialData={{}} 
                        fields={[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'gid', label: 'Jeu', type: 'select', options: gamesOptions, required: true },
                        ]}
                        onSubmit={(data) => handleFormSubmit(data, false)}
                        onSuccess={() => {
                            alert('Succès créée !');
                            loadAchievements();
                        }}
                    /> 
                </div>
            )}
        </div>
    );
};

export default Achievements;