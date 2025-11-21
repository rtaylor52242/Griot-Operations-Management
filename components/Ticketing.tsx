
import React, { useState } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import SellTickets from './SellTickets';
import ManageEvent from './ManageEvent';
import { TicketIcon, CalendarIcon, CurrencyDollarIcon } from './icons';

interface EventData {
    id: number;
    title: string;
    date: string;
    sold: number;
    available: number | string;
    status: string;
}

interface TicketingProps {
    initialView?: string;
}

const Ticketing: React.FC<TicketingProps> = ({ initialView }) => {
    const [view, setView] = useState<'overview' | 'sell' | 'manage'>((initialView as any) || 'overview');
    const [events, setEvents] = useState<EventData[]>([
        { id: 1, title: 'General Admission', date: 'Daily', sold: 452, available: 'Unlimited', status: 'Open' },
        { id: 2, title: 'Night at the Museum', date: 'Oct 28, 2024', sold: 185, available: 200, status: 'Selling Fast' },
        { id: 3, title: 'Lecture: Art History 101', date: 'Nov 05, 2024', sold: 45, available: 100, status: 'Open' },
        { id: 4, title: 'Workshop: Pottery', date: 'Nov 12, 2024', sold: 20, available: 20, status: 'Sold Out' },
    ]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    const handleSellClick = () => {
        setView('sell');
    };

    const handleManageClick = (event: EventData) => {
        setSelectedEvent(event);
        setView('manage');
    };

    const handleSaveEvent = (updatedEvent: EventData) => {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setView('overview');
        setSelectedEvent(null);
    };

    return (
        <div>
            {view === 'overview' && (
                <>
                    <Header title="Ticketing" buttonText="Sell Tickets" onButtonClick={handleSellClick} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Tickets Sold (Today)" value="452" icon={TicketIcon} />
                        <StatCard title="Ticket Revenue (Today)" value="$12,450" icon={CurrencyDollarIcon} />
                        <StatCard title="Upcoming Events" value={events.length.toString()} icon={CalendarIcon} />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Current & Upcoming Events</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-md bg-brand-primary bg-opacity-10 text-brand-primary">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full 
                                            ${event.status === 'Sold Out' ? 'bg-red-100 text-red-800' : 
                                              event.status === 'Selling Fast' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-green-100 text-green-800'}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{event.date}</p>
                                    
                                    <div className="flex justify-between items-center text-sm mb-4">
                                        <span className="text-gray-600">Sold: <span className="font-semibold">{event.sold}</span></span>
                                        <span className="text-gray-600">Capacity: <span className="font-semibold">{event.available}</span></span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleManageClick(event)}
                                        className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Manage Event
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {view === 'sell' && (
                <>
                    <Header title="Sell Tickets" />
                    <SellTickets onCancel={() => setView('overview')} onComplete={() => setView('overview')} />
                </>
            )}

            {view === 'manage' && (
                <>
                     <Header title="Manage Event" />
                     <ManageEvent 
                        event={selectedEvent} 
                        onSave={handleSaveEvent} 
                        onCancel={() => { setView('overview'); setSelectedEvent(null); }} 
                    />
                </>
            )}
        </div>
    );
};

export default Ticketing;
