export interface CouponDetail {
  code: string;
  discountPercentage: number;
  discountAmount: number;
}

export interface Appointment {
  _id?: string;
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  // Address fields
  streetAddress: string;
  aptUnit?: string;
  city: string;
  state: string;
  zipCode: string;
  // Legacy address field for backward compatibility
  address?: string;
  // Vehicle info - simplified to make, model, year
  vehicleName: string;
  make: string;
  vehicleModel: string;
  year: string;
  // Legacy model field for backward compatibility
  model?: string;
  serviceType: string;
  vehicleCategory: string;
  date: string;
  timeSlot: string;
  promoCode?: string;
  coupons?: CouponDetail[];
  basePrice?: number;
  totalDiscount?: number;
  discountApplied: boolean;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt?: string;
}

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: "507f1f77bcf86cd799439011",
    id: "APT-001",
    fullName: "James Morrison",
    phone: "(555) 234-5678",
    email: "james@email.com",
    streetAddress: "456 Oak Ave",
    city: "Los Angeles",
    state: "California",
    zipCode: "90001",
    vehicleName: "Tesla Model 3",
    make: "Tesla",
    vehicleModel: "Model 3",
    year: "2024",
    serviceType: "Super Wax Detail",
    vehicleCategory: "Car",
    date: "2026-03-01",
    timeSlot: "10:00 AM",
    promoCode: "FIRST10",
    discountApplied: true,
    basePrice: 229.99,
    totalDiscount: 23.00,
    totalPrice: 206.99,
    status: "Confirmed",
    createdAt: "2026-02-20T10:30:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439012",
    id: "APT-002",
    fullName: "Sarah Kim",
    phone: "(555) 345-6789",
    email: "sarah@email.com",
    streetAddress: "789 Pine St",
    aptUnit: "Apt 4B",
    city: "San Francisco",
    state: "California",
    zipCode: "94102",
    vehicleName: "BMW X5",
    make: "BMW",
    vehicleModel: "X5",
    year: "2023",
    serviceType: "Interior Only",
    vehicleCategory: "SUV",
    date: "2026-03-02",
    timeSlot: "2:00 PM",
    discountApplied: false,
    totalPrice: 219.99,
    status: "Pending",
    createdAt: "2026-02-21T14:15:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439013",
    id: "APT-003",
    fullName: "Michael Rivera",
    phone: "(555) 456-7890",
    email: "michael@email.com",
    streetAddress: "321 Elm Blvd",
    city: "Houston",
    state: "Texas",
    zipCode: "77001",
    vehicleName: "Ford Mustang",
    make: "Ford",
    vehicleModel: "Mustang",
    year: "2022",
    serviceType: "Exterior Only",
    vehicleCategory: "Car",
    date: "2026-02-28",
    timeSlot: "9:00 AM",
    discountApplied: false,
    totalPrice: 179.99,
    status: "Completed",
    createdAt: "2026-02-18T09:00:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439014",
    id: "APT-004",
    fullName: "Emily Davis",
    phone: "(555) 567-8901",
    email: "emily@email.com",
    streetAddress: "654 Maple Dr",
    aptUnit: "Suite 200",
    city: "Phoenix",
    state: "Arizona",
    zipCode: "85001",
    vehicleName: "Toyota Highlander",
    make: "Toyota",
    vehicleModel: "Highlander",
    year: "2025",
    serviceType: "Super Wax Detail",
    vehicleCategory: "CrossOver",
    date: "2026-03-05",
    timeSlot: "11:00 AM",
    promoCode: "FIRST10",
    discountApplied: true,
    basePrice: 239.99,
    totalDiscount: 24.00,
    totalPrice: 215.99,
    status: "Pending",
    createdAt: "2026-02-23T16:45:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439015",
    id: "APT-005",
    fullName: "David Lee",
    phone: "(555) 678-9012",
    email: "david@email.com",
    streetAddress: "987 Cedar Ln",
    city: "Miami",
    state: "Florida",
    zipCode: "33101",
    vehicleName: "Chevrolet Suburban",
    make: "Chevrolet",
    vehicleModel: "Suburban",
    year: "2023",
    serviceType: "Interior Only",
    vehicleCategory: "X-Large",
    date: "2026-03-03",
    timeSlot: "3:00 PM",
    discountApplied: false,
    totalPrice: 239.99,
    status: "Cancelled",
    createdAt: "2026-02-22T11:20:00Z",
  },
  {
    _id: "507f1f77bcf86cd799439016",
    id: "APT-006",
    fullName: "Amanda Torres",
    phone: "(555) 789-0123",
    email: "amanda@email.com",
    streetAddress: "147 Birch Way",
    aptUnit: "Unit 12",
    city: "New York",
    state: "New York",
    zipCode: "10001",
    vehicleName: "Mercedes GLE",
    make: "Mercedes-Benz",
    vehicleModel: "GLE",
    year: "2024",
    serviceType: "Exterior Only",
    vehicleCategory: "SUV",
    date: "2026-03-04",
    timeSlot: "1:00 PM",
    discountApplied: false,
    totalPrice: 199.99,
    status: "Confirmed",
    createdAt: "2026-02-24T08:30:00Z",
  },
];
