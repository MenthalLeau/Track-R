import { useAuth } from '../context/AuthContext.tsx';
import {Link} from "react-router-dom";

const Settings = () => {
    const { user } = useAuth();

    return (
        <div>
            {user ? (
                <div>
                    <h1>Settings Page</h1>
                    <p>This is the Settings page.</p>
                </div>
            ) : (
                <div>
                    <p>Please log in to access this page.</p>
                    <Link to="/login" className="bg-blue-500 text-white py-2 px-4 rounded">Go to Login</Link>
                </div>
            )}
        </div>
    );
};

export default Settings;


