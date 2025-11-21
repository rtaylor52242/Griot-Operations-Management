
export enum MemberStatus {
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
  Pending = 'Pending',
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
