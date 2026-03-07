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

export interface LoanSchedule {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

export interface OrderItem {
  productTitle: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: number;
  orderNumber: number;
  externalOrderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  payableCode: string;
  merchantCode: string;
}

export interface Loan {
  id: number;
  staff: Staff;
  staffName?: string; // Computed property for full name
  type: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  status: string;
  schedules: LoanSchedule[];
  approvedAt: string | null;
  completedAt: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  merchantCode: string;
  payableCode: string;
  order: Order;
}

export interface LoanListResponse {
  status: string;
  data: Loan[];
  message?: string;
}

export interface LoanDetailResponse {
  status: string;
  data: Loan;
  message?: string;
}
