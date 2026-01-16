import { supabase } from '../lib/supabaseClient';
import type { Achievement } from './achievement';
import type { GameConsole } from './console';

export interface Game {
    id: number;
    name: string;
    description: string;
    pegi: number;
    image_url?: string;
    consoles?: GameConsole[];
    gameconsoles?: number[];
    achievements?: Omit<Achievement, 'game'>[];
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

export const fetchALLGamesWithConsole = async (): Promise<Game[]> => {
    const { data, error } = await supabase
        .from('game')
        .select(`
            id,
            name,
            description,
            pegi,
            image_url,
            consoles:gameconsole (
                console (
                    id,
                    name,
                    brand,
                    release_year,
                    description,
                    image_url
                )
            )
        `);
        
    if (error) {
        throw new Error(error.message);
    }
    
    return (data || []).map((item: any) => ({
        ...item,
        consoles: item.consoles ? item.consoles.map((gc: any) => gc.console) : []
    })) as Game[];
}

export const fetchGamesToSelect = async (): Promise<{ label: string; value: number }[]> => {
    const { data, error } = await supabase
        .from('game')
        .select('id, name');
        
    if (error) {
        throw new Error(error.message);
    }
    return (data || []).map(game => ({
        label: game.name,
        value: game.id
    }));
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
    const gameCopy = { ...game };
    // on supprime la propriété gameconsoles pour l'insertion dans la table game
    delete gameCopy.gameconsoles;
    const { data, error } = await supabase
        .from('game')
        .insert(gameCopy)
        .select()
        .single();
        
    if (error) {
        throw new Error(error.message);
    }
    console.log("data created game:", data);
    // si la propriété gameconsoles est présente dans game, il faut insérer les relations dans la table gameconsole
    if (game.gameconsoles && game.gameconsoles.length > 0) {
        const relations = game.gameconsoles.map(cid => ({
            gid: data.id,
            cid
        }));
        const { error: relError } = await supabase
            .from('gameconsole')
            .insert(relations);
        if (relError) {
            throw new Error(relError.message);
        }
    }
    return data;
}

export const updateGame = async (id: number, game: any): Promise<Game> => {
    // On crée une copie pour ne pas modifier l'objet original de l'UI
    const gameCopy = { ...game };
    
    // On sauvegarde les IDs des consoles (le tableau [1, 5, ...]) pour la table de liaison plus tard
    const newConsoleIds = gameCopy.gameconsoles;
    
    // enlever les propriétés non pertinentes
    delete gameCopy.gameconsoles; // c'est pour la logique JS
    delete gameCopy.consoles;     
    delete gameCopy.id;           // osef de l'ID

    // Update propre de la table 'game' (uniquement name, description, pegi, etc.)
    const { data, error } = await supabase
        .from('game')
        .update(gameCopy)
        .eq('id', id)
        .select()
        .single();
        
    if (error) {
        throw new Error(error.message);
    }

    if (newConsoleIds !== undefined) {
        // Suppression des anciennes relations
        const { error: delError } = await supabase
            .from('gameconsole')
            .delete()
            .eq('gid', id);
            
        if (delError) throw new Error(delError.message);

        // Ajout des nouvelles relations
        if (newConsoleIds.length > 0) {
            const relations = newConsoleIds.map((cid: number) => ({
                gid: id,
                cid: cid
            }));
            
            const { error: insError } = await supabase
                .from('gameconsole')
                .insert(relations);
                
            if (insError) throw new Error(insError.message);
        }
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

export const linkGameToUser = async (gid: number, uid: string): Promise<void> => {
    const { error } = await supabase
        .from('usergame')
        .insert([{ gid, uid }]);
        
    if (error) {
        throw new Error(error.message);
    }
}

export const unlinkGameFromUser = async (gid: number, uid: string): Promise<void> => {
    const { error } = await supabase
        .from('usergame')
        .delete()
        .eq('gid', gid)
        .eq('uid', uid);
        
    if (error) {
        throw new Error(error.message);
    }
}

export const isGameLinkedToUser = async (gid: number, uid: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('usergame')
        .select('*')
        .eq('gid', gid)
        .eq('uid', uid)
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

export const fetchUserFollowedGamesIds = async (uid: string): Promise<number[]> => {
    const { data, error } = await supabase
        .from('usergame')
        .select('gid')
        .eq('uid', uid);
        
    if (error) throw new Error(error.message);
    
    // On retourne juste un tableau simple : [1, 15, 23...]
    return (data || []).map((row: any) => row.gid);
}

export const fetchGamesLinkedToUserWithAllAchievements = async (uid: string): Promise<Game[]> => {
    const { data, error } = await supabase
        .from('game')
        .select(`
            id,
            name,
            description,
            pegi,
            image_url,
            usergame!inner (uid),
            achievements:achievement (
                id,
                name,
                description,
                gid
            ),
            consoles:gameconsole (
                console (
                    id,
                    name,
                    brand,
                    release_year,
                    description,
                    image_url
                )
            )
        `)
        .eq('usergame.uid', uid);
        
    if (error) {
        throw new Error(error.message);
    }

    // Transformation des données pour "aplatir" la structure des consoles
    const formattedData = (data || []).map((game: any) => ({
        ...game,
        // Supabase renvoie [{ console: {nom: 'PS5'} }], on transforme en [{ nom: 'PS5' }]
        consoles: game.consoles ? game.consoles.map((gc: any) => gc.console) : [],
        // Les achievements sont déjà au bon format (1:N), on assure juste le tableau vide
        achievements: game.achievements || []
    }));

    return formattedData as Game[];
}