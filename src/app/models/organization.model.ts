export interface Organization {
  id?: number;
  name: string;
  organisationId: string;
  industry: string;
  address?: string;
  cacRegNumber?: string;
  taxId?: string;
  emailDomain?: string;
  logoUrl?: string;
  primaryEmail?: string;
  secondEmail?: string;
  thirdEmail?: string;
  isLender: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface OrganizationResponse {
  status: string;
  data: Organization | PagedResponse<Organization>;
  message: string;
}
