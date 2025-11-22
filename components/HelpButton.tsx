
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
                return `The user is currently on the **Main Dashboard** of the Griot Operations Management app.
                Please provide a comprehensive guide on how to use this screen.
                Cover the following points in detail:
                1. **Overview**: Explain that the Dashboard is the central command center providing a snapshot of the organization's performance.
                2. **Key Metrics**: Describe the top cards (Total Visitors, Revenue YTD, Active Members, Growth Rate) and what they represent.
                3. **Recent Activity**: Explain the feed showing real-time system events (sales, signups, alerts) and how to click "View all activity" for the full log.
                4. **Quick Actions**: Provide step-by-step instructions for the quick buttons:
                   - **Add Member**: Navigates directly to the new member registration form.
                   - **Sell Tickets**: Opens the Point of Sale interface for immediate transactions.
                   - **Log Donation**: Shortcuts to the donation entry form.
                   - **Run Report**: Jumps to the reports section.`;
            case 'memberships':
                return `The user is on the **Membership Management** screen.
                Provide full usage instructions.
                Cover:
                1. **Navigation**: Explain the tabs for switching between 'Members' list and 'Membership Tiers'.
                2. **Managing Members**:
                   - **Search & Filter**: How to use the search bar (name/email) and the Status dropdown (Active, Pending, etc.) to find specific members.
                   - **Sorting**: How to click column headers (Name, Join Date, etc.) to sort the list.
                   - **Edit/View**: Explain clicking the "View / Edit" button to modify member details, renewal dates, or status.
                3. **Adding Members**: Step-by-step guide on using the "+ Add Member" button to register a new constituent.
                4. **Membership Tiers**: How to view tier pricing/benefits and use the "Edit Tier" button to adjust annual/monthly prices and descriptions.`;
            case 'fundraising':
                return `The user is on the **Fundraising** screen.
                Provide a detailed guide.
                Cover:
                1. **Campaign Overview**: How to read the campaign cards (Goal vs Raised progress bars, donor counts, status).
                2. **New Campaign**: Instructions for using the "+ New Campaign" button to launch a new initiative (setting name, goal, description).
                3. **Logging Donations**: Detailed steps for using the "Log Donation" button:
                   - Selecting the donor and campaign.
                   - Entering amount and payment method.
                   - Adding notes.
                4. **Managing Campaigns**: How to click "Manage" on a specific campaign to update its status (e.g., close a campaign) or edit details.`;
            case 'ticketing':
                return `The user is on the **Ticketing & Events** screen.
                Provide full instructions.
                Cover:
                1. **Event Dashboard**: explain the metric cards (Daily Sold, Revenue) and the list of upcoming events.
                2. **Event Status**: How to interpret status indicators (Open, Selling Fast, Sold Out).
                3. **Selling Tickets (POS)**: Step-by-step guide for the "Sell Tickets" feature:
                   - Adding tickets (Adult, Child, Senior) to the cart.
                   - Adjusting quantities.
                   - Reviewing the total and completing the checkout.
                4. **Managing Events**: How to click "Manage Event" to change event titles, dates, capacity, or manually update sold counts.`;
            case 'reports':
                 return `The user is on the **Reports & Analytics** screen.
                Provide comprehensive instructions.
                Cover:
                1. **Browsing Reports**: Explain the categories (Financial, Membership, Attendance) and how to select a specific report.
                2. **Report View Features**:
                   - **Visualizations**: How to switch chart types (Bar, Line, Area, Bubble, Heatmap, Pie) using the selector.
                   - **3D Mode**: Using the toggle to switch between flat and 3D chart styles.
                   - **Data Metrics**: Changing which data column is visualized using the dropdown.
                   - **Labels**: Toggling value labels on/off.
                3. **Exporting**: How to use the "Export CSV" button to download the detailed data table.
                4. **Custom Requests**: Instructions for using the "Request Custom Report" button to contact the data team.`;
            case 'settings':
                return `The user is on the **Settings** screen.
                Provide a full guide for administration.
                Cover:
                1. **General Settings**: Updating organization name, contact email, and timezone.
                2. **Team & Permissions**:
                   - Viewing the list of authorized users.
                   - Clicking "Edit Permissions" to toggle access to specific modules (Dashboard, Ticketing, etc.) for each user.
                3. **Billing**: Viewing current plan and editing the Payment Method (Card number, expiry, name on card).
                4. **Email Notifications**: Toggling preferences for system alerts and digests.
                5. **Security**: Updating passwords.`;
            case 'activity':
                return `The user is on the **Activity Log** screen.
                Explain its purpose as a security and audit trail.
                Cover:
                1. **The Feed**: How to read the chronological list of actions (who did what and when).
                2. **Filtering**: Instructions on using the filter chips (All, Membership, Ticketing, Fundraising, System) to narrow down specific types of events.
                3. **Use Cases**: Mention using this to verify recent sales, track user actions, or troubleshoot issues.`;
            case 'documents':
                return `The user is on the **Documents & Media** screen.
                Provide instructions for file management.
                Cover:
                1. **Library**: Viewing the list of uploaded files (PDFs, Images, etc.) with metadata (Size, Date).
                2. **Uploading**: How to use the "Upload File" button to add new assets to the system.
                3. **Actions**:
                   - **View**: Clicking the Eye icon to preview or download a file.
                   - **Delete**: Clicking the Trash icon to permanently remove a file.`;
            case 'chat':
                return `The user is using the **Ask a Griot** AI assistant.
                Explain how to use this feature.
                Cover:
                1. **Chat Interface**: Typing questions into the input field and sending them.
                2. **Capabilities**: Explain that the Griot bot can answer questions about operations, best practices, or help navigate the app.
                3. **History**: How the chat keeps a history of the current conversation.`;
            default:
                return `The user is looking for a general **App Overview**.
                Provide a high-level guide to the Griot Operations Management system.
                Cover:
                1. **Purpose**: A comprehensive tool for museums and cultural institutions.
                2. **Navigation**: Explain the Sidebar menu (Dashboard, Memberships, Fundraising, Ticketing, Reports, Documents).
                3. **Getting Started**: Suggest starting at the Dashboard for a summary or Memberships to manage constituents.
                4. **Support**: Mention using this Help button on any specific screen for context-aware instructions.`;
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

            // Dynamic import to handle CDN issues gracefully
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const prompt = `
            You are an expert user guide and technical writer for the "Griot Operations Management" application.
            
            CONTEXT:
            ${getPromptContext(currentView)}

            INSTRUCTIONS:
            Generate a detailed, user-friendly guide formatted in HTML.
            - Use <h3> for main section headers.
            - Use <p> for descriptive text.
            - Use <ul> or <ol> for lists and steps.
            - Use <strong> for UI element names (buttons, labels, tabs).
            - Keep the tone professional, helpful, and instructional.
            - Do NOT include <html>, <head>, or <body> tags.
            - Do NOT include markdown backticks.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const content = response.text;
            const finalContent = content || "<p>No help content generated.</p>";
            
            setHelpContent(finalContent);
            localStorage.setItem(storageKey, finalContent);
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
                className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-2xl w-full m-4 transform transition-all flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">Help Guide</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="prose max-w-none text-gray-600 overflow-y-auto pr-4 flex-grow">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
                         </div>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: helpContent }} />
                    )}
                </div>
                 <div className="mt-6 text-right flex-shrink-0">
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
                className="fixed bottom-6 right-6 bg-brand-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transform hover:scale-110 transition-all duration-200 z-40"
                aria-label="Help"
            >
                <QuestionMarkCircleIcon className="w-8 h-8" />
            </button>
            {modalContent}
        </>
    );
};

export default HelpButton;
