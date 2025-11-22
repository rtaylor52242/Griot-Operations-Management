
import React from 'react';
import Header from './Header';
import { HomeIcon, UsersIcon, FundraisingIcon, TicketIcon, ChartBarIcon, DocumentIcon, CogIcon } from './icons';

const Help: React.FC = () => {
    const sections = [
        {
            id: 'overview',
            title: 'Getting Started',
            icon: HomeIcon,
            content: (
                <div className="space-y-4">
                    <p>
                        Welcome to the <strong>Griot Operations Management</strong> system. This application is designed to streamline daily operations for museums, zoos, and cultural institutions.
                    </p>
                    <p>
                        Use the sidebar on the left to navigate between different modules. The Dashboard serves as your central command center, providing a snapshot of your organization's health and quick access to common tasks.
                    </p>
                </div>
            )
        },
        {
            id: 'memberships',
            title: 'Membership Management',
            icon: UsersIcon,
            content: (
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-800">Managing Members</h4>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-gray-700">
                        <li><strong>Searching:</strong> Use the search bar to find members by name or email.</li>
                        <li><strong>Filtering:</strong> Use the dropdown to view members by status (Active, Expired, etc.).</li>
                        <li><strong>Adding Members:</strong> Click the "+ Add Member" button to register new constituents.</li>
                        <li><strong>Editing:</strong> Click "View / Edit" on any member row to update their details or renew their membership.</li>
                    </ul>
                    <h4 className="font-bold text-gray-800 mt-4">Membership Tiers</h4>
                    <p>
                        Navigate to the "Membership Tiers" tab to manage your offerings. You can add new tiers or edit pricing and benefits for existing ones.
                    </p>
                </div>
            )
        },
        {
            id: 'fundraising',
            title: 'Fundraising',
            icon: FundraisingIcon,
            content: (
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-800">Campaigns</h4>
                    <p>
                        Track your fundraising initiatives with visual progress bars. Use the "+ New Campaign" button to launch a new fund.
                    </p>
                    <h4 className="font-bold text-gray-800 mt-4">Donations</h4>
                    <p>
                        Use the "Log Donation" button to record gifts. You can associate donations with specific campaigns and donors, helping you track success against goals.
                    </p>
                     <h4 className="font-bold text-gray-800 mt-4">Management</h4>
                     <p>
                         You can hide campaigns from the main view using the "Hide" button, or view hidden campaigns by toggling the eye icon. Use "Manage" to update campaign details.
                     </p>
                </div>
            )
        },
        {
            id: 'ticketing',
            title: 'Ticketing & Events',
            icon: TicketIcon,
            content: (
                <div className="space-y-4">
                    <h4 className="font-bold text-gray-800">Point of Sale (POS)</h4>
                    <p>
                        The "Sell Tickets" screen provides a fast interface for processing admissions. Add tickets to the cart, adjust quantities, and check out to record revenue instantly.
                    </p>
                    <h4 className="font-bold text-gray-800 mt-4">Event Management</h4>
                    <p>
                        Create and manage events with specific capacities and dates. Monitor ticket sales in real-time to prevent overbooking.
                    </p>
                </div>
            )
        },
        {
            id: 'reports',
            title: 'Reports & Analytics',
            icon: ChartBarIcon,
            content: (
                <div className="space-y-4">
                    <p>
                        Access detailed insights across three categories: Financial, Membership, and Attendance.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-gray-700">
                        <li><strong>Visualizations:</strong> Switch between Bar, Line, Area, Bubble, Heatmap, and Pie charts.</li>
                        <li><strong>Data Export:</strong> Use the "Export CSV" button to download raw data for external analysis.</li>
                        <li><strong>Customization:</strong> Toggle "3D Mode" for presentations or change the data metric being visualized.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'documents',
            title: 'Documents & Media',
            icon: DocumentIcon,
            content: (
                <div className="space-y-4">
                    <p>
                        A centralized repository for your organization's files.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-gray-700">
                        <li><strong>Upload:</strong> Add PDFs, images, and presentations.</li>
                        <li><strong>Search:</strong> Quickly find files by name or type.</li>
                        <li><strong>Sort:</strong> Click headers to sort by date, size, or name.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: CogIcon,
            content: (
                <div className="space-y-4">
                    <p>
                        Administrators can configure the application here.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-gray-700">
                        <li><strong>General:</strong> Update organization details and timezone.</li>
                        <li><strong>Team:</strong> Manage user accounts and permissions.</li>
                        <li><strong>Billing:</strong> Update payment methods and view plan details.</li>
                        <li><strong>Appearance:</strong> Toggle Dark Mode or change the Brand Theme color using the brush icon in the bottom right.</li>
                    </ul>
                </div>
            )
        }
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <Header title="Help & Documentation" />
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navigation Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                        <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">Contents</h3>
                        <nav className="space-y-1">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-brand-primary transition-colors group"
                                >
                                    <section.icon className="w-4 h-4 mr-3 text-gray-400 group-hover:text-brand-primary" />
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-8 pb-12">
                    {sections.map(section => (
                        <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-md overflow-hidden scroll-mt-6">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center">
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-4 text-brand-primary">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                            </div>
                            <div className="p-6 text-gray-600 leading-relaxed">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Help;
