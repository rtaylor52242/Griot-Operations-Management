
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import MembersTable from './MembersTable';
import TierList from './TierList';
import { UsersIcon, ChartBarIcon, TicketIcon } from './icons';
import { getMembers, getTiers } from '../services/membershipService';
import { Member, MembershipTier, MemberStatus } from '../types';

type View = 'members' | 'tiers';

const MembershipDashboard: React.FC = () => {
    const [view, setView] = useState<View>('members');
    const [members, setMembers] = useState<Member[]>([]);
    const [tiers, setTiers] = useState<MembershipTier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [membersData, tiersData] = await Promise.all([getMembers(), getTiers()]);
                setMembers(membersData);
                setTiers(tiersData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeMembersCount = members.filter(m => m.status === MemberStatus.Active).length;
    const totalRevenue = tiers.reduce((acc, tier) => acc + (tier.annualPrice * tier.memberCount), 0).toLocaleString();

    return (
        <div>
            <Header title="Membership Management" buttonText="+ Add Member" onButtonClick={() => alert('Add new member')} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Members" value={members.length.toString()} icon={UsersIcon} />
                <StatCard title="Active Members" value={activeMembersCount.toString()} icon={ChartBarIcon} />
                <StatCard title="Est. Annual Revenue" value={`$${totalRevenue}`} icon={TicketIcon} />
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setView('members')}
                            className={`${view === 'members' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Members
                        </button>
                        <button
                            onClick={() => setView('tiers')}
                            className={`${view === 'tiers' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Membership Tiers
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">Loading data...</p>
                        </div>
                    ) : view === 'members' ? (
                        <MembersTable members={members} tiers={tiers} />
                    ) : (
                        <TierList tiers={tiers} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembershipDashboard;
