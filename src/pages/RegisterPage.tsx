import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signUp(nickname, email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    }

    return (
        <div className="register-container mx-auto mt-20 p-6 max-w-md bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            <form onSubmit={handleSubmit} className="register-form flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                    required
                />
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
                <button type="button" onClick={handleLoginRedirect} className="text-blue-500 underline">
                    Already have an account? Login
                </button>
                <button type="submit" disabled={loading} className="bg-green-500 text-white py-2 px-4 rounded disabled:opacity-50">
                    {loading ? 'Registering...' : 'Register'}
                </button>
                {error && <p className="error-message text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default RegisterPage;