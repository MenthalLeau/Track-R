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
        bgGradient: string;
        border: string;
        hoverBorder: string;
    };
    error: {
        bg: string;
        border: string;
        text: string;
    };
    success: {
        bg: string;
        border: string;
        text: string;
    };
};

export const tokens: Record<Theme, ThemeTokens> = {
    dark: {
        layout: {
            bg: "bg-gray-900/60 backdrop-blur-2xl",
            mainBg: "bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900",
            border: "border-purple-500/20",
            shadow: "shadow-sm shadow-purple-500/10",
        },
        text: {
            main: "text-white",
            muted: "text-purple-400",
            inactive: "text-gray-300",
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
            bgGradient: "bg-gradient-to-br from-purple-900/40 to-purple-800/40",
            border: "border-purple-500/20",
            hoverBorder: "hover:border-purple-500/40",
        },
        error: {
            bg: "bg-red-500/20 border",
            border: "border-red-500/30",
            text: "text-red-300",
        },
        success: {
            bg: "bg-green-500/20 border",
            border: "border-green-500/30",
            text: "text-green-500",
        }
    },
    light: {
        layout: {
            bg: "bg-white/60 backdrop-blur-2xl",
            mainBg: "bg-gradient-to-br from-purple-50 via-white to-purple-50/30",
            border: "border-purple-200/30",
            shadow: " shadow-purple-500/30",
        },
        text: {
            main: "text-indigo-900",
            muted: "text-purple-400",
            inactive: "text-indigo-700",
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
            bgGradient: "bg-gradient-to-br from-purple-100/80 to-purple-50/80",
            border: "border-purple-200/30",
            hoverBorder: "hover:border-purple-300/50",
        },
        error: {
            bg: "bg-red-50 border",
            border: "border-red-200",
            text: "text-red-700",
        },
        success: {
            bg: "bg-green-50 border",
            border: "border-green-200",
            text: "text-green-700",
        }
    },
};

export function getThemeTokens(theme: Theme): ThemeTokens {
    return tokens[theme];
}