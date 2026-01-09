import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { createGame, fetchGames, type Game } from '../http/game.ts';
import { GenericAdminForm } from './GenericAdminForm.tsx';

const Dashboard: React.FC = () => {
    const { user, loading, profile, signOut } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [games, setGames] = useState<Game[]>([]);

    console.log('User profile in Dashboard:', profile);

    const handleSignOut = async () => {
        setError(null);
        try {
            await signOut();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLoginRedirect = () => {
        window.location.href = '/login';
    }

    useEffect(() => {
        const fetchAndSetGames = async () => {
            const games = await fetchGames();
            setGames(games);
        };
        fetchAndSetGames();
    }, []);

    return (
        <div className='dashboard-container mx-auto mt-20 p-6 max-w-md bg-white rounded-lg shadow-md'>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.email}!</p>
                    <button onClick={handleSignOut} className="bg-red-500 text-white py-2 px-4 rounded">Sign Out</button>
                    {error && <p className='error-message text-red-500'>{error}</p>}
                </div>
            ) : (
                <div>
                    <p>Please log in to access your dashboard.</p>
                    <button onClick={handleLoginRedirect} className="bg-blue-500 text-white py-2 px-4 rounded">Go to Login</button>
                </div>
            )}
            {!loading && profile && (
                <div className="profile-info mt-6 p-4 border-t">
                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                    <p><strong>Nickname:</strong> {profile.nickname}</p>
                    <p><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
                    <p><strong>RID:</strong> {profile.rid}</p>
                </div>
            )}
            <div className="games-list mt-6 p-4 border-t">
                <h2 className="text-xl font-semibold mb-4">Games</h2>
                {games.length === 0 ? (
                    <p>No games available.</p>
                ) : (
                    <ul className="space-y-4">
                        {games.map((game) => (
                            <li key={game.id} className="p-4 border rounded">
                                {game.image_url && (<img src={game.image_url} alt={game.name} className="mb-4 w-full h-auto rounded" />)}
                                <h3 className="text-lg font-bold">{game.name}</h3>
                                <p>{game.description}</p>
                                <p><strong>PEGI:</strong> {game.pegi}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <GenericAdminForm
                fields={[
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'description', label: 'Description', type: 'textarea' },
                    { name: 'pegi', label: 'PEGI', type: 'number' },
                    { name: 'image_url', label: 'Image', type: 'image' },
                ]}
                onSubmit={createGame}
                onSuccess={() => {
                    alert('Game created successfully!');
                    // Refresh games list
                    fetchGames().then(setGames);
                }}
            />  
        </div>
    );
};

export default Dashboard;