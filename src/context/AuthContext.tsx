import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profile')
            .select('nickname, created_at, rid')
            .eq('uid', userId)
            .single();
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    }

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setUser(session?.user || null);
            const profile = session?.user ? await fetchProfile(session.user.id) : null;
            setProfile(profile);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setLoading(false);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (nickname: string, email: string, password: string) => {
        setLoading(true);
        // Ici, on utilise signUp, et "options: { data: ... }" est autorisé !
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: { 
                data: { nickname } // C'est ça qui déclenchera votre Trigger SQL
            } 
        });
        setLoading(false);
        if (error) throw error;
        return data;
    };

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) throw error;
    };

    const signOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};