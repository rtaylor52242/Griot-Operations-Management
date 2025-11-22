
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { PaintBrushIcon, SunIcon, MoonIcon } from './icons';

interface Theme {
    id: string;
    name: string;
    primary: string; // RGB values like '79 70 229'
    secondary: string; // RGB values
    hexPrimary: string; // Hex for display
}

export const themes: Theme[] = [
    { id: 'default', name: 'Griot Indigo', primary: '79 70 229', secondary: '124 58 237', hexPrimary: '#4f46e5' },
    { id: 'ocean', name: 'Ocean Blue', primary: '37 99 235', secondary: '14 165 233', hexPrimary: '#2563eb' },
    { id: 'forest', name: 'Forest Green', primary: '5 150 105', secondary: '16 185 129', hexPrimary: '#059669' },
    { id: 'sunset', name: 'Sunset Orange', primary: '234 88 12', secondary: '249 115 22', hexPrimary: '#ea580c' },
    { id: 'berry', name: 'Berry Pink', primary: '219 39 119', secondary: '244 114 182', hexPrimary: '#db2777' },
    { id: 'midnight', name: 'Midnight', primary: '31 41 55', secondary: '75 85 99', hexPrimary: '#1f2937' },
    { id: 'royal', name: 'Royal Gold', primary: '147 51 234', secondary: '217 119 6', hexPrimary: '#9333ea' },
    { id: 'earthy', name: 'Earthy Olive', primary: '101 163 13', secondary: '161 98 7', hexPrimary: '#65a30d' },
    { id: 'teal', name: 'Teal & Lime', primary: '13 148 136', secondary: '132 204 22', hexPrimary: '#0d9488' },
    { id: 'crimson', name: 'Crimson Red', primary: '220 38 38', secondary: '153 27 27', hexPrimary: '#dc2626' },
];

interface ThemeSelectorProps {
    currentTheme: string;
    onThemeSelect: (themeId: string) => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeSelect, isDarkMode, onToggleDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleSelect = (themeId: string) => {
        onThemeSelect(themeId);
        setIsOpen(false);
    };

    const modalContent = isOpen ? ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Appearance</h3>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        {isDarkMode ? <MoonIcon className="w-5 h-5 text-brand-primary mr-3" /> : <SunIcon className="w-5 h-5 text-brand-primary mr-3" />}
                        <span className="text-sm font-medium text-gray-900">Mode</span>
                    </div>
                    <button 
                        onClick={onToggleDarkMode}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none transition-colors duration-200 ease-in-out ${isDarkMode ? 'bg-brand-primary' : 'bg-gray-300'}`}
                    >
                        <span className="sr-only">Toggle Dark Mode</span>
                        <span 
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                <div className="mb-2 text-sm font-medium text-gray-600 uppercase tracking-wide">Select Theme</div>
                <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => handleSelect(theme.id)}
                            className={`flex items-center p-3 rounded-lg border transition-all ${
                                currentTheme === theme.id 
                                    ? 'border-brand-primary ring-2 ring-brand-primary ring-opacity-50 bg-gray-50' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div 
                                className="w-8 h-8 rounded-full shadow-sm mr-3 flex-shrink-0" 
                                style={{ backgroundColor: theme.hexPrimary }}
                            ></div>
                            <span className={`text-sm font-medium ${currentTheme === theme.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                {theme.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <button
                onClick={toggleOpen}
                className="fixed bottom-6 right-6 bg-white text-gray-700 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transform hover:scale-110 transition-all duration-200 z-40 border border-gray-200"
                aria-label="Change Theme"
                title="Change Theme"
            >
                <PaintBrushIcon className="w-6 h-6" />
            </button>
            {modalContent}
        </>
    );
};

export default ThemeSelector;
