
import React from 'react';

interface HeaderProps {
    title: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, buttonText, onButtonClick }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {buttonText && onButtonClick && (
                <button 
                    onClick={onButtonClick}
                    className="px-4 py-2 text-white bg-brand-primary rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default Header;
