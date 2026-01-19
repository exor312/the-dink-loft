
export type CourtId = 1 | 2 | 3 | 4 | 5 | 6;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface RentalItem {
  id: string;
  name: string;
  ratePerHour: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  isAdmin: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  courtId: CourtId;
  date: string; // YYYY-MM-DD
  startTime: number; // 6-22
  duration: number; // 1-3
  rentals: { itemId: string; quantity: number }[];
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  registrationLink: string;
  imageUrl?: string;
}

export interface Rates {
  courtPerHour: number;
  rentals: RentalItem[];
}
