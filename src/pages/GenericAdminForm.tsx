import React, { useState } from 'react';
import { uploadGameImage } from '../http/game'; // À rendre plus générique si besoin
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

            // Gestion automatique de tous les champs de type 'image'
            for (const field of fields.filter(f => f.type === 'image')) {
                if (files[field.name]) {
                    // On pourrait renommer uploadGameImage en uploadToStorage pour la généricité
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

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {fields.map((field) => (
                <div key={field.name} className="form-group">
                    <label>{field.label}</label>
                    
                    {field.type === 'text' && (
                        <input type="text" value={formData[field.name] || ''} 
                               onChange={(e) => handleChange(field.name, e.target.value)} required={field.required} />
                    )}

                    {field.type === 'textarea' && (
                        <textarea value={formData[field.name] || ''} 
                                  onChange={(e) => handleChange(field.name, e.target.value)} />
                    )}

                    {field.type === 'number' && (
                        <input type="number" value={formData[field.name] || 0} 
                               onChange={(e) => handleChange(field.name, Number(e.target.value))} />
                    )}

                    {field.type === 'select' && (
                        <select value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}>
                            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    )}

                    {field.type === 'image' && (
                        <div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)} />
                            {formData[field.name] && !files[field.name] && (
                                <img src={formData[field.name]} alt="Preview" width="80" />
                            )}
                        </div>
                    )}
                </div>
            ))}
            <button type="submit" disabled={loading}>{loading ? 'En cours...' : 'Enregistrer'}</button>
        </form>
    );
};