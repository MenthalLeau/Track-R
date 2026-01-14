import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getThemeTokens } from '../components/theme';
import type { Theme } from '../components/theme';

export default function RegisterPage() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. LOGIQUE DU COMPOSANT ---
    const { signUp } = useAuth();
    const navigate = useNavigate();

    // États locaux
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Helper : Traduction des erreurs Supabase
    const translateError = (message: string) => {
        const msg = message.toLowerCase();
        if (msg.includes("password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
        if (msg.includes("user already registered")) return "Cette adresse email est déjà utilisée.";
        if (msg.includes("invalid format") || msg.includes("email address")) return "L'adresse email n'est pas valide.";
        if (msg.includes("rate limit exceeded")) return "Trop de tentatives. Veuillez réessayer plus tard.";
        if (msg.includes("signup is disabled")) return "Les inscriptions sont actuellement désactivées.";
        return "Une erreur est survenue lors de l'inscription.";
    };

    // Gestion de la soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Vérification des champs vides
        if (!nickname || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        // 2. Validation stricte de l'email (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("L'adresse email doit avoir un format valide (ex: exemple@test.fr)");
            return;
        }

        setLoading(true);
        try {
            await signUp(nickname, email, password);
            navigate('/login'); // Redirection vers le login après succès (ou confirmation email)
        } catch (err: any) {
            console.error(err);
            const translatedMsg = translateError(err.message || "");
            setError(translatedMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] transition-colors duration-500">

            {/* --- CARTE D'INSCRIPTION --- */}
            <div className={`w-full max-w-md backdrop-blur-2xl rounded-3xl p-10 shadow-2xl transition-all duration-300 ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>

                {/* 1. Logo & En-tête */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/40">
                        <span className="text-white text-2xl font-bold">T</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${t.text.main}`}>
                        Créer un compte
                    </h1>
                    <p className={`text-sm ${t.text.muted}`}>
                        Rejoignez la communauté Track-R
                    </p>
                </div>

                {/* 2. Formulaire */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Message d'erreur */}
                    {error && (
                        <div className={`p-4 rounded-xl text-sm ${t.error.bg} ${t.error.border} ${t.error.text}`}>
                            {error}
                        </div>
                    )}

                    {/* Champ Pseudo */}
                    <div>
                        <label htmlFor="nickname" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                            Pseudo
                        </label>
                        <div className="relative">
                            <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${t.text.muted}`} />
                            <input
                                id="nickname"
                                name="nickname"
                                type="text"
                                autoComplete="username"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Votre pseudo"
                                required
                                className={`w-full z-0 pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg} ${t.input.focusBorder}`}
                            />
                        </div>
                    </div>

                    {/* Champ Email */}
                    <div>
                        <label htmlFor="email" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                            Adresse email
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${t.text.muted}`} />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                required
                                className={`w-full z-0 pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg} ${t.input.focusBorder}`}
                            />
                        </div>
                    </div>

                    {/* Champ Mot de passe */}
                    <div>
                        <label htmlFor="password" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${t.text.muted}`} />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full z-0 pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none ${t.input.bg} ${t.input.border} ${t.text.main} ${t.input.placeholder} ${t.input.focusBg} ${t.input.focusBorder}`}
                            />
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-all group disabled:opacity-70 disabled:cursor-not-allowed ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Création...</span>
                            </>
                        ) : (
                            <>
                                <span>S'inscrire</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* 3. Pied de carte (Divider + Lien Login) */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center opacity-30">
                        <div className={`w-full border-t ${t.layout.border}`}></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className={`px-4 text-sm ${t.layout.bg} ${t.text.muted}`}>
                          ou
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className={`text-sm ${t.text.inactive}`}>
                        Déjà un compte ?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className={`font-medium transition-colors ${t.iconButton.base} hover:underline`}
                        >
                            Se connecter
                        </button>
                    </p>
                </div>
            </div>

            {/* --- ARRIÈRE-PLAN DÉCORATIF --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-purple-600"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-indigo-600"></div>
            </div>
        </div>
    );
}