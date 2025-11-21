
import React, { useState } from 'react';
import Header from './Header';

interface Activity {
    id: number;
    action: string;
    detail: string;
    user: string;
    timestamp: string;
    type: 'membership' | 'ticketing' | 'fundraising' | 'system';
}

const ActivityLog: React.FC = () => {
    const [filter, setFilter] = useState('all');

    // Mock Data
    const allActivities: Activity[] = [
        { id: 1, action: 'New Membership', detail: 'Alice Johnson joined as Household', user: 'System', timestamp: '2024-10-24 10:05 AM', type: 'membership' },
        { id: 2, action: 'Ticket Sale', detail: '5 tickets sold for "Ancient Civilizations"', user: 'Sarah (Box Office)', timestamp: '2024-10-24 09:45 AM', type: 'ticketing' },
        { id: 3, action: 'Donation Received', detail: '$500 from Robert Smith', user: 'System', timestamp: '2024-10-24 09:00 AM', type: 'fundraising' },
        { id: 4, action: 'System Alert', detail: 'Daily backup completed successfully', user: 'System', timestamp: '2024-10-24 06:00 AM', type: 'system' },
        { id: 5, action: 'New Membership', detail: 'Eva Green joined as Individual', user: 'Web Portal', timestamp: '2024-10-23 11:30 PM', type: 'membership' },
        { id: 6, action: 'Ticket Sale', detail: '2 tickets sold for "Modern Art"', user: 'Kiosk 1', timestamp: '2024-10-23 04:15 PM', type: 'ticketing' },
        { id: 7, action: 'Login', detail: 'Admin user logged in', user: 'Admin', timestamp: '2024-10-23 09:00 AM', type: 'system' },
        { id: 8, action: 'Campaign Created', detail: 'Created "Winter Gala"', user: 'Director', timestamp: '2024-10-22 02:00 PM', type: 'fundraising' },
        { id: 9, action: 'Settings Updated', detail: 'Changed notification preferences', user: 'Admin', timestamp: '2024-10-22 10:00 AM', type: 'system' },
        { id: 10, action: 'Membership Expired', detail: 'John Doe membership expired', user: 'System', timestamp: '2024-10-21 12:00 AM', type: 'membership' },
        { id: 11, action: 'Ticket Sale', detail: '10 Group tickets sold', user: 'Sarah (Box Office)', timestamp: '2024-10-21 11:00 AM', type: 'ticketing' },
        { id: 12, action: 'Donation Received', detail: '$1000 from Anon', user: 'System', timestamp: '2024-10-20 05:00 PM', type: 'fundraising' },
    ];

    const filteredActivities = filter === 'all' 
        ? allActivities 
        : allActivities.filter(a => a.type === filter);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'membership': return 'bg-blue-100 text-blue-800';
            case 'ticketing': return 'bg-green-100 text-green-800';
            case 'fundraising': return 'bg-purple-100 text-purple-800';
            case 'system': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <Header title="Activity Log" />
            
            <div className="mb-6 flex space-x-2">
                {['all', 'membership', 'ticketing', 'fundraising', 'system'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                            filter === f 
                            ? 'bg-brand-primary text-white' 
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredActivities.map((activity, index) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.timestamp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(activity.type)} capitalize`}>
                                            {activity.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{activity.detail}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredActivities.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No activities found for this filter.</div>
                )}
            </div>
        </div>
    );
};

export default ActivityLog;
