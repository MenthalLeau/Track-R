import { fetchAchievements } from "../http/achievement"
import { fetchConsoles } from "../http/console"
import { fetchGames } from "../http/game"

export interface Profile {
    id: number
    first_name: string
    last_name: string
    pseudo: string
    birth_date: string
}

export type TablesInDatabase = 'profile' | 'console' | 'game' | 'achievement' | 'gameconsoles' | 'usergame' | 'userachievement';

export function getAllDataFromTable(table: TablesInDatabase): Promise<any[]> {
    switch (table) {
        case 'achievement':
            return fetchAchievements();
        case 'game':
            return fetchGames();
        case 'console':
            return fetchConsoles();
        // Ajouter d'autres cas pour les autres tables si nécessaire
        default:
            return Promise.resolve([]);
    }
}
