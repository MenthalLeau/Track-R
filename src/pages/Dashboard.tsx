import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    User as UserIcon,
    LogOut,
    Clock,
    Calendar,
    Shield,
    Activity,
    LogIn
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getThemeTokens } from '../components/theme';
import type { Theme } from '../components/theme';

export default function Dashboard() {
    // --- 1. CONFIGURATION DU THÈME ---
    const context = useOutletContext<{ theme: Theme }>();
    const currentTheme: Theme = context?.theme || (localStorage.getItem('trackr-theme') as Theme) || 'dark';
    const t = getThemeTokens(currentTheme);

    // --- 2. LOGIQUE MÉTIER ---
    const { user, profile, signOut } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSignOut = async () => {
        setError(null);
        try {
            await signOut();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // --- 3. RENDU CONDITIONNEL (NON CONNECTÉ) ---
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-500">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500`}>
                    <UserIcon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h1 className={`text-2xl font-bold ${t.text.main}`}>Accès restreint</h1>
                    <p className={`${t.text.muted}`}>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
                </div>
                <Link
                    to="/login"
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow} ${t.primaryAction.hover}`}
                >
                    <LogIn className="w-5 h-5" />
                    Aller à la page de connexion
                </Link>
            </div>
        );
    }

    // --- 4. RENDU PRINCIPAL (CONNECTÉ) ---
    const displayName = profile?.nickname || user.email?.split('@')[0] || 'Gamer';
    const userRole = profile?.rid === 2 ? 'Administrateur' : 'Membre';
    const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Récemment';

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">

            {/* Header / Titre */}
            <div className="flex justify-between items-center">
                <h2 className={`text-3xl font-bold ${t.text.main}`}>Tableau de bord</h2>
                <button
                    onClick={handleSignOut}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20`}
                >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- COLONNE PRINCIPALE (GAUCHE) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Carte En-tête Joueur */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            {/* Avatar */}
                            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border-4 flex-shrink-0 shadow-xl overflow-hidden ${t.cover.bgGradient} ${t.layout.border} ${t.text.main}`}>
                                {user.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    displayName.charAt(0).toUpperCase()
                                )}
                            </div>

                            {/* Infos */}
                            <div className="flex-1 py-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                                    <h2 className={`text-3xl font-bold ${t.text.main}`}>{displayName}</h2>
                                    <div className={`w-fit px-3 py-1 rounded-lg text-sm font-bold border flex items-center gap-2 ${t.layout.bg} ${t.layout.border} ${t.text.main}`}>
                                        <Shield className="w-3 h-3 text-purple-500" />
                                        {userRole}
                                    </div>
                                </div>

                                <p className={`flex items-center gap-2 text-sm mb-4 ${t.text.muted}`}>
                                    <UserIcon className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-3 rounded-xl border ${t.layout.bg} ${t.layout.border}`}>
                                        <p className={`text-xs mb-1 ${t.text.muted}`}>Membre depuis</p>
                                        <p className={`font-semibold flex items-center gap-2 ${t.text.main}`}>
                                            <Calendar className="w-4 h-4 opacity-70" />
                                            {memberSince}
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-xl border ${t.layout.bg} ${t.layout.border}`}>
                                        <p className={`text-xs mb-1 ${t.text.muted}`}>Statut du compte</p>
                                        <p className={`font-semibold flex items-center gap-2 text-green-500`}>
                                            <Activity className="w-4 h-4" />
                                            Actif
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section "À venir" (Placeholder pour le contenu futur) */}
                    <div className={`rounded-2xl p-8 text-center border border-dashed ${t.layout.border} ${t.text.muted}`}>
                        <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className={`text-lg font-medium mb-2 ${t.text.main}`}>Activités récentes</h3>
                        <p className="text-sm max-w-md mx-auto">
                            Vos statistiques de jeu et vos dernières sessions apparaîtront ici une fois que vous aurez commencé à utiliser le tracker.
                        </p>
                    </div>
                </div>

                {/* --- COLONNE LATÉRALE (DROITE) --- */}
                <div className="space-y-6">

                    {/* Carte Profil Rapide */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <h3 className={`text-lg font-bold mb-4 ${t.text.main}`}>Informations</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.text.muted}`}>Rôle ID (RID)</span>
                                <span className={`font-mono text-sm ${t.text.main}`}>{profile?.rid || 'N/A'}</span>
                            </div>
                            <div className="h-px bg-current opacity-10"></div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${t.text.muted}`}>ID Utilisateur</span>
                                <span className={`font-mono text-xs ${t.text.main} truncate max-w-[150px]`} title={user.id}>
                                    {user.id.substring(0, 8)}...
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/settings"
                            className={`mt-6 w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border ${t.layout.bg} ${t.layout.border} ${t.text.main} hover:bg-black/5`}
                        >
                            Gérer le profil
                        </Link>
                    </div>

                    {/* Carte Aide / Support */}
                    <div className={`rounded-2xl p-6 border shadow-lg ${t.card.base} ${t.card.border}`}>
                        <h3 className={`text-lg font-bold mb-2 ${t.text.main}`}>Besoin d'aide ?</h3>
                        <p className={`text-sm mb-4 ${t.text.inactive}`}>
                            Si vous rencontrez des problèmes ou avez des questions, notre support est là pour vous.
                        </p>
                        <button className={`w-full text-left text-sm ${t.text.highlight} hover:underline`}>
                            Contacter le support &rarr;
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}