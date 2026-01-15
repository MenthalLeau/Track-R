import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Trophy, Plus, Edit2, Trash2, X, Gamepad2 } from 'lucide-react';
import { GenericAdminForm } from "./GenericAdminForm";
import { useAuth } from "../context/AuthContext";
import { type GameConsole, createConsole, deleteConsole, fetchConsoles, updateConsole } from "../http/console";
import { getThemeTokens } from "../components/theme";
import type { Theme } from "../components/theme";

export default function Consoles() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. ÉTATS ---
    const [consoles, setConsoles] = useState<GameConsole[]>([]);
    const [selectedConsole, setSelectedConsole] = useState<GameConsole | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const { profile } = useAuth();
    const isAdmin = profile && profile.rid === 2;

    // --- 3. CHARGEMENT DES DONNÉES ---
    const loadConsoles = async () => {
        try {
            const data = await fetchConsoles();
            setConsoles(data);
        } catch (error) {
            console.error("Erreur chargement consoles:", error);
        }
    };

    useEffect(() => {
        loadConsoles();
    }, []);

    // --- 4. ACTIONS CRUD ---
    const handleDelete = async (id: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette console ?")) {
            try {
                await deleteConsole(id);
                setSelectedConsole(null);
                loadConsoles();
            } catch (error) {
                console.error("Erreur suppression:", error);
                alert("Impossible de supprimer la console");
            }
        }
    };

    const handleFormSubmit = async (formData: any, isUpdate: boolean, id?: number) => {
        try {
            if (isUpdate && id) {
                await updateConsole(id, formData);
                alert('Console modifiée avec succès !');
                setIsEditing(false);
                setSelectedConsole(null);
            } else {
                await createConsole(formData);
                alert('Nouvelle console créée !');
                setIsCreating(false);
            }
            loadConsoles();
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
                <h2 className={`text-3xl font-bold ${t.text.main}`}>Consoles</h2>
                {isAdmin && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Ajouter une console</span>
                    </button>
                )}
            </div>

            {/* Empty State */}
            {consoles.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center ${t.card.base} ${t.card.border} ${t.card.shadow}`}>
                    <Trophy className={`w-20 h-20 mx-auto mb-4 opacity-70 ${t.text.muted}`} />
                    <h3 className={`text-2xl mb-2 ${t.text.main}`}>Aucune console disponible</h3>
                    <p className={`${t.text.muted}`}>
                        Les consoles apparaîtront ici une fois ajoutées.
                    </p>
                </div>
            ) : (
                /* Grid des Consoles */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {consoles.map((consoleItem) => (
                        <div
                            key={consoleItem.id}
                            onClick={() => {
                                setSelectedConsole(consoleItem);
                                setIsEditing(false);
                            }}
                            className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${t.card.base} border ${t.card.border} ${t.card.shadow} ${t.card.hover} ${t.card.hoverBorder}`}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`text-2xl font-bold mb-1 ${t.text.main}`}>{consoleItem.name}</h3>
                                        <p className={`text-sm font-medium ${t.text.muted}`}>{consoleItem.brand}</p>
                                    </div>
                                    {/* Image miniature ronde si disponible */}
                                    {consoleItem.image_url ? (
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-sm">
                                            <img src={consoleItem.image_url} alt={consoleItem.name} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${t.cover.bgGradient}`}>
                                            <Gamepad2 className="w-6 h-6 text-white/50" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {consoleItem.description && (
                                        <p className={`text-sm line-clamp-2 ${t.text.inactive}`}>
                                            {consoleItem.description}
                                        </p>
                                    )}
                                    {consoleItem.release_year && (
                                        <p className={`text-xs px-2 py-1 rounded w-fit ${currentTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100'} ${t.text.muted}`}>
                                            Sortie : {consoleItem.release_year}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODALE DÉTAILS / ÉDITION --- */}
            {selectedConsole && (
                <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 ${t.modal.overlay}`} onClick={() => setSelectedConsole(null)}>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-3xl max-w-2xl w-full p-8 relative ${t.modal.bgGradient} border ${t.modal.border} ${t.modal.shadow} overflow-hidden max-h-[90vh] overflow-y-auto`}
                    >

                        {isEditing && isAdmin ? (
                            /* --- MODE ÉDITION (ADMIN) --- */
                            <>
                                <button
                                    onClick={() => setSelectedConsole(null)}
                                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${t.iconButton.base} ${t.iconButton.hover} bg-black/10`}
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="flex justify-between items-center mb-6">
                                    <h3 className={`text-2xl font-bold flex items-center gap-2 ${t.text.main}`}>
                                        <Edit2 className={`w-6 h-6 ${t.text.muted}`} />
                                        Modifier {selectedConsole.name}
                                    </h3>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className={`text-sm underline ${t.text.muted} hover:${t.text.main}`}
                                    >
                                        Annuler
                                    </button>
                                </div>

                                <GenericAdminForm
                                    initialData={selectedConsole}
                                    fields={[
                                        { name: 'name', label: 'Nom', type: 'text', required: true },
                                        { name: 'brand', label: 'Marque', type: 'text', required: true },
                                        { name: 'description', label: 'Description', type: 'textarea' },
                                        { name: 'release_year', label: 'Année de sortie', type: 'number' },
                                        { name: 'image_url', label: 'Image URL', type: 'text' },
                                    ]}
                                    onSubmit={(data) => handleFormSubmit(data, true, selectedConsole.id)}
                                    onSuccess={() => {}}
                                />
                            </>
                        ) : (
                            /* --- MODE VISUALISATION --- */
                            <>
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    <div className={`w-full md:w-40 h-40 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl overflow-hidden ${t.cover.bgGradient}`}>
                                        {selectedConsole.image_url ? (
                                            <img src={selectedConsole.image_url} alt={selectedConsole.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Trophy className="w-16 h-16 text-white/50" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-3xl font-bold mb-2 ${t.text.main}`}>{selectedConsole.name}</h3>
                                        <p className={`text-xl mb-4 font-medium ${t.text.muted}`}>{selectedConsole.brand}</p>

                                        {selectedConsole.release_year && (
                                            <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${t.layout.border} ${t.text.inactive} bg-black/10`}>
                                                Année : {selectedConsole.release_year}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h4 className={`text-lg font-semibold ${t.text.main}`}>À propos</h4>
                                    <p className={`leading-relaxed ${t.text.inactive}`}>
                                        {selectedConsole.description || "Aucune description disponible."}
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setSelectedConsole(null)}
                                        className={`flex-1 px-6 py-3 rounded-xl shadow-lg transition-all font-medium ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
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
                                                onClick={() => handleDelete(selectedConsole.id)}
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
                            Ajouter une console
                        </h3>

                        <GenericAdminForm
                            key="create-form"
                            initialData={{}}
                            fields={[
                                { name: 'name', label: 'Nom', type: 'text', required: true },
                                { name: 'brand', label: 'Marque', type: 'text', required: true },
                                { name: 'description', label: 'Description', type: 'textarea' },
                                { name: 'release_year', label: 'Année de sortie', type: 'number' },
                                { name: 'image_url', label: 'Image URL', type: 'text' },
                            ]}
                            onSubmit={(data) => handleFormSubmit(data, false)}
                            onSuccess={() => {}}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};