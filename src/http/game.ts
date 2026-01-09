import { supabase } from '../lib/supabaseClient';

export interface Game {
    id: number;
    name: string;
    description: string;
    pegi: number;
    image_url?: string;
}

export const fetchGames = async (): Promise<Game[]> => {
    const { data, error } = await supabase
        .from('game')
        .select('id, name, description, pegi, image_url');
        
    if (error) {
        throw new Error(error.message);
    }
    return data || [];
}

export const fetchGameById = async (id: number): Promise<Game | null> => {
    const { data, error } = await supabase
        .from('game')
        .select('id, name, description, pegi, image_url')
        .eq('id', id)
        .single();
        
    if (error) {
        throw new Error(error.message);
    }
    return data || null;
}

// Fonction pour uploader l'image et retourner son URL publique
export const uploadGameImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `game-covers/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('game') // Nom de votre bucket
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('game')
        .getPublicUrl(filePath);

    return data.publicUrl;
};

export const createGame = async (game: Omit<Game, 'id'>): Promise<Game> => {
    const { data, error } = await supabase
        .from('game')
        .insert(game)
        .single();
        
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const updateGame = async (id: number, game: Partial<Omit<Game, 'id'>>): Promise<Game> => {
    const { data, error } = await supabase
        .from('game')
        .update(game)
        .eq('id', id)
        .single();
        
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const deleteGame = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('game')
        .delete()
        .eq('id', id);
        
    if (error) {
        throw new Error(error.message);
    }
}