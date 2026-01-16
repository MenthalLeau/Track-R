import { supabase } from '../lib/supabaseClient.ts';

export interface GameConsole {
    id: number;
    name: string;
    description: string;
    brand: string;
    release_year: number;
    image_url?: string;
}

export const fetchConsoles = async (): Promise<GameConsole[]> => {
    const { data, error } = await supabase
        .from('console')
        .select('id, name, brand, release_year, description, image_url');
        
    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

export const fetchConsolesByDate = async (): Promise<GameConsole[]> => {
    const { data, error } = await supabase
        .from('console')
        .select('id, name, brand, release_year, description, image_url')
        .order('release_year', { ascending: false });
        
    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

export const fetchConsoleById = async (id: number): Promise<GameConsole | null> => {
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

export const createConsole = async (console: Omit<GameConsole, 'id'>): Promise<GameConsole> => {
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

export const updateConsole = async (id: number, console: Partial<GameConsole>): Promise<GameConsole> => {
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