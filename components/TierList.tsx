
import React from 'react';
import { MembershipTier } from '../types';
import { CheckCircleIcon } from './icons';

interface TierListProps {
    tiers: MembershipTier[];
    onEdit: (tier: MembershipTier) => void;
    onDelete: (tierId: string) => void;
}

const TierList: React.FC<TierListProps> = ({ tiers, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {tiers.map((tier) => (
                <div key={tier.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-lg font-bold text-gray-800">{tier.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex-grow">{tier.description}</p>
                    <div className="my-4">
                        <span className="text-4xl font-extrabold text-gray-900">${tier.annualPrice}</span>
                        <span className="text-base font-medium text-gray-500">/year</span>
                    </div>
                    {tier.monthlyPrice && (
                        <p className="text-sm text-gray-500 -mt-2 mb-4">${tier.monthlyPrice}/month option available</p>
                    )}
                     <p className="text-sm font-medium text-gray-600 mb-4">{tier.memberCount.toLocaleString()} members</p>
                    
                    <ul className="space-y-3 mb-6">
                        {tier.benefits.map((benefit) => (
                            <li key={benefit.id} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{benefit.name}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto space-y-2">
                        <button 
                            onClick={() => onEdit(tier)}
                            className="w-full px-4 py-2 text-sm font-medium text-brand-primary bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                        >
                            Edit Tier
                        </button>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete(tier.id);
                            }}
                            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Delete Tier
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TierList;
