export interface OrderItem {
  productTitle: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  countryCallingCode: string;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  idType: string;
  organisationId: string;
  address: Address[];
  status: string;
  kycFolder: string;
}

export interface OrderLoan {
  loanAmount: number;
  tenureMonths: number;
  interestRate: number;
}

export interface Order {
  id: number;
  orderNumber: number;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
  staff: Staff;
  loan?: OrderLoan;
  // For list view compatibility
  itemsCount?: number;
  imageUrl?: string;
  orderName?: string;
  staffName?: string;
}

export interface OrderListResponse {
  status: string;
  data: Order[];
  message?: string;
}

export interface OrderDetailResponse {
  status: string;
  data: Order;
  message?: string;
}
