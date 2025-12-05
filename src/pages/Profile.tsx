import React from 'react';
import './Profile.css';

interface ProfileProps {
    userId?: string;
}

interface ProfileData {
    username: string;
    avatar: string;
    level: number;
    xp: number;
    totalXp: number;
    badges: Badge[];
    recentGames: Game[];
    stats: Stats;
}

interface Badge {
    id: string;
    name: string;
    image: string;
    earnedDate: string;
}

interface Game {
    id: string;
    name: string;
    hoursPlayed: number;
    lastPlayed: string;
    image: string;
}

interface Stats {
    gamesOwned: number;
    achievements: number;
    friendsCount: number;
}

const Profile: React.FC<ProfileProps> = () => {

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <p>This is the profile page </p>
        </div>
    );
};

export default Profile;