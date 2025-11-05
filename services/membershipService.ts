
import { Member, MembershipTier, MembershipBenefit, MemberStatus } from '../types';

const benefits: { [key: string]: MembershipBenefit } = {
  freeAdmission: { id: 'b1', name: 'Free General Admission', description: 'Unlimited free entry to all standard exhibits.' },
  guestPasses: { id: 'b2', name: '4 Guest Passes', description: 'Bring up to 4 guests with you on any visit.' },
  storeDiscount: { id: 'b3', name: '10% Store Discount', description: 'Enjoy a 10% discount at all museum gift shops.' },
  earlyAccess: { id: 'b4', name: 'Early Access to Exhibits', description: 'Preview new exhibits before they open to the public.' },
  exclusiveContent: { id: 'b5', name: 'Exclusive Digital Content', description: 'Access to members-only articles, videos, and virtual tours.' },
  directorCircle: { id: 'b6', name: 'Director\'s Circle Events', description: 'Invitations to exclusive events with the museum director.' },
};

const mockTiers: MembershipTier[] = [
  {
    id: 't1',
    name: 'Individual',
    description: 'Perfect for the solo explorer who wants to enjoy our collections year-round.',
    annualPrice: 75,
    monthlyPrice: null,
    benefits: [benefits.freeAdmission, benefits.storeDiscount],
    memberCount: 1254,
  },
  {
    id: 't2',
    name: 'Household',
    description: 'Ideal for families, this membership covers two adults and up to four children.',
    annualPrice: 150,
    monthlyPrice: 15,
    benefits: [benefits.freeAdmission, benefits.storeDiscount, benefits.guestPasses],
    memberCount: 3891,
  },
  {
    id: 't3',
    name: 'Supporter',
    description: 'A higher level of support that includes exclusive access and special perks.',
    annualPrice: 500,
    monthlyPrice: 45,
    benefits: [benefits.freeAdmission, benefits.storeDiscount, benefits.guestPasses, benefits.earlyAccess, benefits.exclusiveContent],
    memberCount: 432,
  },
  {
    id: 't4',
    name: 'Patron',
    description: 'Our premier membership level for those who wish to make a significant impact.',
    annualPrice: 1200,
    monthlyPrice: 100,
    benefits: [benefits.freeAdmission, benefits.storeDiscount, benefits.guestPasses, benefits.earlyAccess, benefits.exclusiveContent, benefits.directorCircle],
    memberCount: 128,
  },
];

const mockMembers: Member[] = [
  { id: 'm1', firstName: 'Alice', lastName: 'Johnson', email: 'alice.j@example.com', tierId: 't2', status: MemberStatus.Active, joinDate: '2023-05-15', renewalDate: '2025-05-15' },
  { id: 'm2', firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com', tierId: 't1', status: MemberStatus.Active, joinDate: '2023-01-20', renewalDate: '2025-01-20' },
  { id: 'm3', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.b@example.com', tierId: 't3', status: MemberStatus.Active, joinDate: '2022-11-30', renewalDate: '2024-11-30' },
  { id: 'm4', firstName: 'Diana', lastName: 'Prince', email: 'diana.p@example.com', tierId: 't4', status: MemberStatus.Expired, joinDate: '2022-02-10', renewalDate: '2023-02-10' },
  { id: 'm5', firstName: 'Ethan', lastName: 'Hunt', email: 'ethan.h@example.com', tierId: 't2', status: MemberStatus.Active, joinDate: '2023-08-01', renewalDate: '2025-08-01' },
  { id: 'm6', firstName: 'Fiona', lastName: 'Glenanne', email: 'fiona.g@example.com', tierId: 't1', status: MemberStatus.Cancelled, joinDate: '2023-03-05', renewalDate: '2024-03-05' },
  { id: 'm7', firstName: 'George', lastName: 'Costanza', email: 'george.c@example.com', tierId: 't2', status: MemberStatus.Pending, joinDate: '2024-07-20', renewalDate: '2025-07-20' },
  { id: 'm8', firstName: 'Hannah', lastName: 'Montana', email: 'hannah.m@example.com', tierId: 't3', status: MemberStatus.Active, joinDate: '2023-09-12', renewalDate: '2024-09-12' },
  { id: 'm9', firstName: 'Ian', lastName: 'Malcolm', email: 'ian.m@example.com', tierId: 't1', status: MemberStatus.Active, joinDate: '2023-06-22', renewalDate: '2025-06-22' },
  { id: 'm10', firstName: 'Jane', lastName: 'Doe', email: 'jane.d@example.com', tierId: 't4', status: MemberStatus.Active, joinDate: '2022-12-01', renewalDate: '2024-12-01' },
];

export const getTiers = async (): Promise<MembershipTier[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockTiers), 500));
};

export const getMembers = async (): Promise<Member[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockMembers), 500));
};

export const getTierById = (tierId: string): MembershipTier | undefined => {
    return mockTiers.find(t => t.id === tierId);
};
