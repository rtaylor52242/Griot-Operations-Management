import React, { useState, useMemo, useEffect } from 'react';
import { Member, MembershipTier, MemberStatus, MemberRole } from '../types';
import { SearchIcon } from './icons';

interface MembersTableProps {
    members: Member[];
    tiers: MembershipTier[];
    onEdit: (member: Member) => void;
    onDelete: (memberId: string) => void;
}

const statusColors: { [key in MemberStatus]: string } = {
    [MemberStatus.Active]: 'bg-green-100 text-green-800',
    [MemberStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [MemberStatus.Expired]: 'bg-gray-100 text-gray-800',
    [MemberStatus.Cancelled]: 'bg-red-100 text-red-800',
};

const roleColors: { [key in MemberRole]: string } = {
    [MemberRole.Admin]: 'text-purple-700 bg-purple-50 ring-purple-600/20',
    [MemberRole.Member]: 'text-blue-700 bg-blue-50 ring-blue-600/20',
    [MemberRole.Guest]: 'text-gray-600 bg-gray-50 ring-gray-500/10',
};

type SortKey = 'name' | 'email' | 'tier' | 'status' | 'joinDate' | 'role';
type SortDirection = 'asc' | 'desc';

interface TablePreferences {
    searchTerm: string;
    statusFilter: string;
    tierFilter: string;
    roleFilter: string;
    startDate: string;
    endDate: string;
    sortKey: SortKey;
    sortDirection: SortDirection;
}

const STORAGE_KEY = 'griot_members_table_prefs';

const MembersTable: React.FC<MembersTableProps> = ({ members, tiers, onEdit, onDelete }) => {
    // Initialize state from localStorage or defaults
    const [preferences, setPreferences] = useState<TablePreferences>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse saved preferences", e);
            }
        }
        return {
            searchTerm: '',
            statusFilter: 'All',
            tierFilter: 'All',
            roleFilter: 'All',
            startDate: '',
            endDate: '',
            sortKey: 'joinDate',
            sortDirection: 'desc'
        };
    });

    // Update localStorage when preferences change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }, [preferences]);

    const handleSort = (key: SortKey) => {
        setPreferences(prev => ({
            ...prev,
            sortKey: key,
            sortDirection: prev.sortKey === key && prev.sortDirection === 'asc' ? 'desc' : 'asc'
        }));
    };

    const tierMap = useMemo(() => {
        const map = new Map<string, string>();
        tiers.forEach(tier => map.set(tier.id, tier.name));
        return map;
    }, [tiers]);

    const filteredAndSortedMembers = useMemo(() => {
        let result = members.filter(member => {
            const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(preferences.searchTerm.toLowerCase()) ||
                                  member.email.toLowerCase().includes(preferences.searchTerm.toLowerCase());
            
            const matchesStatus = preferences.statusFilter === 'All' || member.status === preferences.statusFilter;
            
            const matchesTier = preferences.tierFilter === 'All' || member.tierId === preferences.tierFilter;
            
            const matchesRole = preferences.roleFilter === 'All' || member.role === preferences.roleFilter;

            let matchesDate = true;
            if (preferences.startDate) {
                matchesDate = matchesDate && new Date(member.joinDate) >= new Date(preferences.startDate);
            }
            if (preferences.endDate) {
                matchesDate = matchesDate && new Date(member.joinDate) <= new Date(preferences.endDate);
            }

            return matchesSearch && matchesStatus && matchesTier && matchesRole && matchesDate;
        });

        return result.sort((a, b) => {
            let aValue: any = '';
            let bValue: any = '';

            switch (preferences.sortKey) {
                case 'name':
                    aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
                    bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
                    break;
                case 'email':
                    aValue = a.email.toLowerCase();
                    bValue = b.email.toLowerCase();
                    break;
                case 'tier':
                    aValue = tierMap.get(a.tierId) || '';
                    bValue = tierMap.get(b.tierId) || '';
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'role':
                    aValue = a.role;
                    bValue = b.role;
                    break;
                case 'joinDate':
                    aValue = new Date(a.joinDate).getTime();
                    bValue = new Date(b.joinDate).getTime();
                    break;
            }

            if (aValue < bValue) return preferences.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return preferences.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [members, preferences, tierMap]);

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (preferences.sortKey !== column) return <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-50">↕</span>;
        return <span className="ml-1 text-brand-primary">{preferences.sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const renderHeader = (label: string, column: SortKey) => (
        <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100 transition-colors select-none"
            onClick={() => handleSort(column)}
        >
            <div className="flex items-center">
                {label}
                <SortIcon column={column} />
            </div>
        </th>
    );

    return (
        <div>
            <div className="mb-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search members by name or email..."
                            value={preferences.searchTerm}
                            onChange={(e) => setPreferences(prev => ({ ...prev, searchTerm: e.target.value }))}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        />
                    </div>
                </div>
                
                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={preferences.statusFilter}
                            onChange={(e) => setPreferences(prev => ({ ...prev, statusFilter: e.target.value }))}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        >
                            <option value="All">All Statuses</option>
                            {Object.values(MemberStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Membership Tier</label>
                        <select
                            value={preferences.tierFilter}
                            onChange={(e) => setPreferences(prev => ({ ...prev, tierFilter: e.target.value }))}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        >
                            <option value="All">All Tiers</option>
                            {tiers.map(tier => (
                                <option key={tier.id} value={tier.id}>{tier.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={preferences.roleFilter}
                            onChange={(e) => setPreferences(prev => ({ ...prev, roleFilter: e.target.value }))}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        >
                            <option value="All">All Roles</option>
                            {Object.values(MemberRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Joined After</label>
                        <input
                            type="date"
                            value={preferences.startDate}
                            onChange={(e) => setPreferences(prev => ({ ...prev, startDate: e.target.value }))}
                            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Joined Before</label>
                        <input
                            type="date"
                            value={preferences.endDate}
                            onChange={(e) => setPreferences(prev => ({ ...prev, endDate: e.target.value }))}
                            className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border rounded-lg border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {renderHeader('Name', 'name')}
                            {renderHeader('Email', 'email')}
                            {renderHeader('Tier', 'tier')}
                            {renderHeader('Status', 'status')}
                            {renderHeader('Role', 'role')}
                            {renderHeader('Join Date', 'joinDate')}
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tierMap.get(member.tierId) || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[member.status]}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${roleColors[member.role]}`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(member.joinDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => onEdit(member)}
                                        className="text-brand-primary hover:text-brand-secondary focus:outline-none font-semibold mr-4"
                                    >
                                        View / Edit
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onDelete(member.id);
                                        }}
                                        className="text-red-600 hover:text-red-900 focus:outline-none font-semibold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAndSortedMembers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No members found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembersTable;