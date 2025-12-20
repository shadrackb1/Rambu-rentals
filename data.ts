
import { Property } from './types';

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 3 Bedroom Apartment',
    location: 'Lavington',
    price: 125000,
    bedrooms: 3,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    description: 'A stunning contemporary apartment located in the heart of Lavington. This unit offers spacious living areas, high-end finishes, and a serene balcony view. Perfect for families looking for a balance of luxury and comfort.',
    amenities: ['24/7 Security', 'Elevator', 'Gym', 'Ample Parking', 'Borehole Water', 'Backup Generator']
  },
  {
    id: '2',
    title: 'Executive 2 Bedroom Unit',
    location: 'Lavington',
    price: 85000,
    bedrooms: 2,
    isAvailable: false,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    description: 'Elegantly furnished 2-bedroom unit in a secure gated community. Ideal for professionals or small families.',
    amenities: ['CCTV Surveillance', 'Balcony', 'Modern Kitchen', 'High Speed Internet Ready']
  },
  {
    id: '3',
    title: 'Kitisuru Heights Mansion',
    location: 'Kitisuru',
    price: 450000,
    bedrooms: 5,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    type: 'Villa',
    description: 'An architectural masterpiece in the prestigious Kitisuru area. This 5-bedroom mansion sits on a half-acre lot with beautifully manicured gardens, a private swimming pool, and servant quarters.',
    amenities: ['Private Pool', 'Sprawling Garden', 'Home Office', 'Gated Security', 'Solar Water Heating', 'Staff Quarters']
  },
  {
    id: '5',
    title: 'Budget Studio Muthiga',
    location: 'Muthiga',
    price: 35000,
    bedrooms: 1,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    type: 'Studio',
    description: 'Conveniently located studio along Waiyaki Way. Perfect for commuters looking for an affordable yet modern living space with easy access to the city.',
    amenities: ['Secure Parking', 'Rooftop Access', 'Tokens Meter', 'Reliable Water Supply']
  },
  {
    id: '12',
    title: 'Kitisuru 5BR Estate',
    location: 'Kitisuru',
    price: 550000,
    bedrooms: 5,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    type: 'Mansion',
    description: 'The pinnacle of East African living. This expansive estate features a grand entrance, multiple living rooms, and a state-of-the-art kitchen. Luxury defined.',
    amenities: ['Smart Home System', 'Wine Cellar', 'Infinity Pool', 'CCTV Monitoring', 'Electric Fencing']
  }
];
