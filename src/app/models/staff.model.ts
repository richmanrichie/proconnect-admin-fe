export type StaffStatus = 'ACTIVE' | 'INACTIVE';

export type StaffIdType = 'NATIONAL_ID' | 'PASSPORT' | 'DRIVERS_LICENSE';

export interface StaffAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  idType: StaffIdType;
  organisationId: string;
  address: StaffAddress[] | any[]; // Keep flexible as backend returns []
  status: StaffStatus;
  kycFolder: string;
}

export interface StaffResponse {
  status: string;
  data: Staff | Staff[];
  message: string;
}

