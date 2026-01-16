import { supabase } from "../lib/supabaseClient";

export interface User {
    id?: string;
    email: string;
    nickname: string;
    created_at: string;
    countFollowedGames?: number;
    countFollowedAchievements?: number;
}

export const fetchUserById = async (uid: string): Promise<User | null> => {
    const { data, error } = await supabase
        .from('profile')
        .select('uid, email, nickname, created_at, rid, followedGames:usergame (gid), followedAchievements:userachievement (aid)')
        .eq('uid', uid)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    if (data) {
        return {
            id: data.uid,
            email: data.email,
            nickname: data.nickname,
            created_at: data.created_at,
            countFollowedGames: data.followedGames ? data.followedGames.length : 0,
            countFollowedAchievements: data.followedAchievements ? data.followedAchievements.length : 0
        };
    }

    return null;
}

export const fetchAllUsers = async (orderValue : number): Promise<User[]> => {
    const { data, error } = await supabase
        .from('profile')
        .select('uid, email, nickname, created_at, rid');

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);

    if (data) {
        // recuperer les jeux suivis et les achievements suivis pour chaque utilisateur
        const count = await Promise.all(data.map(async (user) => {
            const { count: gamesCount } = await supabase
                .from('usergame')
                .select('*', { count: 'exact', head: true })
                .eq('uid', user.uid);

            const { count: achievementsCount } = await supabase
                .from('userachievement')
                .select('*', { count: 'exact', head: true })
                .eq('uid', user.uid);

            return {
                ...user,
                countFollowedGames: gamesCount || 0,
                countFollowedAchievements: achievementsCount || 0
            };
        }));

        switch (orderValue) {
            case 1:
                // trier par noms de joueurs
                count.sort((a, b) => a.nickname.localeCompare(b.nickname));
                break;
            case 2:
                // trier par nombre de jeux suivis
                count.sort((a, b) => (b.countFollowedGames || 0) - (a.countFollowedGames || 0));
                break;
            case 3:
                // trier par nombre de succès suivis
                count.sort((a, b) => (b.countFollowedAchievements || 0) - (a.countFollowedAchievements || 0));
                break;
            default:
                break;
        }

        return count.map(user => ({
            id: user.uid,
            email: user.email,
            nickname: user.nickname,
            created_at: user.created_at,
            countFollowedGames: user.countFollowedGames,
            countFollowedAchievements: user.countFollowedAchievements
        }));
    }

    return [];
}

export const fetchAllUsersQuery = async (query: string): Promise<User[]> => {
    const { data, error } = await supabase
        .from('profile')
        .select('uid, email, nickname, created_at, rid')
        .ilike('nickname', `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    console.log(data);

    if (data) {
        // recuperer les jeux suivis et les achievements suivis pour chaque utilisateur
        const count = await Promise.all(data.map(async (user) => {
            const { count: gamesCount } = await supabase
                .from('usergame')
                .select('*', { count: 'exact', head: true })
                .eq('uid', user.uid);

            const { count: achievementsCount } = await supabase
                .from('userachievement')
                .select('*', { count: 'exact', head: true })
                .eq('uid', user.uid);

            return {
                ...user,
                countFollowedGames: gamesCount || 0,
                countFollowedAchievements: achievementsCount || 0
            };
        }));

        return count.map(user => ({
            id: user.uid,
            email: user.email,
            nickname: user.nickname,
            created_at: user.created_at,
            countFollowedGames: user.countFollowedGames,
            countFollowedAchievements: user.countFollowedAchievements
        }));
    }

    return [];
}

export const fetchUserUnlockedAchievementsIds = async (uid: string): Promise<number[]> => {
    const { data, error } = await supabase
        .from('userachievement')
        .select('aid')
        .eq('uid', uid);

    if (error) {
        throw new Error(error.message);
    }

    return (data || []).map(ua => ua.aid);
}
