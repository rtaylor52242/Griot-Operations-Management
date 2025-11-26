
import { Campaign, Donation } from '../types';
import { addAction } from './historyService';

let campaigns: Campaign[] = [
    { id: 1, name: 'Annual Fund 2024', goal: 500000, raised: 325000, donors: 1240, status: 'Active', description: 'Supporting general operations and community outreach.' },
    { id: 2, name: 'New Wing Capital Campaign', goal: 2000000, raised: 850000, donors: 450, status: 'Active', description: 'Raising funds for the new modern art wing construction.' },
    { id: 3, name: 'Education Initiative', goal: 100000, raised: 98000, donors: 310, status: 'Ending Soon', description: 'Funding school trips and educational workshops.' },
    { id: 4, name: 'Preservation Grant Match', goal: 50000, raised: 50000, donors: 125, status: 'Completed', description: 'Matching grant for artifact preservation.' },
];

let donations: Donation[] = [
    { id: 'd1', donorName: 'Alice Johnson', amount: 250, campaignId: 1, campaignName: 'Annual Fund 2024', date: '2024-10-24', paymentMethod: 'Credit Card' },
    { id: 'd2', donorName: 'Robert Smith', amount: 5000, campaignId: 2, campaignName: 'New Wing Capital Campaign', date: '2024-10-23', paymentMethod: 'Check' },
    { id: 'd3', donorName: 'Community Foundation', amount: 10000, campaignId: 3, campaignName: 'Education Initiative', date: '2024-10-22', paymentMethod: 'Bank Transfer' },
    { id: 'd4', donorName: 'Sarah Williams', amount: 50, campaignId: 1, campaignName: 'Annual Fund 2024', date: '2024-10-24', paymentMethod: 'Credit Card' },
    { id: 'd5', donorName: 'Michael Brown', amount: 100, campaignId: 1, campaignName: 'Annual Fund 2024', date: '2024-10-21', paymentMethod: 'Credit Card' },
];

export const getCampaigns = async (): Promise<Campaign[]> => {
    // Simulate API delay
    return new Promise(resolve => setTimeout(() => resolve([...campaigns]), 300));
};

export const getDonations = async (): Promise<Donation[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...donations]), 300));
};

export const addCampaignService = async (campaign: Campaign, addToHistory = true): Promise<void> => {
    campaigns = [campaign, ...campaigns];
    if (addToHistory) {
        addAction({
            name: 'Add Campaign',
            undo: () => deleteCampaignService(campaign.id, false),
            redo: () => addCampaignService(campaign, false)
        });
    }
};

export const updateCampaignService = async (campaign: Campaign, addToHistory = true): Promise<void> => {
    const oldCampaign = campaigns.find(c => c.id === campaign.id);
    campaigns = campaigns.map(c => c.id === campaign.id ? campaign : c);
    if (addToHistory && oldCampaign) {
        addAction({
            name: 'Update Campaign',
            undo: () => updateCampaignService(oldCampaign, false),
            redo: () => updateCampaignService(campaign, false)
        });
    }
};

export const deleteCampaignService = async (id: number, addToHistory = true): Promise<void> => {
    const campaignToDelete = campaigns.find(c => c.id === id);
    campaigns = campaigns.filter(c => c.id !== id);
    if (addToHistory && campaignToDelete) {
        addAction({
            name: 'Delete Campaign',
            undo: () => addCampaignService(campaignToDelete, false),
            redo: () => deleteCampaignService(id, false)
        });
    }
};

export const logDonationService = async (amount: number, campaignId: number, donorName: string, paymentMethod: string, notes?: string, date?: string, addToHistory = true): Promise<void> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
        // Update campaign stats
        const oldCampaign = { ...campaign };
        const newCampaign = {
            ...campaign,
            raised: campaign.raised + amount,
            donors: campaign.donors + 1
        };
        
        // We update the campaign array implicitly here, but for undo/redo of just the donation log, 
        // we need to handle the campaign stats reversion too.
        campaigns = campaigns.map(c => c.id === campaignId ? newCampaign : c);

        // Log individual donation
        const newDonation: Donation = {
            id: `d${Date.now()}`,
            donorName,
            amount,
            campaignId,
            campaignName: campaign.name,
            date: date || new Date().toISOString().split('T')[0],
            paymentMethod,
            notes
        };
        donations = [newDonation, ...donations];

        if (addToHistory) {
            addAction({
                name: 'Log Donation',
                undo: () => {
                    // Revert donation list
                    donations = donations.filter(d => d.id !== newDonation.id);
                    // Revert campaign stats
                    campaigns = campaigns.map(c => c.id === campaignId ? oldCampaign : c);
                },
                redo: () => logDonationService(amount, campaignId, donorName, paymentMethod, notes, date, false)
            });
        }
    }
};
