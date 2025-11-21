
import React, { useState, useMemo } from 'react';
import { Member, MembershipTier, MemberStatus } from '../types';
import { getTierById } from '../services/membershipService';
import { SearchIcon } from './icons';

interface MembersTableProps {
    members: Member[];
    tiers: MembershipTier[];
    onEdit: (member: Member) => void;
}

const statusColors: { [key in MemberStatus]: string } = {
    [MemberStatus.Active]: 'bg-green-100 text-green-800',
    [MemberStatus.Pending]: 'bg-yellow-100 text-yellow-800',
    [MemberStatus.Expired]: 'bg-gray-100 text-gray-800',
    [MemberStatus.Cancelled]: 'bg-red-100 text-red-800',
};

const MembersTable: React.FC<MembersTableProps> = ({ members, tiers, onEdit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const tierMap = useMemo(() => {
        const map = new Map<string, string>();
        tiers.forEach(tier => map.set(tier.id, tier.name));
        return map;
    }, [tiers]);

    const filteredMembers = useMemo(() => {
        return members.filter(member => 
            `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [members, searchTerm]);

    return (
        <div>
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search members by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-black focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tierMap.get(member.tierId) || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[member.status]}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(member.joinDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => onEdit(member)}
                                        className="text-brand-primary hover:text-brand-secondary focus:outline-none"
                                    >
                                        View / Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembersTable;
