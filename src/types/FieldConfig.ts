import type { TablesInDatabase } from "./database";

// types/forms.ts
export interface FieldConfig {
    label: string;
    name: string;
    valueFromObject?: string; // Pour les objets imbriqués
    foreignTable?: TablesInDatabase; // Pour les selects liés à une table étrangère
    selectedForeignKeys?: number[]; // Pour les selects multiples
    type: 'text' | 'textarea' | 'number' | 'select' | 'superselect' | 'image' | 'year';
    options?: { label: string; value: any }[]; // Pour les selects
    required?: boolean;
}