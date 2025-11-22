
export enum MemberStatus {
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  Pending = 'Pending',
}

export enum MemberRole {
  Admin = 'Admin',
  Member = 'Member User',
  Guest = 'Guest',
}

export interface MembershipBenefit {
  id: string;
  name: string;
  description: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  annualPrice: number;
  monthlyPrice: number | null;
  benefits: MembershipBenefit[];
  memberCount: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tierId: string;
  status: MemberStatus;
  role: MemberRole;
  joinDate: string;
  renewalDate: string;
}

export interface Doc {
    id: string;
    name: string;
    type: string;
    size: string;
    date: string;
    url: string;
}

export interface Campaign {
    id: number;
    name: string;
    goal: number;
    raised: number;
    donors: number;
    status: string;
    description?: string;
}

export interface Donation {
    id: string;
    donorName: string;
    amount: number;
    campaignId: number;
    campaignName: string;
    date: string;
    paymentMethod: string;
    notes?: string;
}

export interface TicketEvent {
    id: number;
    title: string;
    date: string;
    sold: number;
    capacity: number | string; // 'Unlimited' or number
    status: string;
    price: number; // Average price for revenue calculation
}

export interface User {
    username: string;
    name: string;
    role: string;
}

export type ActivityType = 'membership' | 'ticketing' | 'fundraising' | 'system';

export interface Activity {
    id: number;
    action: string;
    detail: string;
    user: string;
    userRole: string;
    timestamp: string;
    type: ActivityType;
}
