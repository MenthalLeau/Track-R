import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import {getThemeTokens} from "../components/theme.ts";
import type { Theme } from '../components/theme';

interface LoginProps {
    theme?: Theme;
}

export default function LoginPage({ theme = 'dark' }: LoginProps) {
    // --- LOGIQUE METIER (Auth & Navigation) ---
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const t = getThemeTokens(theme);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToRegister = () => {
        navigate('/register');
    };

    console.log(t.layout.bg);

    // --- RENDU VISUEL ---
    return (
        <div className={`flex items-center justify-center`}>

            {/* Login Card */}
            <div className={`w-full max-w-md backdrop-blur-2xl rounded-3xl p-10 shadow-2xl transition-colors duration-300 ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/40">
                        <span className="text-white text-2xl font-bold">T</span>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>
                        Connexion
                    </h1>
                    <p className={`text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                        Bienvenue sur Track-R
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Error Message */}
                    {error && (
                        <div className={`p-4 rounded-xl text-sm ${
                            theme === 'dark'
                                ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                                : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                            {error}
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-900'}`}>
                            Adresse email
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                            }`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800/60 border border-purple-500/20 text-white placeholder-purple-400/60'
                                        : 'bg-purple-50/80 border border-purple-200/30 text-indigo-900 placeholder-purple-400/80'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-indigo-900'}`}>
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                            }`} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800/60 border border-purple-500/20 text-white placeholder-purple-400/60'
                                        : 'bg-purple-50/80 border border-purple-200/30 text-indigo-900 placeholder-purple-400/80'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className={`text-sm transition-colors ${
                                theme === 'dark'
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-purple-600 hover:text-purple-700'
                            }`}
                        >
                            Mot de passe oublié ?
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/50 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Connexion...</span>
                            </>
                        ) : (
                            <>
                                <span>Se connecter</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className={`absolute inset-0 flex items-center ${
                        theme === 'dark' ? 'opacity-20' : 'opacity-30'
                    }`}>
                        <div className={`w-full border-t ${
                            theme === 'dark' ? 'border-purple-500' : 'border-purple-300'
                        }`}></div>
                    </div>
                    <div className="relative flex justify-center">
            <span className={`px-4 text-sm ${
                theme === 'dark' ? 'bg-gray-900/60 text-purple-400' : 'bg-white/70 text-purple-600'
            }`}>
              ou
            </span>
                    </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Vous n'avez pas de compte ?{' '}
                        <button
                            type="button"
                            onClick={handleNavigateToRegister}
                            className={`font-medium transition-colors ${
                                theme === 'dark'
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-purple-600 hover:text-purple-700'
                            }`}
                        >
                            Créer un compte
                        </button>
                    </p>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        En continuant, vous acceptez nos conditions d'utilisation
                    </p>
                </div>
            </div>

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
                    theme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
                }`}></div>
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
                    theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}></div>
            </div>
        </div>
    );
}