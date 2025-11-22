
import React, { useState } from 'react';
import { MembershipTier } from '../types';

interface AddTierFormProps {
    onSave: (tier: Omit<MembershipTier, 'id' | 'memberCount' | 'benefits'>) => void;
    onCancel: () => void;
}

const AddTierForm: React.FC<AddTierFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        annualPrice: '',
        monthlyPrice: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: formData.name,
            description: formData.description,
            annualPrice: Number(formData.annualPrice),
            monthlyPrice: formData.monthlyPrice ? Number(formData.monthlyPrice) : null
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Membership Tier</h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tier Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                                placeholder="e.g. Student, Lifetime"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <div className="mt-1">
                            <textarea
                                name="description"
                                id="description"
                                rows={3}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                                placeholder="Describe the perks of this tier..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="annualPrice" className="block text-sm font-medium text-gray-700">
                                Annual Price ($)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="annualPrice"
                                    id="annualPrice"
                                    required
                                    min="0"
                                    value={formData.annualPrice}
                                    onChange={handleChange}
                                    className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700">
                                Monthly Price ($)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="monthlyPrice"
                                    id="monthlyPrice"
                                    min="0"
                                    value={formData.monthlyPrice}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                                />
                            </div>
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
                        Create Tier
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTierForm;
