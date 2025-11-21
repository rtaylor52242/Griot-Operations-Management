
import React from 'react';
import Header from './Header';
import StatCard from './StatCard';
import { UsersIcon, CurrencyDollarIcon, TicketIcon, TrendingUpIcon } from './icons';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Header title="Dashboard" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Visitors (Today)" value="1,248" icon={TicketIcon} />
                <StatCard title="Revenue (YTD)" value="$1,450,200" icon={CurrencyDollarIcon} />
                <StatCard title="Active Members" value="5,683" icon={UsersIcon} />
                <StatCard title="Growth Rate" value="+12.5%" icon={TrendingUpIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                    <ul className="divide-y divide-gray-200">
                        {[
                            { action: 'New Membership', detail: 'Alice Johnson joined as Household', time: '10 mins ago' },
                            { action: 'Ticket Sale', detail: '5 tickets sold for "Ancient Civilizations"', time: '25 mins ago' },
                            { action: 'Donation Received', detail: '$500 from Robert Smith', time: '1 hour ago' },
                            { action: 'System Alert', detail: 'Daily backup completed successfully', time: '4 hours ago' },
                            { action: 'New Membership', detail: 'Eva Green joined as Individual', time: '5 hours ago' },
                        ].map((item, index) => (
                            <li key={index} className="py-4">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.action}</p>
                                        <p className="text-sm text-gray-500">{item.detail}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-right">
                        <a href="#" className="text-brand-primary text-sm font-medium hover:text-brand-secondary">View all activity &rarr;</a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Add Member</span>
                            <span className="text-sm text-gray-500">Register a new signup</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Sell Tickets</span>
                            <span className="text-sm text-gray-500">Process admission</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Log Donation</span>
                            <span className="text-sm text-gray-500">Record a new gift</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group">
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Run Report</span>
                            <span className="text-sm text-gray-500">Daily summary</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
