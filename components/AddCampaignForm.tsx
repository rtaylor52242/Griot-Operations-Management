
import React, { useState } from 'react';

interface AddCampaignFormProps {
    onSave: (campaign: { name: string; goal: number; description: string }) => void;
    onCancel: () => void;
}

const AddCampaignForm: React.FC<AddCampaignFormProps> = ({ onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            goal: Number(goal),
            description
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Fundraising Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Campaign Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            placeholder="e.g., Summer Gala 2024"
                        />
                    </div>
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Fundraising Goal ($)</label>
                        <input
                            type="number"
                            id="goal"
                            required
                            min="1"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            placeholder="e.g., 50000"
                        />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            placeholder="Briefly describe the purpose of this campaign..."
                        />
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
                        Launch Campaign
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCampaignForm;
