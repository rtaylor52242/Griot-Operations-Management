
import { Activity, ActivityType, User } from '../types';

// Mock initial data
let activities: Activity[] = [
    { id: 1, action: 'New Membership', detail: 'Alice Johnson joined as Household', user: 'System', userRole: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleString(), type: 'membership' },
    { id: 2, action: 'Ticket Sale', detail: '5 tickets sold for "Ancient Civilizations"', user: 'Sarah Smith', userRole: 'Box Office Manager', timestamp: new Date(Date.now() - 1000 * 60 * 25).toLocaleString(), type: 'ticketing' },
    { id: 3, action: 'Donation Received', detail: '$500 from Robert Smith', user: 'System', userRole: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleString(), type: 'fundraising' },
    { id: 4, action: 'System Alert', detail: 'Daily backup completed successfully', user: 'System', userRole: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toLocaleString(), type: 'system' },
    { id: 5, action: 'New Membership', detail: 'Eva Green joined as Individual', user: 'Web Portal', userRole: 'System', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toLocaleString(), type: 'membership' },
];

let currentUser: User = { username: 'guest', name: 'Guest User', role: 'Guest' };

export const setCurrentUserSession = (user: User) => {
    currentUser = user;
};

export const getCurrentUserSession = (): User => {
    return currentUser;
};

export const getActivities = async (): Promise<Activity[]> => {
    // Simulate delay
    return new Promise(resolve => setTimeout(() => resolve([...activities]), 300));
};

export const logActivity = (action: string, detail: string, type: ActivityType) => {
    const newActivity: Activity = {
        id: Date.now(),
        action,
        detail,
        user: currentUser.name,
        userRole: currentUser.role,
        timestamp: new Date().toLocaleString(),
        type
    };
    activities = [newActivity, ...activities];
    return newActivity;
};
