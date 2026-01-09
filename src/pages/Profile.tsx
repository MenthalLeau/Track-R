import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import './Profile.css';

const Profile: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className='profile-container mx-auto mt-20 p-6 max-w-md bg-white rounded-lg shadow-md'>
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>
            {user ? (
                <div>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User ID:</strong> {user.id}</p>
                </div>
            ) : (
                <p>No user is logged in.</p>
            )}
        </div>
    );
};

export default Profile;