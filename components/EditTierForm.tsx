
import React, { useState, useEffect } from 'react';
import { MembershipTier, MembershipBenefit } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface EditTierFormProps {
    tier: MembershipTier;
    onSave: (updatedTier: MembershipTier) => void;
    onCancel: () => void;
}

const EditTierForm: React.FC<EditTierFormProps> = ({ tier, onSave, onCancel }) => {
    const [formData, setFormData] = useState<MembershipTier>(tier);
    const [newBenefitName, setNewBenefitName] = useState('');
    const [newBenefitDesc, setNewBenefitDesc] = useState('');

    useEffect(() => {
        setFormData(tier);
    }, [tier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            if (name === 'annualPrice') {
                const val = Number(value);
                return {
                    ...prev,
                    annualPrice: val,
                    monthlyPrice: val > 0 ? parseFloat((val / 12).toFixed(2)) : 0
                };
            } else if (name === 'monthlyPrice') {
                const val = Number(value);
                return {
                    ...prev,
                    monthlyPrice: val,
                    annualPrice: val > 0 ? parseFloat((val * 12).toFixed(2)) : 0
                };
            } else {
                return {
                    ...prev,
                    [name]: value
                };
            }
        });
    };

    const handleAddBenefit = () => {
        if (!newBenefitName.trim()) return;

        const newBenefit: MembershipBenefit = {
            id: `b${Date.now()}`,
            name: newBenefitName,
            description: newBenefitDesc
        };

        setFormData(prev => ({
            ...prev,
            benefits: [...prev.benefits, newBenefit]
        }));

        setNewBenefitName('');
        setNewBenefitDesc('');
    };

    const handleRemoveBenefit = (benefitId: string) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter(b => b.id !== benefitId)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Membership Tier</h2>
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
                                    value={formData.monthlyPrice || ''}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="shadow-sm focus:ring-brand-primary focus:border-brand-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white text-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Benefits Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tier Benefits</h3>
                        
                        {/* Existing Benefits List */}
                        <div className="space-y-3 mb-6">
                            {formData.benefits.map((benefit) => (
                                <div key={benefit.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{benefit.name}</p>
                                        <p className="text-xs text-gray-500">{benefit.description}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveBenefit(benefit.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Remove Benefit"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {formData.benefits.length === 0 && (
                                <p className="text-sm text-gray-500 italic">No benefits assigned to this tier.</p>
                            )}
                        </div>

                        {/* Add New Benefit */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Benefit</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Benefit Name (e.g. Free Parking)"
                                        value={newBenefitName}
                                        onChange={(e) => setNewBenefitName(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Description (Optional)"
                                        value={newBenefitDesc}
                                        onChange={(e) => setNewBenefitDesc(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddBenefit}
                                    disabled={!newBenefitName.trim()}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-brand-primary bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Benefit
                                </button>
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
                        Save Tier
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTierForm;
