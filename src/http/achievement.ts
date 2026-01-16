import { supabase } from '../lib/supabaseClient';
import type { Game } from './game';

export interface Achievement {
    id: number;
    name: string;
    description: string;
    game: Game;
    gid?: number;
}

export const fetchAchievements = async (): Promise<Achievement[]> => {
    const { data, error } = await supabase
        .from('achievement')
        .select(`
            id,
            name,
            description,
            gid, 
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
            gid,
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

    const achievement: Achievement = {
        ...data,
        game: Array.isArray(data.game) ? data.game[0] : data.game
    };

    return achievement;
}

export const createAchievement = async (achievement: any): Promise<Achievement> => {
    // 1. On crée une copie pour ne pas modifier l'objet original de l'UI
    const payload = { ...achievement };

    // 2. On supprime la relation imbriquée 'game' car ce n'est pas une colonne
    delete payload.game;
    // 3. On supprime l'ID s'il est présent (la BDD le gère)
    delete payload.id;

    const { data, error } = await supabase
        .from('achievement')
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const updateAchievement = async (id: number, achievement: Partial<Achievement>): Promise<Achievement> => {
    // 1. On crée une copie
    const payload: any = { ...achievement };

    // 2. On supprime la relation imbriquée 
    delete payload.game;
    
    // 3. On supprime l'ID du payload (puisqu'on l'utilise déjà dans .eq('id', id))
    delete payload.id;

    const { data, error } = await supabase
        .from('achievement')
        .update(payload)
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

export const fetchAchievementsForGame = async (gid: number): Promise<Omit<Achievement, 'game'>[]> => {
    const { data, error } = await supabase
        .from('achievement')
        .select(`
            id,
            name,
            description,
            gid,
            game:gid (
                id,
                name,
                description
            )
        `)
        .eq('gid', gid);

    if (error) {
        throw new Error(error.message);
    }

    return data || [];
}

export const linkAchievementToUser = async (uid: string, aid: number): Promise<void> => {
    const { error } = await supabase
        .from('userachievement')
        .insert([{ uid, aid }]);

    if (error) {
        throw new Error(error.message);
    }
}

export const unlinkAchievementFromUser = async (uid: string, aid: number): Promise<void> => {
    const { error } = await supabase
        .from('userachievement')
        .delete()
        .eq('uid', uid)
        .eq('aid', aid);

    if (error) {
        throw new Error(error.message);
    }
}

export const isAchievementLinkedToUser = async (uid: string, aid: number): Promise<boolean> => {
    const { data, error } = await supabase
        .from('userachievement')
        .select('*')
        .eq('uid', uid)
        .eq('aid', aid)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // Pas de ligne trouvée
            return false;
        }
        throw new Error(error.message);
    }
    return !!data;
}

export const fetchUserUnlockedAchievementsIds = async (uid: string): Promise<number[]> => {
    const { data, error } = await supabase
        .from('userachievement')
        .select('aid')
        .eq('uid', uid);

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map(item => item.aid);
}