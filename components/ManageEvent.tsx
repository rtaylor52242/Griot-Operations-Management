
import React, { useState, useEffect } from 'react';

interface EventData {
    id: number;
    title: string;
    date: string;
    sold: number;
    available: number | string;
    status: string;
}

interface ManageEventProps {
    event: EventData | null;
    onSave: (updatedEvent: EventData) => void;
    onCancel: () => void;
    onDelete?: (id: number) => void;
}

const ManageEvent: React.FC<ManageEventProps> = ({ event, onSave, onCancel, onDelete }) => {
    const [formData, setFormData] = useState<EventData>({
        id: 0,
        title: '',
        date: '',
        sold: 0,
        available: 0,
        status: 'Open'
    });

    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

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
                            type="text"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            placeholder="e.g., Oct 28, 2024 or Daily"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="text"
                                name="available"
                                value={formData.available}
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
