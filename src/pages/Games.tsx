import React, { useState, useEffect } from "react";
import { createGame, fetchGames, type Game } from "../http/game";
import { useNavigate } from "react-router-dom";
import { GenericAdminForm } from "./GenericAdminForm";

const Games = () => {
    const [games, setGames] = useState<Game[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndSetGames = async () => {
            const games = await fetchGames();
            setGames(games);
        };
        fetchAndSetGames();
    }, []);

    return (
        <>
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
                    navigate(0); // Simple page reload to refresh the list
                }}
            />  </>
    );
};

export default Games;