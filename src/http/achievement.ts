import { supabase } from '../lib/supabaseClient.ts';
import type { Game } from './game.ts';

export interface Achievement {
    id: number;
    name: string;
    description: string;
    game: Game;
}

export const fetchAchievements = async (): Promise<Achievement[]> => {
    const { data, error } = await supabase
        .from('achievement')
        .select(`
            id,
            name,
            description,
            game:gid (
                id,
                name,
                description,
                pegi,
                image_url
            )
        `);
        
    if (error) {
        throw new Error(error.message);
    }

    // Supabase usually returns relations as an array (e.g., game: [{...}]).
    // We map over the results to unwrap that array into a single object.
    return (data || []).map((item: any) => ({
        ...item,
        game: Array.isArray(item.game) ? item.game[0] : item.game
    })) as Achievement[];
}

export const fetchAchievementById = async (id: number): Promise<Achievement | null> => {
    const { data, error } = await supabase
        .from('achievement')
        .select(`
            id,
            name,
            description,
            game:gid (
                id,
                name,
                description,
                pegi,
                image_url
            )
        `)
        .eq('id', id)
        .single();
        
    if (error) {
        throw new Error(error.message);
    }

    if (!data) return null;

    // Fix: Create a NEW object to satisfy the Achievement interface
    const achievement: Achievement = {
        ...data,
        // Check if game is an array and extract the first item, otherwise use it as is
        game: Array.isArray(data.game) ? data.game[0] : data.game
    };

    return achievement;
}

export const createAchievement = async (achievement: Omit<Achievement, 'id'>): Promise<Achievement> => {
    const { data, error } = await supabase
        .from('achievement')
        .insert(achievement)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const updateAchievement = async (id: number, achievement: Partial<Achievement>): Promise<Achievement> => {
    const { data, error } = await supabase
        .from('achievement')
        .update(achievement)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const deleteAchievement = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('achievement')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }
}