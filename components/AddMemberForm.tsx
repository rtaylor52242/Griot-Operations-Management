
import React, { useState } from 'react';
import { MembershipTier } from '../types';

interface AddMemberFormProps {
    tiers: MembershipTier[];
    onSave: (member: { firstName: string; lastName: string; email: string; tierId: string }) => void;
    onCancel: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ tiers, onSave, onCancel }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [tierId, setTierId] = useState(tiers.length > 0 ? tiers[0].id : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ firstName, lastName, email, tierId });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            First name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="first-name"
                                id="first-name"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                            Last name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="tier" className="block text-sm font-medium text-gray-700">
                            Membership Tier
                        </label>
                        <div className="mt-1">
                            <select
                                id="tier"
                                name="tier"
                                value={tierId}
                                onChange={(e) => setTierId(e.target.value)}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                            >
                                {tiers.map((tier) => (
                                    <option key={tier.id} value={tier.id}>
                                        {tier.name} - ${tier.annualPrice}/year
                                    </option>
                                ))}
                            </select>
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
                        Save Member
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMemberForm;
