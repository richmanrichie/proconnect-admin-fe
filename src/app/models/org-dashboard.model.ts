export interface StatByStatus {
  status: string;
  count: number;
  value: number | null;
}

export interface StatByType {
  type: string;
  count: number;
  amount: number;
}

export interface TrendPoint {
  label: string;
  value: number;
  count: number;
}

export interface OrgDashboardSummary {
  totalStaff: number;
  activeStaff: number;
  totalOrders: number;
  totalOrderValue: number;
  totalLoans: number;
  totalLoanAmount: number;
  pendingApprovals: number;
}

export interface OrgStaffStats {
  total: number;
  active: number;
  suspended: number;
  pending: number;
  resigned: number;
  terminated: number;
  byStatus: StatByStatus[];
  withActiveLoans: number;
  withOrders: number;
  newThisMonth: number;
}

export interface OrgOrderStats {
  total: number;
  totalValue: number;
  averageOrderValue: number;
  byStatus: StatByStatus[];
  deliveryRate: number;
  financedOrdersCount: number;
  financedOrdersPercentage: number;
}

export interface OrgLoanStats {
  total: number;
  totalAmount: number;
  totalDisbursed: number;
  totalRepaid: number;
  outstandingAmount: number;
  averageLoanAmount: number;
  averageInterestRate: number;
  defaultRate: number;
  byStatus: StatByStatus[];
  byType: StatByType[];
  pendingApprovals: number;
  overdueSchedules: number;
}

export interface RecentOrder {
  id: number;
  orderNumber: number;
  staffName: string;
  totalPrice: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface RecentLoan {
  id: number;
  staffName: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  status: string;
  createdAt: string;
}

export interface OrgDashboardData {
  organisationId: number;
  organisationName: string;
  summary: OrgDashboardSummary;
  staffStats: OrgStaffStats;
  orderStats: OrgOrderStats;
  loanStats: OrgLoanStats;
  recentOrders: RecentOrder[];
  recentLoans: RecentLoan[];
  charts: {
    staffActivityTrend: TrendPoint[];
    orderTrend: TrendPoint[];
    loanTrend: TrendPoint[];
  };
}

export interface OrgDashboardResponse {
  status: string;
  data: OrgDashboardData;
  message: string;
}
