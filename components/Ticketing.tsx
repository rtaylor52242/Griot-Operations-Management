
import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import SellTickets from './SellTickets';
import ManageEvent from './ManageEvent';
import { TicketIcon, CurrencyDollarIcon, UsersIcon } from './icons';
import { getEvents, updateEventService, deleteEventService } from '../services/ticketingService';
import { TicketEvent } from '../types';
import { logActivity } from '../services/activityService';

interface TicketingProps {
    initialView?: string;
}

const Ticketing: React.FC<TicketingProps> = ({ initialView }) => {
    const [view, setView] = useState(initialView || 'dashboard');
    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<TicketEvent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getEvents();
            setEvents(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEvent = async (event: TicketEvent) => {
        await updateEventService(event);
        logActivity('Event Updated', `Updated event: ${event.title}`, 'ticketing');
        await loadData();
        setView('dashboard');
        setSelectedEvent(null);
    };

    const handleDeleteEvent = async (id: number) => {
        const event = events.find(e => e.id === id);
        await deleteEventService(id);
        if (event) {
            logActivity('Event Deleted', `Deleted event: ${event.title}`, 'ticketing');
        }
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    const handleManageClick = (event: TicketEvent) => {
        setSelectedEvent(event);
        setView('manage');
    };

    const handleSellComplete = () => {
        loadData();
        setView('dashboard');
    };

    // Calculate Dashboard Stats
    const todaySales = events.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((sum, e) => sum + e.sold, 0);
    const totalRevenue = events.reduce((sum, e) => sum + (e.sold * e.price), 0);

    if (view === 'sell') {
        return <SellTickets events={events} onCancel={() => setView('dashboard')} onComplete={handleSellComplete} />;
    }

    if (view === 'manage') {
        return (
            <ManageEvent 
                event={selectedEvent} 
                onSave={handleSaveEvent} 
                onCancel={() => { setView('dashboard'); setSelectedEvent(null); }} 
                onDelete={handleDeleteEvent}
            />
        );
    }

    if (view === 'create') {
        return (
             <ManageEvent 
                event={null}
                onSave={handleSaveEvent} 
                onCancel={() => setView('dashboard')} 
            />
        );
    }

    return (
        <div>
            <Header 
                title="Ticketing & Events" 
                buttonText="Sell Tickets" 
                onButtonClick={() => setView('sell')} 
            >
                <button 
                     onClick={() => setView('create')}
                     className="mr-3 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                    + New Event
                </button>
            </Header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Daily Tickets Sold" value={todaySales.toString()} icon={TicketIcon} />
                <StatCard title="Total Revenue (Est)" value={`$${totalRevenue.toLocaleString()}`} icon={CurrencyDollarIcon} />
                <StatCard title="Upcoming Events" value={events.length.toString()} icon={UsersIcon} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Events</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {events.map(event => (
                        <li key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="flex-1 mb-4 md:mb-0">
                                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                        <span className="mr-4">{event.date}</span>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            event.status === 'Open' ? 'bg-green-100 text-green-800' : 
                                            event.status === 'Sold Out' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        <span className="font-medium">{event.sold}</span> sold / <span className="font-medium">{event.capacity}</span> capacity
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleManageClick(event)}
                                        className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Manage
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteEvent(event.id);
                                        }}
                                        className="py-2 px-4 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Ticketing;
