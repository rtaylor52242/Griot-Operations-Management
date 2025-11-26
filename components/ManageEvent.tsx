
import React, { useState, useEffect } from 'react';
import { TicketEvent, TicketTypePrice } from '../types';

interface ManageEventProps {
    event: TicketEvent | null;
    onSave: (updatedEvent: TicketEvent) => void;
    onCancel: () => void;
    onDelete?: (id: number) => void;
}

const ManageEvent: React.FC<ManageEventProps> = ({ event, onSave, onCancel, onDelete }) => {
    const [formData, setFormData] = useState<TicketEvent>({
        id: Date.now(),
        title: '',
        date: '',
        sold: 0,
        capacity: '',
        status: 'Open',
        price: 25,
        ticketPricing: [
            { id: 'adult', name: 'General Admission (Adult)', price: 25 },
            { id: 'senior', name: 'Senior (65+)', price: 20 },
            { id: 'child', name: 'Child (3-12)', price: 15 },
            { id: 'student', name: 'Student', price: 18 },
            { id: 'member', name: 'Member Guest', price: 12 },
        ]
    });

    useEffect(() => {
        if (event) {
            // Ensure ticketPricing exists
            const pricing = event.ticketPricing || [
                { id: 'adult', name: 'General Admission (Adult)', price: 25 },
                { id: 'senior', name: 'Senior (65+)', price: 20 },
                { id: 'child', name: 'Child (3-12)', price: 15 },
                { id: 'student', name: 'Student', price: 18 },
                { id: 'member', name: 'Member Guest', price: 12 },
            ];
            // Ensure date format is YYYY-MM-DD for date input if possible
            // If existing date is text like "Daily", it won't show in date picker, which is acceptable
            setFormData({ ...event, ticketPricing: pricing });
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'sold' || name === 'price' ? Number(value) : value
        }));
    };

    const handlePriceChange = (index: number, value: string) => {
        const newPricing = [...(formData.ticketPricing || [])];
        newPricing[index] = { ...newPricing[index], price: Number(value) };
        setFormData(prev => ({ ...prev, ticketPricing: newPricing }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">
                 {event ? `Edit Event: ${event.title}` : 'New Event'}
             </h2>
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="text"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Tickets Sold</label>
                            <input
                                type="number"
                                name="sold"
                                value={formData.sold}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
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
                            <option value="Open">Open</option>
                            <option value="Selling Fast">Selling Fast</option>
                            <option value="Sold Out">Sold Out</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Pricing</h3>
                        <p className="text-sm text-gray-500 mb-4">Set price points for this event. Different events can have different pricing structures.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.ticketPricing?.map((type, index) => (
                                <div key={type.id}>
                                    <label className="block text-sm font-medium text-gray-700">{type.name} ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={type.price}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div>
                        {event && onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(event.id)}
                                className="bg-white py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete Event
                            </button>
                        )}
                    </div>
                    <div className="flex">
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
                            Save Event
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ManageEvent;
