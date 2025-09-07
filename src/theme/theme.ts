const theme = {
    colors: {
        primary: '#28a745',
        background: '#f0f2f5',
        surface: '#ffffff',
        text: '#000000',
        textSecondary: '#a0a0a0',
        border: '#e0e0e0',
        error: '#ff453a',
        white: '#ffffff',
        black: '#000000',
        placeholder: '#e0e0e0',
        progressBarBackground: '#cccccc',
        overlay: 'rgba(0, 0, 0, 0.6)',
    },
    spacing: {
        small: 8,
        medium: 16,
        large: 24,
    },
    fontSizes: {
        body: 14,
        heading: 20,
    },
};

export type AppTheme = typeof theme;

export const lightTheme = theme;

export const darkTheme: AppTheme = {
    ...theme,
    colors: {
        primary: '#30c551',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#ffffff',
        textSecondary: '#888888',
        border: '#333333',
        error: '#ff6b6b',
        white: '#ffffff',
        black: '#000000',
        placeholder: '#333333',
        progressBarBackground: '#444444',
        overlay: 'rgba(0, 0, 0, 0.7)',
    },
};

export default lightTheme;