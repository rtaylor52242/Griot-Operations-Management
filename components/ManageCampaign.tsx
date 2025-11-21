
import React, { useState, useEffect } from 'react';

interface Campaign {
    id: number;
    name: string;
    goal: number;
    raised: number;
    donors: number;
    status: string;
    description?: string;
}

interface ManageCampaignProps {
    campaign: Campaign | null;
    onSave: (updatedCampaign: Campaign) => void;
    onCancel: () => void;
}

const ManageCampaign: React.FC<ManageCampaignProps> = ({ campaign, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Campaign>({
        id: 0,
        name: '',
        goal: 0,
        raised: 0,
        donors: 0,
        status: 'Active',
        description: ''
    });

    useEffect(() => {
        if (campaign) {
            setFormData(campaign);
        }
    }, [campaign]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'goal' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">
                 {campaign ? `Manage Campaign: ${campaign.name}` : 'New Campaign'}
             </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Goal Amount ($)</label>
                        <input
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Amount Raised ($)</label>
                            <input
                                type="text"
                                disabled
                                value={formData.raised}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Donors</label>
                            <input
                                type="text"
                                disabled
                                value={formData.donors}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        >
                            <option value="Active">Active</option>
                            <option value="Ending Soon">Ending Soon</option>
                            <option value="Completed">Completed</option>
                            <option value="Paused">Paused</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                    >
                        Save Campaign
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ManageCampaign;
