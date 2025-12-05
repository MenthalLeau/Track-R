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

const Profile: React.FC<ProfileProps> = ({ userId }) => {
    // Mock data - replace with actual API call
    const profile: ProfileData = {
        username: "Player123",
        avatar: "https://via.placeholder.com/150",
        level: 42,
        xp: 3500,
        totalXp: 5000,
        badges: [
            { id: '1', name: 'Achievement Hunter', image: 'https://via.placeholder.com/64', earnedDate: '2024-01-15' },
            { id: '2', name: 'Game Master', image: 'https://via.placeholder.com/64', earnedDate: '2024-02-20' },
        ],
        recentGames: [
            { id: '1', name: 'Game Title 1', hoursPlayed: 120, lastPlayed: '2 hours ago', image: 'https://via.placeholder.com/184x69' },
            { id: '2', name: 'Game Title 2', hoursPlayed: 45, lastPlayed: '1 day ago', image: 'https://via.placeholder.com/184x69' },
        ],
        stats: {
            gamesOwned: 156,
            achievements: 842,
            friendsCount: 89,
        }
    };

    const xpPercentage = (profile.xp / profile.totalXp) * 100;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img src={profile.avatar} alt={profile.username} />
                    <div className="profile-level">
                        <span>{profile.level}</span>
                    </div>
                </div>
                <div className="profile-info">
                    <h1>{profile.username}</h1>
                    <div className="profile-level-bar">
                        <div className="level-bar-fill" style={{ width: `${xpPercentage}%` }} />
                        <span className="level-text">Level {profile.level} - {profile.xp}/{profile.totalXp} XP</span>
                    </div>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-box">
                    <h3>{profile.stats.gamesOwned}</h3>
                    <p>Games</p>
                </div>
                <div className="stat-box">
                    <h3>{profile.stats.achievements}</h3>
                    <p>Achievements</p>
                </div>
                <div className="stat-box">
                    <h3>{profile.stats.friendsCount}</h3>
                    <p>Friends</p>
                </div>
            </div>

            <div className="profile-section">
                <h2>Badges</h2>
                <div className="badges-grid">
                    {profile.badges.map(badge => (
                        <div key={badge.id} className="badge-item">
                            <img src={badge.image} alt={badge.name} />
                            <p>{badge.name}</p>
                            <span className="badge-date">{badge.earnedDate}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="profile-section">
                <h2>Recent Games</h2>
                <div className="games-list">
                    {profile.recentGames.map(game => (
                        <div key={game.id} className="game-item">
                            <img src={game.image} alt={game.name} />
                            <div className="game-info">
                                <h3>{game.name}</h3>
                                <p>{game.hoursPlayed} hours played</p>
                                <span>Last played: {game.lastPlayed}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;