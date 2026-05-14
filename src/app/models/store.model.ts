export interface QTBStore {
  id: number;
  name: string;
  qtbId: string;
  initials?: string;
  urlEndpoint?: string;
  type?: string;
  merchantCode: string;
  payableCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  landmark?: string;
  lga?: string;
  city: string;
  state: string;
  country: string;
  status: string;
  isActive: boolean;
  fullWarehouseAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRequest {
  name: string;
  qtbId: string;
  merchantCode: string;
  payableCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

export interface OrganisationStore {
  id: number;
  organisationId: number;
  organisationName: string;
  store: QTBStore;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignStoreRequest {
  storeId: number;
  isDefault: boolean;
}

export interface StoreListResponse {
  status: string;
  data: QTBStore[];
  message?: string;
}

export interface StoreDetailResponse {
  status: string;
  data: QTBStore;
  message?: string;
}

export interface OrganisationStoreListResponse {
  status: string;
  data: OrganisationStore[];
  message?: string;
}
