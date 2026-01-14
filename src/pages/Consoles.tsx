import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Plus besoin de navigate(0) si on gère bien l'état
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";
import { type Console, createConsole, deleteConsole, fetchConsoles, updateConsole } from "../http/console";

const Consoles = () => {
    const [consoles, setConsoles] = useState<Console[]>([]);
    const [editingConsole, setEditingConsole] = useState<Console | null>(null); // État pour savoir quelle console on modifie
    const { profile } = useAuth();

    // Fonction pour recharger la liste (DRY - Don't Repeat Yourself)
    const loadConsoles = async () => {
        const data = await fetchConsoles();
        setConsoles(data);
    };

    useEffect(() => {
        loadConsoles();
    }, []);

    // Gestion de la suppression
    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
            try {
                await deleteConsole(id);
                loadConsoles(); // On recharge la liste
                // Si on supprimait le jeu en cours d'édition, on annule l'édition
                if (editingConsole?.id === id) setEditingConsole(null);
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer le jeu");
            }
        }
    };

    // Gestion de la soumission du formulaire (Création OU Édition)
    const handleFormSubmit = async (formData: any) => {
        if (editingConsole) {
            // Mode ÉDITION
            await updateConsole(editingConsole.id, formData);
        } else {
            // Mode CRÉATION
            await createConsole(formData);
        }
    };

    const isAdmin = profile && profile.rid === 2;

    return (
        <div className="consoles-list mt-6 p-4 border-t">
            <h2 className="text-xl font-semibold mb-4">Consoles</h2>
            
            {/* LISTE DES CONSOLES */}
            {consoles.length === 0 ? (
                <p>No consoles available.</p>
            ) : (
                <ul className="space-y-4">
                    {consoles.map((console) => (
                        <li key={console.id} className="p-4 border rounded flex flex-col md:flex-row gap-4">
                            {/* Image et infos */}
                            <div className="flex-1">
                                {console.image_url && (
                                    <img src={console.image_url} alt={console.name} className="mb-4 max-w-[200px] h-auto rounded" />
                                )}
                                <h3 className="text-lg font-bold">{console.name}</h3>
                                <p>{console.description}</p>
                            </div>

                            {/* Boutons d'action (Admin seulement) */}
                            {isAdmin && (
                                <div className="flex flex-col gap-2 justify-start">
                                    <button 
                                        onClick={() => setEditingConsole(console)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(console.id)}
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
                            {editingConsole ? `Modifier : ${editingConsole.name}` : "Ajouter une nouvelle console"}
                        </h3>
                        {editingConsole && (
                            <button 
                                onClick={() => setEditingConsole(null)}
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
                        key={editingConsole ? editingConsole.id : 'create-form'} 
                        initialData={editingConsole || {}} // Si null, objet vide
                        fields={[
                            { name: 'name', label: 'Name', type: 'text', required: true },
                            { name: 'brand', label: 'Brand', type: 'text', required: true },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'release_year', label: 'Release Year', type: 'year' },
                            { name: 'image_url', label: 'Image', type: 'image' },
                        ]}
                        onSubmit={handleFormSubmit}
                        onSuccess={() => {
                            alert(editingConsole ? 'Console modifiée !' : 'Console créée !');
                            setEditingConsole(null); // On repasse en mode création
                            loadConsoles(); // On rafraichit la liste
                        }}
                    /> 
                </div>
            )}
        </div>
    );
};

export default Consoles;