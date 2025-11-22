
import { Campaign } from '../types';

let campaigns: Campaign[] = [
    { id: 1, name: 'Annual Fund 2024', goal: 500000, raised: 325000, donors: 1240, status: 'Active', description: 'Supporting general operations and community outreach.' },
    { id: 2, name: 'New Wing Capital Campaign', goal: 2000000, raised: 850000, donors: 450, status: 'Active', description: 'Raising funds for the new modern art wing construction.' },
    { id: 3, name: 'Education Initiative', goal: 100000, raised: 98000, donors: 310, status: 'Ending Soon', description: 'Funding school trips and educational workshops.' },
    { id: 4, name: 'Preservation Grant Match', goal: 50000, raised: 50000, donors: 125, status: 'Completed', description: 'Matching grant for artifact preservation.' },
];

export const getCampaigns = async (): Promise<Campaign[]> => {
    // Simulate API delay
    return new Promise(resolve => setTimeout(() => resolve([...campaigns]), 300));
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

export const logDonationService = async (amount: number, campaignId: number): Promise<void> => {
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
};
