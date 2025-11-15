import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { QuestionMarkCircleIcon } from './icons';

const HelpButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [helpContent, setHelpContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchHelpContent = async () => {
        if (helpContent) return; // Don't fetch if already loaded
        setIsLoading(true);
        try {
            const cachedContent = localStorage.getItem('griotHelpContent');
            if (cachedContent) {
                setHelpContent(cachedContent);
                setIsLoading(false);
                return;
            }
            
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `
            Generate a user-friendly guide for our "Griot Operations Management" app.
            The current view is the "Membership Management" module.
            Explain the following features clearly and concisely for a new user:

            1.  **Dashboard Overview**: Explain the main statistics shown: "Total Members", "Active Members", and "Est. Annual Revenue".
            2.  **Members Tab**: Describe the list of members. Explain that users can search for members by name or email using the search bar.
            3.  **Membership Tiers Tab**: Explain this view shows the different membership levels (like Individual, Household), their prices, and the benefits included with each.
            4.  **Adding a Member**: Mention the "+ Add Member" button and its function.

            Keep the tone helpful and welcoming. Format the output as simple HTML using <h3> for titles, <p> for paragraphs, <ul> and <li> for lists. Do not include <html>, <head>, or <body> tags.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const content = response.text;
            setHelpContent(content);
            localStorage.setItem('griotHelpContent', content);
        } catch (error) {
            console.error("Error fetching help content:", error);
            setHelpContent("<p>Could not load help content at this time. Please try again later.</p>");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = () => {
        setIsOpen(true);
        fetchHelpContent();
    };

    const closeModal = () => setIsOpen(false);

    const modalContent = isOpen ? ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            onClick={closeModal}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full m-4 transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use This App</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="prose max-w-none text-gray-600 h-80 overflow-y-auto pr-4">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
                         </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: helpContent }} />
                    )}
                </div>
                 <div className="mt-6 text-right">
                    <button 
                        onClick={closeModal}
                        className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <button
                onClick={openModal}
                className="fixed bottom-6 right-6 bg-brand-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transform hover:scale-110 transition-all duration-200"
                aria-label="Help"
            >
                <QuestionMarkCircleIcon className="w-8 h-8" />
            </button>
            {modalContent}
        </>
    );
};

export default HelpButton;