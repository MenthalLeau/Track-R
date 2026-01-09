// types/forms.ts
export interface FieldConfig {
    label: string;
    name: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'image';
    options?: { label: string; value: any }[]; // Pour les selects
    required?: boolean;
}