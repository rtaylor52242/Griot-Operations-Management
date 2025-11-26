
import React, { useState, useEffect } from 'react';
import { logActivity } from '../services/activityService';
import { TicketEvent, TicketTypePrice } from '../types';
import { ArrowLeftIcon } from './icons';

interface SellTicketsProps {
    events: TicketEvent[];
    onCancel: () => void;
    onComplete: () => void;
}

const SellTickets: React.FC<SellTicketsProps> = ({ events, onCancel, onComplete }) => {
    const [selectedEventId, setSelectedEventId] = useState<number>(events.length > 0 ? events[0].id : 0);
    const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

    const currentEvent = events.find(e => e.id === selectedEventId);
    
    const ticketTypes: TicketTypePrice[] = currentEvent?.ticketPricing || [
        { id: 'adult', name: 'General Admission', price: 25 }
    ];

    // Reset cart when event changes
    useEffect(() => {
        setCart([]);
    }, [selectedEventId]);

    const addToCart = (type: TicketTypePrice) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === type.id);
            if (existing) {
                return prev.map(item => item.id === type.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...type, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const handleCheckout = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const description = `${totalItems} tickets sold for "${currentEvent?.title}" (Revenue: $${totalValue.toFixed(2)})`;
        
        logActivity('Ticket Sale', description, 'ticketing');
        onComplete();
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col md:flex-row overflow-hidden">
            {/* Product Selection */}
            <div className="w-full md:w-2/3 p-6 bg-gray-50 overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <button 
                            onClick={onCancel}
                            className="mr-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                            title="Back to Ticketing"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">Sell Tickets</h2>
                    </div>
                    <div className="w-64">
                        <select
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(Number(e.target.value))}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md bg-white text-black"
                        >
                            {events.map(event => (
                                <option key={event.id} value={event.id}>{event.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ticketTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => addToCart(type)}
                            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-brand-primary hover:shadow-md transition-all text-left flex flex-col justify-between h-32"
                        >
                            <span className="font-bold text-lg text-gray-800">{type.name}</span>
                            <span className="text-2xl font-semibold text-brand-primary">${type.price}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Cart / Checkout */}
            <div className="w-full md:w-1/3 bg-white border-l border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Current Order</h3>
                    <p className="text-sm text-gray-500">{currentEvent?.title}</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">Cart is empty</div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-sm text-gray-500">${item.price} each</div>
                                </div>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button 
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    >-</button>
                                    <span className="px-2 py-1 font-medium text-black">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    >+</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold text-gray-900 text-lg">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600">Tax (0%)</span>
                        <span className="font-bold text-gray-900 text-lg">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-300">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-bold text-brand-primary">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                         <button 
                            onClick={onCancel}
                            className="py-3 px-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="py-3 px-4 bg-brand-primary rounded-lg font-bold text-white hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellTickets;
