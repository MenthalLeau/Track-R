export type Theme = "dark" | "light";

export type ThemeTokens = {
    layout: {
        bg: string;
        mainBg: string;
        border: string;
        shadow: string;
    };
    text: {
        main: string;
        muted: string;
        inactive: string;
        highlight: string; // Nouveau : pour le texte jaune/doré
    };
    input: {
        bg: string;
        border: string;
        placeholder: string;
        focusBg: string;
        focusBorder: string;
        icon: string;
    };
    iconButton: {
        base: string;
        hover: string;
    };
    primaryAction: {
        bgGradient: string;
        shadow: string;
        text: string;
        hover: string;
    };
    card: {
        base: string;        // Nouveau : Fond de carte standard
        hover: string;       // Nouveau : Fond au survol
        bgGradient: string;  // Fond gradient (profil, etc.)
        border: string;
        hoverBorder: string;
        shadow: string;      // Nouveau : Ombre de carte
    };
    modal: {                 // Nouveau : Section spécifique pour les modales
        overlay: string;
        bgGradient: string;
        border: string;
        shadow: string;
    };
    cover: {                 // Nouveau : Pour les placeholders d'images
        bgGradient: string;
    };
    error: {
        bg: string;
        border: string;
        text: string;
    };
};

export const tokens: Record<Theme, ThemeTokens> = {
    dark: {
        layout: {
            bg: "bg-gray-900/70 backdrop-blur-2xl",
            mainBg: "bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900",
            border: "border-purple-500/20",
            shadow: "shadow-sm shadow-purple-500/10",
        },
        text: {
            main: "text-white",
            muted: "text-purple-400",
            inactive: "text-gray-300",
            highlight: "text-yellow-400",
        },
        input: {
            bg: "bg-gray-800/80 backdrop-blur-xl",
            border: "border-purple-500/20",
            placeholder: "placeholder-purple-400/60",
            focusBg: "focus:bg-gray-800",
            focusBorder: "focus:ring-2 focus:ring-purple-500/50 border",
            icon: "text-purple-400",
        },
        iconButton: {
            base: "text-purple-400",
            hover: "hover:bg-purple-500/20",
        },
        primaryAction: {
            bgGradient: "bg-gradient-to-r from-purple-500 to-purple-600",
            shadow: "shadow-lg shadow-purple-500/30",
            text: "text-white",
            hover: "hover:from-purple-600 hover:to-purple-700",
        },
        card: {
            base: "bg-gray-900/70 backdrop-blur-2xl",
            hover: "hover:bg-gray-900/80",
            bgGradient: "bg-gradient-to-br from-purple-900/40 to-purple-800/40",
            border: "border-purple-500/20",
            hoverBorder: "hover:border-purple-500/30",
            shadow: "shadow-lg shadow-purple-500/20",
        },
        modal: {
            overlay: "bg-black/80 backdrop-blur-sm",
            bgGradient: "bg-gradient-to-br from-gray-900/90 to-purple-900/90",
            border: "border-purple-500/30",
            shadow: "shadow-purple-500/40",
        },
        cover: {
            bgGradient: "bg-gradient-to-br from-purple-600 to-pink-600",
        },
        error: {
            bg: "bg-red-500/20 border",
            border: "border-red-500/30",
            text: "text-red-300",
        }
    },
    light: {
        layout: {
            bg: "bg-white/70 backdrop-blur-2xl",
            mainBg: "bg-gradient-to-br from-slate-100 via-white to-purple-50/50",
            border: "border-purple-200/30",
            shadow: "shadow-sm shadow-purple-500/5",
        },
        text: {
            main: "text-indigo-900",
            muted: "text-purple-600",
            inactive: "text-indigo-700",
            highlight: "text-yellow-600",
        },
        input: {
            bg: "bg-purple-50/80 backdrop-blur-xl",
            border: "border-purple-200/30",
            placeholder: "placeholder-purple-400",
            focusBg: "focus:bg-purple-50",
            focusBorder: "focus:ring-2 focus:ring-purple-500/50 border",
            icon: "text-purple-500",
        },
        iconButton: {
            base: "text-purple-600",
            hover: "hover:bg-purple-100/50",
        },
        primaryAction: {
            bgGradient: "bg-gradient-to-r from-purple-500 to-purple-600",
            shadow: "shadow-lg shadow-purple-500/30",
            text: "text-white",
            hover: "hover:from-purple-600 hover:to-purple-700",
        },
        card: {
            base: "bg-white/70 backdrop-blur-2xl",
            hover: "hover:bg-white/80",
            bgGradient: "bg-gradient-to-br from-purple-100/80 to-purple-50/80",
            border: "border-purple-200/30",
            hoverBorder: "hover:border-purple-500/20",
            shadow: "shadow-lg shadow-purple-500/10",
        },
        modal: {
            overlay: "bg-black/80 backdrop-blur-sm",
            bgGradient: "bg-gradient-to-br from-white/90 to-purple-50/90",
            border: "border-purple-200/40",
            shadow: "shadow-purple-500/30",
        },
        cover: {
            bgGradient: "bg-gradient-to-br from-purple-400 to-pink-400",
        },
        error: {
            bg: "bg-red-50 border",
            border: "border-red-200",
            text: "text-red-700",
        }
    },
};

export function getThemeTokens(theme: Theme): ThemeTokens {
    return tokens[theme];
}