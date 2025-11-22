
import { TicketEvent } from '../types';

let events: TicketEvent[] = [
    { id: 1, title: 'General Admission', date: 'Daily', sold: 452, capacity: 'Unlimited', status: 'Open', price: 25 },
    { id: 2, title: 'Night at the Museum', date: 'Oct 28, 2024', sold: 185, capacity: 200, status: 'Selling Fast', price: 35 },
    { id: 3, title: 'Lecture: Art History 101', date: 'Nov 05, 2024', sold: 45, capacity: 100, status: 'Open', price: 15 },
    { id: 4, title: 'Workshop: Pottery', date: 'Nov 12, 2024', sold: 20, capacity: 20, status: 'Sold Out', price: 50 },
];

export const getEvents = async (): Promise<TicketEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...events]), 300));
};

export const updateEventService = async (event: TicketEvent): Promise<void> => {
    events = events.map(e => e.id === event.id ? event : e);
};

export const deleteEventService = async (id: number): Promise<void> => {
    events = events.filter(e => e.id !== id);
};

export const sellTicketsService = async (eventId: number | null, quantity: number, totalAmount: number): Promise<void> => {
    // If eventId is provided, update specific event
    if (eventId) {
        events = events.map(e => {
            if (e.id === eventId) {
                const newSold = e.sold + quantity;
                let newStatus = e.status;
                if (typeof e.capacity === 'number') {
                     if (newSold >= e.capacity) newStatus = 'Sold Out';
                     else if (newSold >= e.capacity * 0.8) newStatus = 'Selling Fast';
                }
                return { ...e, sold: newSold, status: newStatus };
            }
            return e;
        });
    } else {
        // General Admission (id 1)
        events = events.map(e => {
            if (e.id === 1) {
                return { ...e, sold: e.sold + quantity };
            }
            return e;
        });
    }
};
