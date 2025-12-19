import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Gamepad2, Trophy, Settings, LogOut, LogIn } from 'lucide-react';
import { getThemeTokens } from '../theme';
import type { Theme } from '../theme';
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient.ts";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SidebarProps {
    theme?: Theme;
}

export function Sidebar({ theme = 'dark' }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const t = getThemeTokens(theme);

    // États locaux
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // 1. Gestion de l'authentification (Session + Écouteur temps réel)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) setIsProfileOpen(false); // Ferme le menu si déconnexion externe
        });

        return () => subscription.unsubscribe();
    }, []);

    // 2. Gestion du clic extérieur (Actif uniquement si le menu est ouvert)
    useEffect(() => {
        if (!isProfileOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isProfileOpen]);

    // Action de déconnexion
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
        navigate('/login');
    };

    // Récupération du nom : Nickname > Email > "Gamer"
    const getDisplayName = () => {
        if (!user) return '';
        return user.user_metadata?.nickname || user.email?.split('@')[0] || 'Gamer';
    };

    const avatarUrl = user?.user_metadata?.avatar_url;

    // Gestion de l'état actif des liens
    const isActive = (path: string) => location.pathname === path;

    const getLinkClass = (path: string) => {
        const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-1";
        if (isActive(path)) {
            // Style Actif (Gradient Violet)
            return `${baseClass} ${t.primaryAction.bgGradient} ${t.primaryAction.text} ${t.primaryAction.shadow}`;
        }
        // Style Inactif (Gris avec hover)
        return `${baseClass} ${t.text.inactive} ${t.iconButton.hover} hover:${t.text.muted}`;
    };

    return (
        <aside className={`w-64 fixed inset-y-0 left-0 z-40 flex flex-col shadow-xl transition-colors duration-300 border-r ${t.layout.bg} ${t.layout.border}`}>

            {/* En-tête : Logo */}
            <div className={`px-6 py-6 border-b transition-colors duration-300 ${t.layout.border}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-white font-bold">T</span>
                    </div>
                    <div>
                        <span className={`text-lg font-bold block leading-none ${t.text.main}`}>Track-R</span>
                        <p className={`text-xs mt-1 ${t.text.muted}`}>by artaLeau</p>
                    </div>
                </div>
            </div>

            {/* Navigation Principale */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                <Link to="/" className={getLinkClass('/')}>
                    <Search className="w-5 h-5" />
                    Accueil
                </Link>
                <Link to="/players" className={getLinkClass('/players')}>
                    <User className="w-5 h-5" />
                    Joueurs
                </Link>
                <Link to="/games" className={getLinkClass('/games')}>
                    <Gamepad2 className="w-5 h-5" />
                    Jeux
                </Link>
                <Link to="/consoles" className={getLinkClass('/consoles')}>
                    <Trophy className="w-5 h-5" />
                    Consoles
                </Link>
            </nav>

            {/* Pied de page : Profil Utilisateur */}
            <div className={`px-4 py-4 border-t transition-colors duration-300 ${t.layout.border} relative`} ref={menuRef}>

                {user ? (
                    <>
                        {/* Menu contextuel (Pop-up) */}
                        <div className={`absolute bottom-full left-4 right-4 mb-2 rounded-xl border p-1 shadow-2xl backdrop-blur-2xl transition-all duration-200 origin-bottom ${t.layout.bg} ${t.layout.border} ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                            <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${t.text.inactive} hover:bg-purple-500/10 hover:text-purple-500`}>
                                <User className="w-4 h-4" />
                                Mon Profil
                            </Link>
                            <Link to="/settings" onClick={() => setIsProfileOpen(false)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${t.text.inactive} hover:bg-purple-500/10 hover:text-purple-500`}>
                                <Settings className="w-4 h-4" />
                                Mon Compte
                            </Link>
                            <div className={`h-px my-1 mx-2 ${t.layout.border}`}></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </div>

                        {/* Bouton Trigger Profil */}
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className={`w-full flex items-center gap-3 px-4 py-3 backdrop-blur-xl rounded-xl border transition-all text-left ${t.card.bgGradient} ${t.card.border} ${isProfileOpen ? 'ring-2 ring-purple-500/40' : t.card.hoverBorder}`}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-lg">
                                        {getDisplayName().charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${t.text.main}`}>
                                    {getDisplayName()}
                                </p>
                                <p className={`text-xs ${t.text.muted}`}>En ligne</p>
                            </div>
                        </button>
                    </>
                ) : (
                    /* État non connecté */
                    <Link
                        to="/login"
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${t.card.border} border hover:border-purple-500/50 ${t.text.muted} hover:text-purple-500 hover:bg-purple-500/10`}
                    >
                        <LogIn className="w-5 h-5" />
                        Se connecter
                    </Link>
                )}
            </div>
        </aside>
    );
}