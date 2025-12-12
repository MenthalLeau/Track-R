import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';

const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [error, setError] = useState<string | null>(null);

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
        </div>
    );
};

export default Dashboard;