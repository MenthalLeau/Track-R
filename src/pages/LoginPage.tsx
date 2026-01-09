import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

// add tailwind styles

const LoginPage: React.FC = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    }

    return (
        <div className="login-container mx-auto mt-20 p-6 max-w-md bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="login-form flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    required
                />
                <button type="button" onClick={handleRegisterRedirect} className="text-blue-500 underline">
                    Don't have an account? Register
                </button>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                {error && <p className="error-message text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;