// US States with random coordinates for vendor locations
// Each location has a 40km radius of coverage

export interface VendorLocation {
  id: string;
  state: string;
  lat: number;
  lng: number;
  radiusKm: number;
  city: string;
}

// Random coordinates spread across all 50 US states
export const vendorLocations: VendorLocation[] = [
  { id: 'AL', state: 'Alabama', lat: 32.8067, lng: -86.7113, radiusKm: 40, city: 'Montgomery' },
  { id: 'AK', state: 'Alaska', lat: 61.2181, lng: -149.9003, radiusKm: 40, city: 'Anchorage' },
  { id: 'AZ', state: 'Arizona', lat: 33.4484, lng: -112.0742, radiusKm: 40, city: 'Phoenix' },
  { id: 'AR', state: 'Arkansas', lat: 34.7465, lng: -92.2896, radiusKm: 40, city: 'Little Rock' },
  { id: 'CA', state: 'California', lat: 34.0522, lng: -118.2437, radiusKm: 40, city: 'Los Angeles' },
  { id: 'CO', state: 'Colorado', lat: 39.7392, lng: -104.9903, radiusKm: 40, city: 'Denver' },
  { id: 'CT', state: 'Connecticut', lat: 41.7658, lng: -72.6734, radiusKm: 40, city: 'Hartford' },
  { id: 'DE', state: 'Delaware', lat: 39.1582, lng: -75.5244, radiusKm: 40, city: 'Wilmington' },
  { id: 'FL', state: 'Florida', lat: 28.2196, lng: -81.3944, radiusKm: 40, city: 'Orlando' },
  { id: 'GA', state: 'Georgia', lat: 33.7490, lng: -84.3880, radiusKm: 40, city: 'Atlanta' },
  { id: 'HI', state: 'Hawaii', lat: 21.3099, lng: -157.8581, radiusKm: 40, city: 'Honolulu' },
  { id: 'ID', state: 'Idaho', lat: 43.6150, lng: -116.2023, radiusKm: 40, city: 'Boise' },
  { id: 'IL', state: 'Illinois', lat: 41.8781, lng: -87.6298, radiusKm: 40, city: 'Chicago' },
  { id: 'IN', state: 'Indiana', lat: 39.7684, lng: -86.1581, radiusKm: 40, city: 'Indianapolis' },
  { id: 'IA', state: 'Iowa', lat: 41.5868, lng: -93.6250, radiusKm: 40, city: 'Des Moines' },
  { id: 'KS', state: 'Kansas', lat: 39.0473, lng: -95.6752, radiusKm: 40, city: 'Topeka' },
  { id: 'KY', state: 'Kentucky', lat: 38.2527, lng: -85.7585, radiusKm: 40, city: 'Louisville' },
  { id: 'LA', state: 'Louisiana', lat: 30.2271, lng: -92.4406, radiusKm: 40, city: 'Baton Rouge' },
  { id: 'ME', state: 'Maine', lat: 44.3106, lng: -69.7795, radiusKm: 40, city: 'Portland' },
  { id: 'MD', state: 'Maryland', lat: 39.2904, lng: -76.6122, radiusKm: 40, city: 'Baltimore' },
  { id: 'MA', state: 'Massachusetts', lat: 42.3601, lng: -71.0589, radiusKm: 40, city: 'Boston' },
  { id: 'MI', state: 'Michigan', lat: 42.7335, lng: -84.5555, radiusKm: 40, city: 'Lansing' },
  { id: 'MN', state: 'Minnesota', lat: 44.9537, lng: -93.0900, radiusKm: 40, city: 'Minneapolis' },
  { id: 'MS', state: 'Mississippi', lat: 32.2988, lng: -90.1848, radiusKm: 40, city: 'Jackson' },
  { id: 'MO', state: 'Missouri', lat: 38.6270, lng: -90.1994, radiusKm: 40, city: 'St. Louis' },
  { id: 'MT', state: 'Montana', lat: 46.5891, lng: -112.0391, radiusKm: 40, city: 'Helena' },
  { id: 'NE', state: 'Nebraska', lat: 40.8258, lng: -96.7852, radiusKm: 40, city: 'Lincoln' },
  { id: 'NV', state: 'Nevada', lat: 36.1699, lng: -115.1398, radiusKm: 40, city: 'Las Vegas' },
  { id: 'NH', state: 'New Hampshire', lat: 43.2081, lng: -71.5376, radiusKm: 40, city: 'Manchester' },
  { id: 'NJ', state: 'New Jersey', lat: 40.2206, lng: -74.7597, radiusKm: 40, city: 'Trenton' },
  { id: 'NM', state: 'New Mexico', lat: 35.0844, lng: -106.6504, radiusKm: 40, city: 'Albuquerque' },
  { id: 'NY', state: 'New York', lat: 40.7128, lng: -74.0060, radiusKm: 40, city: 'New York City' },
  { id: 'NC', state: 'North Carolina', lat: 35.7796, lng: -78.6382, radiusKm: 40, city: 'Raleigh' },
  { id: 'ND', state: 'North Dakota', lat: 46.8083, lng: -100.7837, radiusKm: 40, city: 'Bismarck' },
  { id: 'OH', state: 'Ohio', lat: 39.9612, lng: -82.9988, radiusKm: 40, city: 'Columbus' },
  { id: 'OK', state: 'Oklahoma', lat: 35.4676, lng: -97.5164, radiusKm: 40, city: 'Oklahoma City' },
  { id: 'OR', state: 'Oregon', lat: 45.5152, lng: -122.6784, radiusKm: 40, city: 'Portland' },
  { id: 'PA', state: 'Pennsylvania', lat: 40.2732, lng: -76.8867, radiusKm: 40, city: 'Harrisburg' },
  { id: 'RI', state: 'Rhode Island', lat: 41.8240, lng: -71.4128, radiusKm: 40, city: 'Providence' },
  { id: 'SC', state: 'South Carolina', lat: 34.0007, lng: -81.0348, radiusKm: 40, city: 'Columbia' },
  { id: 'SD', state: 'South Dakota', lat: 44.3683, lng: -100.3364, radiusKm: 40, city: 'Pierre' },
  { id: 'TN', state: 'Tennessee', lat: 36.1627, lng: -86.7816, radiusKm: 40, city: 'Nashville' },
  { id: 'TX', state: 'Texas', lat: 30.2672, lng: -97.7431, radiusKm: 40, city: 'Austin' },
  { id: 'UT', state: 'Utah', lat: 40.7608, lng: -111.8910, radiusKm: 40, city: 'Salt Lake City' },
  { id: 'VT', state: 'Vermont', lat: 44.2601, lng: -72.5754, radiusKm: 40, city: 'Montpelier' },
  { id: 'VA', state: 'Virginia', lat: 37.5407, lng: -77.4360, radiusKm: 40, city: 'Richmond' },
  { id: 'WA', state: 'Washington', lat: 47.6062, lng: -122.3321, radiusKm: 40, city: 'Seattle' },
  { id: 'WV', state: 'West Virginia', lat: 38.3498, lng: -81.6326, radiusKm: 40, city: 'Charleston' },
  { id: 'WI', state: 'Wisconsin', lat: 43.0731, lng: -89.4012, radiusKm: 40, city: 'Madison' },
  { id: 'WY', state: 'Wyoming', lat: 41.1400, lng: -104.8202, radiusKm: 40, city: 'Cheyenne' },
];
