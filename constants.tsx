
import { Rates, RentalItem, CourtId } from './types';

export const OPERATING_HOURS = {
  start: 6,
  end: 22,
};

export const COURTS: CourtId[] = [1, 2, 3, 4, 5, 6];

export const INITIAL_RATES: Rates = {
  courtPerHour: 40,
  rentals: [
    { id: 'pdl1', name: 'Premium Paddle', ratePerHour: 5 },
    { id: 'ball1', name: 'Ball Pack (Set of 3)', ratePerHour: 2 },
    { id: 'shoes1', name: 'Court Shoes', ratePerHour: 8 },
  ],
};

export const BRAND_COLORS = {
  primary: '#CC4E22', // Terracotta
  secondary: '#FFFFFF', // White
};
