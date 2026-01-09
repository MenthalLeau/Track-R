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

export const uploadGameImage = async (file: File): Promise<string> => {
    // 1. On prépare le nom du fichier (Timestamp pour l'unicité)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    // 2. On définit le chemin.
    // Avant c'était : `game-covers/${fileName}`
    // Maintenant, c'est juste le nom du fichier pour être à la racine :
    const filePath = fileName; 

    // 3. On upload dans le bon bucket 'game-images'
    const { error: uploadError } = await supabase.storage
        .from('game-images') // <--- Nom corrigé ici
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 4. On récupère l'URL publique depuis le bon bucket
    const { data } = supabase.storage
        .from('game-images') // <--- Nom corrigé ici aussi
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