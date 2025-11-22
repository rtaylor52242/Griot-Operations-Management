
import React, { useState, useEffect } from 'react';
import { Member, MembershipTier, MemberStatus, MemberRole } from '../types';

interface EditMemberFormProps {
    member: Member;
    tiers: MembershipTier[];
    onSave: (updatedMember: Member) => void;
    onCancel: () => void;
}

const EditMemberForm: React.FC<EditMemberFormProps> = ({ member, tiers, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Member>(member);

    useEffect(() => {
        setFormData(member);
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Member</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="tierId" className="block text-sm font-medium text-gray-700">
                            Membership Tier
                        </label>
                        <div className="mt-1">
                            <select
                                id="tierId"
                                name="tierId"
                                value={formData.tierId}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            >
                                {tiers.map((tier) => (
                                    <option key={tier.id} value={tier.id}>
                                        {tier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            User Role
                        </label>
                        <div className="mt-1">
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            >
                                {Object.values(MemberRole).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <div className="mt-1">
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            >
                                {Object.values(MemberStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                         <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                            Join Date
                        </label>
                         <div className="mt-1">
                            <input
                                type="date"
                                name="joinDate"
                                id="joinDate"
                                value={formData.joinDate}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                     <div className="sm:col-span-3">
                         <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-700">
                            Renewal Date
                        </label>
                         <div className="mt-1">
                            <input
                                type="date"
                                name="renewalDate"
                                id="renewalDate"
                                value={formData.renewalDate}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditMemberForm;
