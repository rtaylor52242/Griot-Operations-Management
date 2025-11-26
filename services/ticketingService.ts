
import { TicketEvent, TicketTypePrice } from '../types';
import { addAction } from './historyService';

const defaultPricing: TicketTypePrice[] = [
    { id: 'adult', name: 'General Admission (Adult)', price: 25 },
    { id: 'senior', name: 'Senior (65+)', price: 20 },
    { id: 'child', name: 'Child (3-12)', price: 15 },
    { id: 'student', name: 'Student', price: 18 },
    { id: 'member', name: 'Member Guest', price: 12 },
];

const workshopPricing: TicketTypePrice[] = [
    { id: 'adult', name: 'Adult', price: 50 },
    { id: 'member', name: 'Member', price: 40 },
];

let events: TicketEvent[] = [
    { 
        id: 1, 
        title: 'General Admission', 
        date: new Date().toISOString().split('T')[0], // Use today's date for Daily
        sold: 452, 
        capacity: 'Unlimited', 
        status: 'Open', 
        price: 25,
        ticketPricing: defaultPricing
    },
    { 
        id: 2, 
        title: 'Night at the Museum', 
        date: '2024-10-28', 
        sold: 185, 
        capacity: 200, 
        status: 'Selling Fast', 
        price: 35,
        ticketPricing: [
            { id: 'adult', name: 'Adult', price: 35 },
            { id: 'child', name: 'Child', price: 20 },
            { id: 'vip', name: 'VIP Experience', price: 75 }
        ]
    },
    { 
        id: 3, 
        title: 'Lecture: Art History 101', 
        date: '2024-11-05', 
        sold: 45, 
        capacity: 100, 
        status: 'Open', 
        price: 15,
        ticketPricing: [
            { id: 'general', name: 'General Admission', price: 15 },
            { id: 'student', name: 'Student', price: 10 }
        ]
    },
    { 
        id: 4, 
        title: 'Workshop: Pottery', 
        date: '2024-11-12', 
        sold: 20, 
        capacity: 20, 
        status: 'Sold Out', 
        price: 50,
        ticketPricing: workshopPricing
    },
];

export const getEvents = async (): Promise<TicketEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...events]), 300));
};

export const updateEventService = async (event: TicketEvent, addToHistory = true): Promise<void> => {
    const oldEvent = events.find(e => e.id === event.id);
    const isNew = !oldEvent;
    
    if (isNew) {
        events = [...events, event];
        if (addToHistory) {
            addAction({
                name: 'Add Event',
                undo: () => deleteEventService(event.id, false),
                redo: () => updateEventService(event, false)
            });
        }
    } else {
        events = events.map(e => e.id === event.id ? event : e);
        if (addToHistory && oldEvent) {
            addAction({
                name: 'Update Event',
                undo: () => updateEventService(oldEvent, false),
                redo: () => updateEventService(event, false)
            });
        }
    }
};

export const deleteEventService = async (id: number, addToHistory = true): Promise<void> => {
    const eventToDelete = events.find(e => e.id === id);
    events = events.filter(e => e.id !== id);
    if (addToHistory && eventToDelete) {
        addAction({
            name: 'Delete Event',
            undo: () => updateEventService(eventToDelete, false),
            redo: () => deleteEventService(id, false)
        });
    }
};

export const sellTicketsService = async (eventId: number | null, quantity: number, totalAmount: number): Promise<void> => {
    // Note: Ticket sales affect event 'sold' count.
    // Implementing undo for ticket sales is complex as it involves transactions. 
    // For this exercise, we will skip Undo/Redo for individual POS transactions 
    // unless explicitly requested, to keep it minimal.
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
