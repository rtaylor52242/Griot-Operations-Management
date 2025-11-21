
import React, { useState } from 'react';
import Header from './Header';
import ReportView from './ReportView';
import { DocumentTextIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon } from './icons';

const Reports: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [emailForm, setEmailForm] = useState({ email: '', description: '' });

    const reportCategories = [
        {
            title: 'Financial Reports',
            icon: CurrencyDollarIcon,
            reports: ['Daily Sales Summary', 'Revenue by Category', 'Monthly Financial Statement', 'Donation Analysis']
        },
        {
            title: 'Membership Reports',
            icon: UsersIcon,
            reports: ['New Member Signups', 'Renewal Rates', 'Member Attendance', 'Churn Analysis']
        },
        {
            title: 'Attendance & Ticketing',
            icon: ChartBarIcon,
            reports: ['Daily Visitor Count', 'Event Capacity Utilization', 'Ticket Type Breakdown', 'Peak Hours']
        }
    ];

    const handleCustomReportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Request sent!\nWe will contact you at ${emailForm.email} regarding your request for: ${emailForm.description}`);
        setIsModalOpen(false);
        setEmailForm({ email: '', description: '' });
    };

    if (selectedReport) {
        return <ReportView title={selectedReport} onBack={() => setSelectedReport(null)} />;
    }

    return (
        <div>
            <Header title="Reports & Analytics" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {reportCategories.map((category, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
                            <category.icon className="w-6 h-6 text-brand-primary mr-3" />
                            <h2 className="text-lg font-bold text-gray-800">{category.title}</h2>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                {category.reports.map((report, rIndex) => (
                                    <li 
                                        key={rIndex} 
                                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded -mx-2 transition-colors"
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <div className="flex items-center">
                                            <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary mr-3" />
                                            <span className="text-gray-600 group-hover:text-gray-900">{report}</span>
                                        </div>
                                        <button className="text-xs font-medium text-brand-primary hover:text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                            View
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                             <span className="text-sm text-gray-500">{category.reports.length} reports available</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-indigo-900 rounded-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Need a custom report?</h3>
                    <p className="text-indigo-200">Our data team can build specialized exports for your specific needs.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-white text-brand-primary font-bold rounded-lg shadow hover:bg-gray-100 transition-colors"
                >
                    Request Custom Report
                </button>
            </div>

            {/* Custom Report Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Custom Report</h2>
                        <p className="text-gray-600 mb-6 text-sm">Please describe the data you need. We will email the report to you within 24-48 hours.</p>
                        <form onSubmit={handleCustomReportSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    required 
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    value={emailForm.email}
                                    onChange={e => setEmailForm({...emailForm, email: e.target.value})}
                                    placeholder="you@organization.org"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Report Description</label>
                                <textarea 
                                    id="description"
                                    required 
                                    rows={4}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    value={emailForm.description}
                                    onChange={e => setEmailForm({...emailForm, description: e.target.value})}
                                    placeholder="e.g., I need a list of all members who joined in 2023 sorted by donation amount..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary font-medium"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
