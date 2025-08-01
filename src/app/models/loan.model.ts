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
