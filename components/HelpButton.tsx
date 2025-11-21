
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { QuestionMarkCircleIcon } from './icons';

interface HelpButtonProps {
    currentView?: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ currentView = 'dashboard' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [helpContent, setHelpContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reset content when view changes so we fetch fresh data if needed
    useEffect(() => {
        setHelpContent('');
    }, [currentView]);

    const getPromptContext = (view: string) => {
        switch (view) {
            case 'dashboard':
                return `The current view is the **Main Dashboard**.
                Explain:
                1. **Key Metrics**: Total Visitors, Revenue, Active Members.
                2. **Recent Activity**: The feed showing latest actions.
                3. **Quick Actions**: Buttons to jump to common tasks like selling tickets or adding members.`;
            case 'memberships':
                return `The current view is **Membership Management**.
                Explain:
                1. **Members List**: searching, filtering by status, and sorting columns.
                2. **Membership Tiers**: Viewing and editing tier details.
                3. **Actions**: Adding new members and editing existing member details.`;
            case 'fundraising':
                return `The current view is **Fundraising**.
                Explain:
                1. **Campaigns**: Viewing active fundraising campaigns and their progress bars.
                2. **Log Donation**: How to record a new donation transaction.
                3. **New Campaign**: Creating a new fundraising initiative.`;
            case 'ticketing':
                return `The current view is **Ticketing & Events**.
                Explain:
                1. **Events Overview**: Viewing current events, status, and ticket sales.
                2. **Sell Tickets**: The Point of Sale feature for selling tickets on site.
                3. **Manage Events**: Editing event details and capacity.`;
            case 'reports':
                 return `The current view is **Reports & Analytics**.
                Explain:
                1. **Report Categories**: Financial, Membership, and Attendance reports.
                2. **Visualizations**: Changing chart types (Bar, Line, Pie, Heatmap) and using the 3D mode toggle.
                3. **Export**: Downloading detailed data as CSV.`;
            case 'settings':
                return `The current view is **Settings**.
                Explain:
                1. **General**: Organization details and timezone.
                2. **Team & Permissions**: Managing user access roles.
                3. **Billing**: Updating payment methods.`;
            case 'activity':
                return `The current view is the **Activity Log**.
                Explain that this is a comprehensive audit trail of system actions, useful for tracking changes and security.`;
            default:
                return `The current view is the **Griot Operations App**.
                Explain the general navigation sidebar and the purpose of the app for managing museum operations.`;
        }
    };

    const fetchHelpContent = async () => {
        if (helpContent) return; 
        setIsLoading(true);
        const storageKey = `griotHelpContent_${currentView}`;
        
        try {
            const cachedContent = localStorage.getItem(storageKey);
            if (cachedContent) {
                setHelpContent(cachedContent);
                setIsLoading(false);
                return;
            }
            
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `
            Generate a user-friendly guide for our "Griot Operations Management" app.
            ${getPromptContext(currentView)}

            Keep the tone helpful and welcoming. Format the output as simple HTML using <h3> for titles, <p> for paragraphs, <ul> and <li> for lists. Do not include <html>, <head>, or <body> tags.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const content = response.text;
            setHelpContent(content);
            localStorage.setItem(storageKey, content);
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Help Guide</h2>
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
                        Close
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
