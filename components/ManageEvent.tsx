
import React, { useState, useEffect } from 'react';
import { TicketEvent, TicketTypePrice } from '../types';
import Header from './Header';
import { PlusIcon, TrashIcon } from './icons';

interface ManageEventProps {
    event: TicketEvent | null;
    onSave: (event: TicketEvent) => void;
    onCancel: () => void;
    onDelete?: (id: number) => void;
}

const ManageEvent: React.FC<ManageEventProps> = ({ event, onSave, onCancel, onDelete }) => {
    const [formData, setFormData] = useState<TicketEvent>({
        id: Date.now(),
        title: '',
        date: new Date().toISOString().split('T')[0],
        sold: 0,
        capacity: 100,
        status: 'Open',
        price: 0,
        ticketPricing: []
    });

    const [newPriceGroup, setNewPriceGroup] = useState({ name: '', price: '' });

    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'capacity' && value !== 'Unlimited') || name === 'price' || name === 'sold' ? Number(value) : value
        }));
    };

    const handleAddPriceGroup = () => {
        if (newPriceGroup.name && newPriceGroup.price) {
            const newGroup: TicketTypePrice = {
                id: `tg-${Date.now()}`,
                name: newPriceGroup.name,
                price: Number(newPriceGroup.price)
            };
            setFormData(prev => ({
                ...prev,
                ticketPricing: [...(prev.ticketPricing || []), newGroup]
            }));
            setNewPriceGroup({ name: '', price: '' });
        }
    };

    const handleRemovePriceGroup = (id: string) => {
        setFormData(prev => ({
            ...prev,
            ticketPricing: prev.ticketPricing?.filter(tp => tp.id !== id) || []
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div>
            <Header title={event ? "Manage Event" : "Create Event"} />
            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    required
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Sold Count</label>
                                <input
                                    type="number"
                                    name="sold"
                                    value={formData.sold}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-black"
                                />
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

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Pricing Groups</h3>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        type="text" 
                                        placeholder="Group Name (e.g. Student)" 
                                        className="flex-1 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"
                                        value={newPriceGroup.name}
                                        onChange={e => setNewPriceGroup({...newPriceGroup, name: e.target.value})}
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Price" 
                                        className="w-24 border border-gray-300 rounded-md p-2 text-sm bg-white text-black"
                                        value={newPriceGroup.price}
                                        onChange={e => setNewPriceGroup({...newPriceGroup, price: e.target.value})}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddPriceGroup}
                                        className="bg-indigo-100 text-brand-primary p-2 rounded-md hover:bg-indigo-200"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {formData.ticketPricing?.map(tp => (
                                    <div key={tp.id} className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-md">
                                        <span className="text-sm font-medium text-gray-700">{tp.name}</span>
                                        <div className="flex items-center">
                                            <span className="text-sm font-bold text-gray-900 mr-4">${tp.price}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemovePriceGroup(tp.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!formData.ticketPricing || formData.ticketPricing.length === 0) && (
                                    <p className="text-sm text-gray-500 italic">No specific pricing groups set. Base price will apply.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between">
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
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                            >
                                Save Event
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageEvent;
