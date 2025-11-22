
import React, { useEffect, useState } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import { UsersIcon, CurrencyDollarIcon, TicketIcon, TrendingUpIcon } from './icons';
import { getMembers, getTiers } from '../services/membershipService';
import { getCampaigns } from '../services/fundraisingService';
import { getEvents } from '../services/ticketingService';
import { Member, MemberStatus } from '../types';

interface DashboardProps {
    onNavigate?: (view: string, action?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [stats, setStats] = useState({
        visitors: 0,
        revenue: 0,
        activeMembers: 0,
        growthRate: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [members, tiers, campaigns, events] = await Promise.all([
                    getMembers(),
                    getTiers(),
                    getCampaigns(),
                    getEvents()
                ]);

                // Calculate Active Members
                const activeMembers = members.filter(m => m.status === MemberStatus.Active).length;

                // Calculate Total Visitors (Proxy: Sum of tickets sold for daily/today events)
                // For demo: Sum of all sold tickets in event list
                const totalVisitors = events.reduce((sum, e) => sum + e.sold, 0);

                // Calculate Revenue YTD
                // 1. Fundraising
                const fundraisingRevenue = campaigns.reduce((sum, c) => sum + c.raised, 0);
                
                // 2. Membership (Approximate based on tier price)
                // Simple logic: member.tier price. In real app, we'd check payment history.
                let membershipRevenue = 0;
                members.forEach(m => {
                    if (m.status === MemberStatus.Active) {
                        const tier = tiers.find(t => t.id === m.tierId);
                        if (tier) membershipRevenue += tier.annualPrice;
                    }
                });

                // 3. Ticketing
                const ticketingRevenue = events.reduce((sum, e) => sum + (e.sold * e.price), 0);

                const totalRevenue = fundraisingRevenue + membershipRevenue + ticketingRevenue;

                // Calculate Growth Rate (Year to Date or simple Month over Month proxy)
                // Logic: Members joined in current year / Total members at start of year
                const currentYear = new Date().getFullYear();
                const newMembersThisYear = members.filter(m => new Date(m.joinDate).getFullYear() === currentYear).length;
                const previousMembers = members.length - newMembersThisYear;
                const growthRate = previousMembers > 0 
                    ? (newMembersThisYear / previousMembers) * 100 
                    : (members.length > 0 ? 100 : 0);

                setStats({
                    visitors: totalVisitors,
                    revenue: totalRevenue,
                    activeMembers: activeMembers,
                    growthRate: growthRate
                });

            } catch (error) {
                console.error("Error loading dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Header title="Dashboard" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Visitors (YTD)" 
                    value={loading ? "..." : stats.visitors.toLocaleString()} 
                    icon={TicketIcon} 
                />
                <StatCard 
                    title="Revenue (YTD)" 
                    value={loading ? "..." : `$${stats.revenue.toLocaleString()}`} 
                    icon={CurrencyDollarIcon} 
                />
                <StatCard 
                    title="Active Members" 
                    value={loading ? "..." : stats.activeMembers.toLocaleString()} 
                    icon={UsersIcon} 
                />
                <StatCard 
                    title="Member Growth (YTD)" 
                    value={loading ? "..." : `+${stats.growthRate.toFixed(1)}%`} 
                    icon={TrendingUpIcon} 
                />
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
                        <a 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); onNavigate?.('activity'); }}
                            className="text-brand-primary text-sm font-medium hover:text-brand-secondary"
                        >
                            View all activity &rarr;
                        </a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => onNavigate?.('memberships', 'add-member')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                        >
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Add Member</span>
                            <span className="text-sm text-gray-500">Register a new signup</span>
                        </button>
                        <button 
                            onClick={() => onNavigate?.('ticketing', 'sell')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                        >
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Sell Tickets</span>
                            <span className="text-sm text-gray-500">Process admission</span>
                        </button>
                        <button 
                            onClick={() => onNavigate?.('fundraising', 'log-donation')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                        >
                            <span className="block text-lg font-semibold text-gray-800 group-hover:text-brand-primary">Log Donation</span>
                            <span className="text-sm text-gray-500">Record a new gift</span>
                        </button>
                        <button 
                            onClick={() => onNavigate?.('reports')}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                        >
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
