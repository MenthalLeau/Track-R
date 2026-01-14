import { useState, useEffect } from "react";
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";
import { type Console, createConsole, deleteConsole, fetchConsoles, updateConsole } from "../http/console";

const Consoles = () => {
    const [consoles, setConsoles] = useState<Console[]>([]);
    const [editingConsole, setEditingConsole] = useState<Console | null>(null);
    const { profile } = useAuth();

    const loadConsoles = async () => {
        const data = await fetchConsoles();
        setConsoles(data);
    };

    useEffect(() => {
        loadConsoles();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette console ?")) {
            try {
                await deleteConsole(id);
                loadConsoles();
                if (editingConsole?.id === id) setEditingConsole(null);
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer la console");
            }
        }
    };

    // Gestion unifiée de la soumission (Création vs Édition)
    const handleFormSubmit = async (formData: any, isUpdate: boolean, id?: number) => {
        if (isUpdate && id) {
            await updateConsole(id, formData);
        } else {
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
                    {consoles.map((consoleItem) => {
                        // On vérifie si c'est CETTE console qui est en cours d'édition
                        const isEditingThisConsole = editingConsole?.id === consoleItem.id;

                        return (
                            <li key={consoleItem.id} className="p-4 border rounded bg-white shadow-sm flex flex-col gap-4">
                                {/* PARTIE AFFICHAGE */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        {consoleItem.image_url && (
                                            <img src={consoleItem.image_url} alt={consoleItem.name} className="mb-4 max-w-[200px] h-auto rounded" />
                                        )}
                                        <h3 className="text-lg font-bold">{consoleItem.name}</h3>
                                        <p className="text-gray-600 font-medium">{consoleItem.brand}</p>
                                        <p>{consoleItem.description}</p>
                                        {consoleItem.release_year && <p className="text-sm text-gray-500">Sortie en : {consoleItem.release_year}</p>}
                                    </div>

                                    {/* Boutons d'action (Admin seulement) - Cachés si on édite déjà */}
                                    {isAdmin && !isEditingThisConsole && (
                                        <div className="flex flex-col gap-2 justify-start">
                                            <button 
                                                onClick={() => setEditingConsole(consoleItem)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(consoleItem.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* PARTIE FORMULAIRE D'ÉDITION (INLINE) */}
                                {isEditingThisConsole && (
                                    <div className="mt-4 pt-4 border-t-2 border-yellow-100 bg-yellow-50 -mx-4 px-4 pb-4 rounded-b">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-yellow-800">Modification de {consoleItem.name}</h4>
                                            <button 
                                                onClick={() => setEditingConsole(null)}
                                                className="text-sm text-gray-500 hover:text-red-500 underline"
                                            >
                                                Fermer / Annuler
                                            </button>
                                        </div>
                                        
                                        <GenericAdminForm
                                            initialData={consoleItem} 
                                            fields={[
                                                { name: 'name', label: 'Name', type: 'text', required: true },
                                                { name: 'brand', label: 'Brand', type: 'text', required: true },
                                                { name: 'description', label: 'Description', type: 'textarea' },
                                                { name: 'release_year', label: 'Release Year', type: 'year' }, // Assure-toi que ton GenericAdminForm gère le type 'year' ou 'number'
                                                { name: 'image_url', label: 'Image', type: 'image' },
                                            ]}
                                            onSubmit={(data) => handleFormSubmit(data, true, consoleItem.id)}
                                            onSuccess={() => {
                                                alert('Console modifiée !');
                                                setEditingConsole(null);
                                                loadConsoles();
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
                            { name: 'brand', label: 'Brand', type: 'text', required: true },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'release_year', label: 'Release Year', type: 'year' },
                            { name: 'image_url', label: 'Image', type: 'image' },
                        ]}
                        onSubmit={(data) => handleFormSubmit(data, false)}
                        onSuccess={() => {
                            alert('Console créée !');
                            loadConsoles();
                        }}
                    /> 
                </div>
            )}
        </div>
    );
};

export default Consoles;