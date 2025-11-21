
import React from 'react';
import Header from './Header';
import { DocumentTextIcon, ChartBarIcon, UsersIcon, CurrencyDollarIcon } from './icons';

const Reports: React.FC = () => {
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
                                    <li key={rIndex} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center">
                                            <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary mr-3" />
                                            <span className="text-gray-600 group-hover:text-gray-900">{report}</span>
                                        </div>
                                        <button className="text-xs font-medium text-brand-primary hover:text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                            Generate
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                             <a href="#" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">View all {category.title} &rarr;</a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-indigo-900 rounded-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Need a custom report?</h3>
                    <p className="text-indigo-200">Our data team can build specialized exports for your specific needs.</p>
                </div>
                <button className="px-6 py-3 bg-white text-brand-primary font-bold rounded-lg shadow hover:bg-gray-100 transition-colors">
                    Request Custom Report
                </button>
            </div>
        </div>
    );
};

export default Reports;
