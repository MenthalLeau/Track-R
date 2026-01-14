// types/forms.ts
export interface FieldConfig {
    label: string;
    name: string;
    valueFromObject?: string; // Pour les objets imbriqués
    type: 'text' | 'textarea' | 'number' | 'select' | 'image' | 'year';
    options?: { label: string; value: any }[]; // Pour les selects
    required?: boolean;
}