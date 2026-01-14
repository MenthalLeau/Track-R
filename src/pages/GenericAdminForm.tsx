import React, { useState } from 'react';
import { uploadGameImage } from '../http/game';
import type { FieldConfig } from '../types/FieldConfig';

interface Props {
    fields: FieldConfig[];
    initialData?: any;
    onSubmit: (data: any) => Promise<any>;
    onSuccess: () => void;
}

export const GenericAdminForm: React.FC<Props> = ({ fields, initialData, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState<{ [key: string]: any }>(initialData || {});
    const [files, setFiles] = useState<{ [key: string]: File }>({});
    const [loading, setLoading] = useState(false);

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

    // Classes utilitaires pour éviter la répétition
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none";
    const labelClasses = "block text-sm font-medium text-gray-700";

    console.log('Rendering GenericAdminForm with formData:', formData);

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Éditer les informations</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map((field) => (
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
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                            />
                        )}

                        {field.type === 'textarea' && (
                            <textarea
                                id={field.name}
                                rows={4}
                                className={inputClasses}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )}

                        {field.type === 'number' && (
                            <input
                                id={field.name}
                                type="number"
                                className={inputClasses}
                                value={formData[field.name] || 0}
                                onChange={(e) => handleChange(field.name, Number(e.target.value))}
                            />
                        )}

                        {field.type === 'select' && (
                            <select
                                id={field.name}
                                className={inputClasses}
                                value={formData[field.valueFromObject || field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            >
                                <option value="">Sélectionner une option</option>
                                {field.options?.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        )}

                        {field.type === 'image' && (
                            <div className="mt-1 flex flex-col items-start gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                                    className="block w-full text-sm text-gray-500
                                      file:mr-4 file:py-2 file:px-4
                                      file:rounded-full file:border-0
                                      file:text-sm file:font-semibold
                                      file:bg-indigo-50 file:text-indigo-700
                                      hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {formData[field.name] && !files[field.name] && (
                                    <div className="relative group">
                                        <img 
                                            src={formData[field.name]} 
                                            alt="Aperçu" 
                                            className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm" 
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg" />
                                    </div>
                                )}
                            </div>
                        )}

                        {field.type === 'year' && (
                            <input
                                id={field.name}
                                type="date"
                                className={inputClasses}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )}
                    </div>
                ))}

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
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enregistrement...
                            </span>
                        ) : 'Enregistrer'}
                    </button>
                </div>
            </form>
        </div>
    );
};