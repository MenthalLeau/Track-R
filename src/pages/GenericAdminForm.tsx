import React, { useState, useEffect } from 'react';
import { uploadGameImage } from '../http/game';
import type { FieldConfig } from '../types/FieldConfig';
import { getAllDataFromTable, type TablesInDatabase } from '../types/database';

interface Props {
    fields: FieldConfig[];
    initialData?: any;
    foreignTables?: TablesInDatabase[]; // Pour les selects liés à des tables étrangères
    onSubmit: (data: any) => Promise<any>;
    onSuccess: () => void;
}

// Fonction utilitaire pour lire "game.id" dans un objet { game: { id: 1 } }
const getNestedValue = (obj: any, path: string) => {
    if (!path || !obj) return undefined;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);
};

export const GenericAdminForm: React.FC<Props> = ({ fields, initialData, foreignTables, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(initialData || {});
    const [files, setFiles] = useState<{ [key: string]: File }>({});
    const [loading, setLoading] = useState(false);
    const [foreignTableData, setForeignTableData] = useState<{ [key in TablesInDatabase]?: any[] }>({});

    useEffect(() => {
        // Charger les données des tables étrangères si nécessaire
        if (foreignTables && foreignTables.length > 0) {
            foreignTables.map(async (table) => {
                const data = await getAllDataFromTable(table);
                setForeignTableData(prev => ({ ...prev, [table]: data }));
            });
        }
    }, [foreignTables]);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (name: string, file: File | null) => {
        if (file) setFiles((prev) => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const finalData = { ...formData };

            // Gestion des images
            for (const field of fields.filter(f => f.type === 'image')) {
                if (files[field.name]) {
                    finalData[field.name] = await uploadGameImage(files[field.name]);
                }
            }

            await onSubmit(finalData);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none";
    const labelClasses = "block text-sm font-medium text-gray-700";

    console.log('formData:', formData);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Éditer les informations</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => {
                    // LOGIQUE INTELLIGENTE DE RÉCUPÉRATION DE VALEUR
                    // 1. On regarde si on a une valeur modifiée directement dans formData (ex: 'gid')
                    // 2. Sinon, si valueFromObject existe, on va chercher en profondeur (ex: 'game.id')
                    // 3. Sinon, on prend la valeur simple (ex: 'name')
                    // 4. Si rien n'existe, chaîne vide.
                    // ATTENTION : La value dans le field.type === 'superselect' doit etre un array !
                    let fieldValue = formData[field.name];
                    
                    if (fieldValue === undefined && field.valueFromObject) {
                        fieldValue = getNestedValue(formData, field.valueFromObject);
                    }
                    
                    // Fallback pour éviter les warnings "uncontrolled component"
                    const safeValue = fieldValue !== undefined && fieldValue !== null ? fieldValue : '';

                    return (
                        <div key={field.name} className="relative">
                            <label htmlFor={field.name} className={labelClasses}>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {field.type === 'text' && (
                                <input
                                    id={field.name}
                                    type="text"
                                    className={inputClasses}
                                    value={safeValue}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    required={field.required}
                                />
                            )}

                            {field.type === 'textarea' && (
                                <textarea
                                    id={field.name}
                                    rows={4}
                                    className={inputClasses}
                                    value={safeValue}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                />
                            )}

                            {field.type === 'number' && (
                                <input
                                    id={field.name}
                                    type="number"
                                    className={inputClasses}
                                    value={safeValue}
                                    onChange={(e) => handleChange(field.name, Number(e.target.value))}
                                />
                            )}

                            {field.type === 'select' && (
                                <select
                                    id={field.name}
                                    className={inputClasses}
                                    value={safeValue}
                                    onChange={(e) => handleChange(field.name, e.target.value)} // Ici on stocke la valeur (ex: l'ID) dans field.name ('gid')
                                    required={field.required}
                                >
                                    <option value="">Sélectionner une option</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}

                            {field.type === 'superselect' && (
                                <select
                                    id={field.name}
                                    className={inputClasses}
                                    multiple
                                    value={Array.isArray(safeValue) ? safeValue.map((v: any) => String(v)) : []}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => Number(option.value));
                                        handleChange(field.name, selectedOptions);
                                    }}
                                >
                                    {foreignTableData[field.foreignTable!]?.map((item: any) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name || item.title || `ID: ${item.id}`}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {field.type === 'image' && (
                                <div className="mt-1 flex flex-col items-start gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    />
                                    {/* Pour l'image, on utilise aussi safeValue pour l'aperçu si dispo */}
                                    {safeValue && !files[field.name] && (
                                        <div className="relative group">
                                            <img 
                                                src={safeValue} 
                                                alt="Aperçu" 
                                                className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm" 
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {field.type === 'year' && (
                                <input
                                    id={field.name}
                                    type="number" // Mieux vaut number pour une année qu'un date picker complet
                                    min="1950"
                                    max="2100"
                                    className={inputClasses}
                                    value={safeValue}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                />
                            )}
                        </div>
                    );
                })}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${loading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        } transition-colors duration-200`}
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};