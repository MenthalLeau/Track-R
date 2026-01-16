import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { fetchAllUsers, type User } from '../http/user.ts';

const Players = () => {
    const { user } = useAuth();

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [order, setOrder] = useState<number>(1);

    useEffect(() => {
        const funFetchAllUsers = async () => {
            const res = await fetchAllUsers(order);
            setAllUsers(res);
        }
        funFetchAllUsers();
    }, [order]);
    console.log(allUsers);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Liste des joueurs</h2>
            <div className="mb-4">
                <label htmlFor="order" className="mr-2 font-medium">Trier par :</label>
                <select
                    id="order"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value))}
                    className="border rounded px-2 py-1"
                >
                    <option value={1}>Nom de joueur (A-Z)</option>
                    <option value={2}>Nombre de jeux suivis (décroissant)</option>
                    <option value={3}>Nombre de succès suivis (décroissant)</option>
                </select>
            </div>
            <ul className="space-y-2">
                {allUsers.map((u) => (
                    <li key={u.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200">
                        <span className="font-medium">{u.nickname || 'Joueur sans pseudo'}</span>
                        <span className="ml-2 text-sm text-gray-500">Inscrit le {new Date(u.created_at).toLocaleDateString()}</span>
                        <span className="ml-2 text-sm text-gray-500">({u.countFollowedGames} jeux suivis, {u.countFollowedAchievements} succès suivis)</span>
                        {u.id === user?.id && <span className="ml-2 text-sm text-blue-500">(C'est vous)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Players;


