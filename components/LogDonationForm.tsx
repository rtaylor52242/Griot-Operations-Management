
import React, { useState } from 'react';

interface Campaign {
    id: number;
    name: string;
}

interface LogDonationFormProps {
    campaigns: Campaign[];
    onSave: (donation: { donorName: string; amount: number; campaignId: number; paymentMethod: string; date: string }) => void;
    onCancel: () => void;
}

const LogDonationForm: React.FC<LogDonationFormProps> = ({ campaigns, onSave, onCancel }) => {
    const [donorName, setDonorName] = useState('');
    const [amount, setAmount] = useState('');
    const [campaignId, setCampaignId] = useState(campaigns.length > 0 ? campaigns[0].id : 0);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            donorName,
            amount: Number(amount),
            campaignId: Number(campaignId),
            paymentMethod,
            date
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Log New Donation</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">Donor Name</label>
                        <input
                            type="text"
                            id="donorName"
                            required
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                        <input
                            type="number"
                            id="amount"
                            required
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            id="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="campaign" className="block text-sm font-medium text-gray-700">Campaign</label>
                        <select
                            id="campaign"
                            value={campaignId}
                            onChange={(e) => setCampaignId(Number(e.target.value))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        >
                            {campaigns.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                        >
                            <option>Credit Card</option>
                            <option>Check</option>
                            <option>Cash</option>
                            <option>Bank Transfer</option>
                            <option>Stock / Securities</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                        <textarea
                            id="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
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
                        Log Donation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LogDonationForm;
