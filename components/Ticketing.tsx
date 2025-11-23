import React, { useState, useEffect } from 'react';
import Header from './Header';
import StatCard from './StatCard';
import SellTickets from './SellTickets';
import ManageEvent from './ManageEvent';
import { TicketIcon, CalendarIcon, CurrencyDollarIcon } from './icons';
import { TicketEvent } from '../types';
import { getEvents, updateEventService, deleteEventService } from '../services/ticketingService';
import { logActivity } from '../services/activityService';

interface TicketingProps {
    initialView?: string;
}

const Ticketing: React.FC<TicketingProps> = ({ initialView }) => {
    const [view, setView] = useState<'overview' | 'sell' | 'manage'>((initialView as any) || 'overview');
    const [events, setEvents] = useState<TicketEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<TicketEvent | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSellClick = () => {
        setView('sell');
    };

    const handleManageClick = (event: TicketEvent) => {
        setSelectedEvent(event);
        setView('manage');
    };

    const handleDeleteEvent = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            const eventToDelete = events.find(e => e.id === id);
            await deleteEventService(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            if (eventToDelete) {
                logActivity('Event Deleted', `Deleted event: ${eventToDelete.title}`, 'ticketing');
            }
            return true;
        }
        return false;
    };

    const handleSaveEvent = async (updatedEvent: any) => {
        // Cast to TicketEvent as manage form might return partial
        const fullEvent: TicketEvent = {
             ...updatedEvent,
             price: updatedEvent.price || 20 // Default if missing
        };
        
        const isNew = !events.find(e => e.id === fullEvent.id);
        await updateEventService(fullEvent);
        
        if (isNew) {
            setEvents([...events, fullEvent]);
            logActivity('Event Created', `Created new event: ${fullEvent.title}`, 'ticketing');
        } else {
            setEvents(events.map(e => e.id === fullEvent.id ? fullEvent : e));
            logActivity('Event Updated', `Updated event details: ${fullEvent.title}`, 'ticketing');
        }
        
        setView('overview');
        setSelectedEvent(null);
    };

    // Calculate stats
    const dailySold = events.find(e => e.title === 'General Admission')?.sold || 0;
    const totalRevenue = events.reduce((sum, e) => sum + (e.sold * e.price), 0);

    return (
        <div>
            {view === 'overview' && (
                <>
                    <Header title="Ticketing" buttonText="Sell Tickets" onButtonClick={handleSellClick} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Daily Tickets Sold" value={dailySold.toString()} icon={TicketIcon} />
                        <StatCard title="Est. Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={CurrencyDollarIcon} />
                        <StatCard title="Upcoming Events" value={events.length.toString()} icon={CalendarIcon} />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Current & Upcoming Events</h2>
                            <button 
                                onClick={() => { setSelectedEvent(null); setView('manage'); }}
                                className="text-sm text-brand-primary hover:text-brand-secondary font-medium"
                            >
                                + Add New Event
                            </button>
                        </div>
                        
                        {loading ? (
                            <p className="text-gray-500">Loading events...</p>
                        ) : (
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
                                        <span className="text-gray-600">Capacity: <span className="font-semibold">{event.capacity}</span></span>
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => handleManageClick(event)}
                                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Manage
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="py-2 px-4 border border-red-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
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
                        event={selectedEvent as any} 
                        onSave={handleSaveEvent} 
                        onDelete={(id) => {
                             if (handleDeleteEvent(id)) {
                                 setView('overview');
                                 setSelectedEvent(null);
                             }
                        }}
                        onCancel={() => { setView('overview'); setSelectedEvent(null); }} 
                    />
                </>
            )}
        </div>
    );
};

export default Ticketing;