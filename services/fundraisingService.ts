
import { Campaign, Donation } from '../types';

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

export const addCampaignService = async (campaign: Campaign): Promise<void> => {
    campaigns = [campaign, ...campaigns];
};

export const updateCampaignService = async (campaign: Campaign): Promise<void> => {
    campaigns = campaigns.map(c => c.id === campaign.id ? campaign : c);
};

export const deleteCampaignService = async (id: number): Promise<void> => {
    campaigns = campaigns.filter(c => c.id !== id);
};

export const logDonationService = async (amount: number, campaignId: number, donorName: string, paymentMethod: string, notes?: string, date?: string): Promise<void> => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
        // Update campaign stats
        campaigns = campaigns.map(c => {
            if (c.id === campaignId) {
                return {
                    ...c,
                    raised: c.raised + amount,
                    donors: c.donors + 1
                };
            }
            return c;
        });

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
    }
};
