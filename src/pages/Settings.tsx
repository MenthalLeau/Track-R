import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import {
    User as UserIcon,
    Mail,
    Lock,
    LogOut,
    Trash2,
    Save,
    AlertTriangle,
    X,
    CheckCircle2,
    Loader2,
    LogIn
} from 'lucide-react';

import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { getThemeTokens } from '../components/theme';
import type { Theme } from '../components/theme';

export default function SettingsPage() {
    // --- 1. CONFIGURATION DU THÈME & AUTH ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // --- 2. ÉTATS DU FORMULAIRE ---
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // États pour la modale de suppression
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // Synchronisation des données (Pré-remplissage)
    useEffect(() => {
        if (user) {
            setNickname(user.user_metadata?.nickname || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // --- 3. LOGIQUE MÉTIER ---

    // Mise à jour du Pseudo
    const handleUpdateNickname = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { nickname: nickname }
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Pseudo mis à jour avec succès !' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Mise à jour de l'Email
    const handleUpdateEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ type: 'error', text: "L'adresse email doit avoir un format valide." });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Un email de confirmation a été envoyé à la nouvelle adresse.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Mise à jour du Mot de passe
    const handleUpdatePassword = async () => {
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Mot de passe mis à jour.' });
            setNewPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    // Déconnexion
    const handleLogoutAction = async () => {
        await signOut();
        navigate('/login');
    };

    // Suppression du compte
    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "SUPPRESSION") return;

        setLoading(true);
        try {
            // Note: Nécessite une fonction RPC "delete_user_account" dans Supabase
            const { error } = await supabase.rpc('delete_user_account');
            if (error) throw error;

            await signOut();
            navigate('/register');
        } catch (err: any) {
            setMessage({ type: 'error', text: "Erreur lors de la suppression. Contactez le support." });
            setIsDeleteModalOpen(false);
        } finally {
            setLoading(false);
        }
    };

    // --- 4. GESTION ACCÈS RESTREINT ---
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500">
                    <Lock className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h1 className={`text-2xl font-bold ${t.text.main}`}>Accès restreint</h1>
                    <p className={`${t.text.muted}`}>Veuillez vous connecter pour accéder à vos paramètres.</p>
                </div>
                <Link
                    to="/login"
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                >
                    <LogIn className="w-5 h-5" />
                    Aller à la page de connexion
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${t.text.main}`}>Mon Compte</h1>
                    <p className={`${t.text.muted}`}>Gérez vos informations personnelles et votre sécurité</p>
                </div>
            </div>

            {/* Messages Feedback (Succès / Erreur) */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                    message.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                    <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* --- SECTION PROFIL --- */}
                <section className={`p-6 rounded-3xl border backdrop-blur-xl ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${t.text.main}`}>Profil</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nickname" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                                Pseudo public
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="nickname"
                                    type="text"
                                    autoComplete="username"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${t.input.bg} ${t.input.border} ${t.text.main}`}
                                />
                                <button
                                    onClick={handleUpdateNickname}
                                    disabled={loading}
                                    title="Sauvegarder le pseudo"
                                    className={`p-3 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION SÉCURITÉ --- */}
                <section className={`p-6 rounded-3xl border backdrop-blur-xl ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h2 className={`text-xl font-bold ${t.text.main}`}>Sécurité</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="email" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                                Email
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${t.input.bg} ${t.input.border} ${t.text.main}`}
                                />
                                <button
                                    onClick={handleUpdateEmail}
                                    disabled={loading}
                                    title="Mettre à jour l'email"
                                    className={`p-3 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Mail className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="new-password" className={`block text-sm mb-2 font-medium ${t.text.inactive}`}>
                                Nouveau mot de passe
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${t.input.bg} ${t.input.border} ${t.text.main}`}
                                />
                                <button
                                    onClick={handleUpdatePassword}
                                    disabled={loading}
                                    title="Mettre à jour le mot de passe"
                                    className={`p-3 rounded-xl transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION ACTIONS (DANGER) --- */}
                <section className={`p-6 rounded-3xl border backdrop-blur-xl md:col-span-2 ${t.layout.bg} ${t.layout.border} ${t.layout.shadow}`}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="text-center sm:text-left">
                            <h2 className={`text-xl font-bold ${t.text.main}`}>Gestion du compte</h2>
                            <p className={`${t.text.muted} text-sm`}>Actions irréversibles et déconnexion</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            <button
                                onClick={handleLogoutAction}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                            >
                                <LogOut className="w-5 h-5" />
                                Déconnexion
                            </button>

                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            >
                                <Trash2 className="w-5 h-5" />
                                Supprimer le compte
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* --- MODAL DE SUPPRESSION --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${t.layout.bg} ${t.layout.border}`}>
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h2 className={`text-2xl font-bold ${t.text.main}`}>Action Irréversible</h2>
                            <p className={`${t.text.muted} text-sm`}>
                                Toutes vos données seront définitivement supprimées. Cette action ne peut pas être annulée.
                            </p>

                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-left">
                                <p className="text-red-500 text-xs font-bold uppercase mb-2">Confirmation requise</p>
                                <p className={`${t.text.main} text-sm mb-3`}>
                                    Veuillez écrire <span className="font-mono font-bold">SUPPRESSION</span> pour confirmer.
                                </p>
                                <input
                                    type="text"
                                    autoFocus
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    placeholder="Écrivez SUPPRESSION..."
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none border-red-500/30 bg-red-500/5 text-red-500 placeholder-red-500/30"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmation !== "SUPPRESSION" || loading}
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                        deleteConfirmation === "SUPPRESSION"
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600'
                                            : 'bg-gray-500/10 text-gray-500 cursor-not-allowed opacity-50'
                                    }`}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Supprimer"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}