import { useAuth } from '../context/AuthContext.tsx';

const Players = () => {
    const { user } = useAuth();

    const handleLoginRedirect = () => {
        window.location.href = '/login';
    }

    return (
        <div>
            {user ? (
            <div>
                <h1>Players Page</h1>
                <p>This is the Players page.</p>
            </div>
            ) : (
                <div>
                    <p>Please log in to access this page.</p>
                    <button onClick={handleLoginRedirect} className="bg-blue-500 text-white py-2 px-4 rounded">Go to Login</button>
                </div>
            )}
        </div>
    );
};

export default Players;


