
export type Location = 'All' | 'Lavington' | 'Kitisuru' | 'Waiyaki Way' | 'Muthiga';
export type PriceRange = 'All' | 'Under 50k' | '50k - 150k' | 'Above 150k';
export type BedCount = 'All' | '1' | '2' | '3' | '4+';

export interface Property {
  id: string;
  title: string;
  location: Location;
  price: number;
  bedrooms: number;
  isAvailable: boolean;
  imageUrl: string;
  type: string;
  description: string;
  amenities: string[];
}

export interface Filters {
  location: Location;
  priceRange: PriceRange;
  beds: BedCount;
  availableOnly: boolean;
}
