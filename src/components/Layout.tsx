import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { TopBar } from './layout/TopBar';
import type { Theme } from './theme';
import { getThemeTokens } from './theme';

export default function Layout() {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('trackr-theme');
        return (savedTheme as Theme) || 'dark';
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Récupération des tokens
    const t = getThemeTokens(theme);

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            localStorage.setItem('trackr-theme', newTheme);
            return newTheme;
        });
    };
    return (
        <div className={`min-h-screen transition-colors duration-300 ${t.layout.mainBg} ${t.text.main}`}>

            <Sidebar theme={theme} />

            <div className="ml-64 flex flex-col min-h-screen transition-all duration-300">
                <TopBar
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <div className="flex-1 p-8">
                    <Outlet context={{ theme, searchQuery }} />
                </div>
            </div>
        </div>
    );
}