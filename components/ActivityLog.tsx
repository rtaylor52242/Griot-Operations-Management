
import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import { Activity } from '../types';
import { getActivities } from '../services/activityService';

type SortKey = 'timestamp' | 'type' | 'action' | 'detail' | 'user';
type SortDirection = 'asc' | 'desc';

const ActivityLog: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortKey, setSortKey] = useState<SortKey>('timestamp');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const data = await getActivities();
                setActivities(data);
            } catch (e) {
                console.error("Failed to load activities");
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredAndSortedActivities = useMemo(() => {
        let result = filter === 'all' 
            ? activities 
            : activities.filter(a => a.type === filter);

        return result.sort((a, b) => {
            let aValue: any = a[sortKey];
            let bValue: any = b[sortKey];

            if (sortKey === 'timestamp') {
                aValue = new Date(a.timestamp).getTime();
                bValue = new Date(b.timestamp).getTime();
            } else if (sortKey === 'user') {
                aValue = a.user.toLowerCase();
                bValue = b.user.toLowerCase();
            } else if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [activities, filter, sortKey, sortDirection]);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'membership': return 'bg-blue-100 text-blue-800';
            case 'ticketing': return 'bg-green-100 text-green-800';
            case 'fundraising': return 'bg-purple-100 text-purple-800';
            case 'system': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-50">↕</span>;
        return <span className="ml-1 text-brand-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const renderHeader = (label: string, column: SortKey) => (
        <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors select-none"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                {renderSortIcon(column)}
            </div>
        </th>
    );

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
                                {renderHeader('Timestamp', 'timestamp')}
                                {renderHeader('Type', 'type')}
                                {renderHeader('Action', 'action')}
                                {renderHeader('Detail', 'detail')}
                                {renderHeader('User (Role)', 'user')}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading activity...</td>
                                </tr>
                            ) : filteredAndSortedActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No activities found.</td>
                                </tr>
                            ) : (
                                filteredAndSortedActivities.map((activity, index) => (
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.user} <span className="text-xs text-gray-400">({activity.userRole})</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
