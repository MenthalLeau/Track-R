import { supabase } from '../lib/supabaseClient.ts';

export interface Console {
    id: number;
    name: string;
    description: string;
    brand: string;
    release_year: number;
    image_url?: string;
}

export const fetchConsoles = async (): Promise<Console[]> => {
    const { data, error } = await supabase
        .from('console')
        .select('id, name, brand, release_year, description, image_url');
        
    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

export const fetchConsoleById = async (id: number): Promise<Console | null> => {
    const { data, error } = await supabase
        .from('console')
        .select('id, name, brand, release_year, image_url, description')
        .eq('id', id)
        .single();
        
    if (error) {
        throw new Error(error.message);
    }
    return data || null;
}

export const uploadConsoleImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName; 

    const { error: uploadError } = await supabase.storage
        .from('console-images')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('console-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const createConsole = async (console: Omit<Console, 'id'>): Promise<Console> => {
    const { data, error } = await supabase
        .from('console')
        .insert([console])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const updateConsole = async (id: number, console: Partial<Console>): Promise<Console> => {
    const { data, error } = await supabase
        .from('console')
        .update(console)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const deleteConsole = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('console')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }
}