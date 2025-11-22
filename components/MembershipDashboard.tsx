
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import MembersTable from './MembersTable';
import TierList from './TierList';
import AddMemberForm from './AddMemberForm';
import EditMemberForm from './EditMemberForm';
import EditTierForm from './EditTierForm';
import AddTierForm from './AddTierForm';
import { UsersIcon, ChartBarIcon, TicketIcon } from './icons';
import { 
    getMembers, 
    getTiers, 
    addMemberService, 
    updateMemberService, 
    deleteMemberService, 
    addTierService, 
    updateTierService 
} from '../services/membershipService';
import { Member, MembershipTier, MemberStatus } from '../types';

type View = 'members' | 'tiers' | 'add-member' | 'edit-member' | 'edit-tier' | 'add-tier';

interface MembershipDashboardProps {
    initialView?: string;
}

const MembershipDashboard: React.FC<MembershipDashboardProps> = ({ initialView }) => {
    const [view, setView] = useState<View>((initialView as View) || 'members');
    const [members, setMembers] = useState<Member[]>([]);
    const [tiers, setTiers] = useState<MembershipTier[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
    
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

    const handleAddMember = async (data: { firstName: string; lastName: string; email: string; tierId: string }) => {
        const newMember: Member = {
            id: `m${Date.now()}`,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            tierId: data.tierId,
            status: MemberStatus.Active,
            joinDate: new Date().toISOString().split('T')[0],
            renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        };
        await addMemberService(newMember);
        setMembers(prev => [newMember, ...prev]);
        setView('members');
    };

    const handleAddTier = async (data: Omit<MembershipTier, 'id' | 'memberCount' | 'benefits'>) => {
        const newTier: MembershipTier = {
            id: `t${Date.now()}`,
            ...data,
            memberCount: 0,
            benefits: [], // Initialize with empty benefits
        };
        await addTierService(newTier);
        setTiers(prev => [...prev, newTier]);
        setView('tiers');
    };

    const handleUpdateMember = async (updatedMember: Member) => {
        await updateMemberService(updatedMember);
        setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
        setView('members');
        setSelectedMember(null);
    };

    const handleDeleteMember = async (memberId: string) => {
        if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
            await deleteMemberService(memberId);
            setMembers(prev => prev.filter(m => m.id !== memberId));
        }
    };

    const handleUpdateTier = async (updatedTier: MembershipTier) => {
        await updateTierService(updatedTier);
        setTiers(prev => prev.map(t => t.id === updatedTier.id ? updatedTier : t));
        setView('tiers');
        setSelectedTier(null);
    };

    const openEditMember = (member: Member) => {
        setSelectedMember(member);
        setView('edit-member');
    };

    const openEditTier = (tier: MembershipTier) => {
        setSelectedTier(tier);
        setView('edit-tier');
    };

    const activeMembersCount = members.filter(m => m.status === MemberStatus.Active).length;
    const totalRevenue = tiers.reduce((acc, tier) => acc + (tier.annualPrice * tier.memberCount), 0).toLocaleString();

    const getTitle = () => {
        switch(view) {
            case 'add-member': return "Add New Member";
            case 'edit-member': return "View / Edit Member";
            case 'edit-tier': return "Edit Membership Tier";
            case 'add-tier': return "Add Membership Tier";
            default: return "Membership Management";
        }
    };

    const getButtonConfig = () => {
        if (view === 'members') {
            return { text: "+ Add Member", action: () => setView('add-member') };
        }
        if (view === 'tiers') {
            return { text: "+ Add Tier", action: () => setView('add-tier') };
        }
        return { text: undefined, action: undefined };
    };

    const buttonConfig = getButtonConfig();

    return (
        <div>
            <Header 
                title={getTitle()} 
                buttonText={buttonConfig.text} 
                onButtonClick={buttonConfig.action} 
            />

            {(view === 'members' || view === 'tiers') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Total Members" value={members.length.toString()} icon={UsersIcon} />
                    <StatCard title="Active Members" value={activeMembersCount.toString()} icon={ChartBarIcon} />
                    <StatCard title="Est. Annual Revenue" value={`$${totalRevenue}`} icon={TicketIcon} />
                </div>
            )}
            
            {view === 'add-member' ? (
                <AddMemberForm tiers={tiers} onSave={handleAddMember} onCancel={() => setView('members')} />
            ) : view === 'add-tier' ? (
                <AddTierForm onSave={handleAddTier} onCancel={() => setView('tiers')} />
            ) : view === 'edit-member' && selectedMember ? (
                <EditMemberForm 
                    member={selectedMember} 
                    tiers={tiers} 
                    onSave={handleUpdateMember} 
                    onCancel={() => { setView('members'); setSelectedMember(null); }} 
                />
            ) : view === 'edit-tier' && selectedTier ? (
                <EditTierForm 
                    tier={selectedTier} 
                    onSave={handleUpdateTier} 
                    onCancel={() => { setView('tiers'); setSelectedTier(null); }} 
                />
            ) : (
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
                            <MembersTable members={members} tiers={tiers} onEdit={openEditMember} onDelete={handleDeleteMember} />
                        ) : (
                            <TierList tiers={tiers} onEdit={openEditTier} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipDashboard;
