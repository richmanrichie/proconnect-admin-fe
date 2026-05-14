export interface DashboardApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface StatByStatus {
  status: string;
  count: number;
  value?: number;
  color?: string;
}

export interface StatByType {
  type: string;
  count: number;
  amount: number;
}

// /dashboard/summary
export interface SuperAdminSummary {
  totalOrders: number;
  totalOrderValue: number;
  totalLoans: number;
  totalLoanAmount: number;
  totalDisbursed: number;
  totalRepaid: number;
  activeStaff: number;
  pendingApprovals: number;
}

// /dashboard/orders
export interface SuperAdminOrderStats {
  total: number;
  totalValue: number;
  averageOrderValue: number;
  byStatus: StatByStatus[];
  deliveryRate: number;
  financedOrdersCount: number;
  financedOrdersPercentage: number;
}

// /dashboard/loans
export interface SuperAdminLoanStats {
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

// /dashboard/payments
export interface SuperAdminPaymentStats {
  total: number;
  totalAmount: number;
  successfulPayments: number;
  successfulAmount: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
  byStatus: StatByStatus[];
}

// /dashboard/staff
export interface SuperAdminStaffStats {
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

// /dashboard/lenders
export interface TopLender {
  id: number;
  name: string;
  loanCount: number;
  totalDisbursed: number;
  activeLoans: number;
}

export interface SuperAdminLenderStats {
  totalLenders: number;
  localLenders: number;
  externalLenders: number;
  totalPortfolioValue: number;
  totalDisbursed: number;
  pendingRequests: number;
  approvedRequests: number;
  topLenders: TopLender[];
}

// /dashboard/organisations
export interface OrgRow {
  id: number;
  name: string;
  organisationId: string;
  industry: string;
  isLender: boolean;
  totalStaff: number;
  activeStaff: number;
  totalOrders: number;
  totalOrderValue: number;
  totalLoans: number;
  totalLoanAmount: number;
  totalDisbursed: number;
  outstandingBalance: number;
  defaultRate: number;
  overdueSchedules: number;
  pendingApprovals: number;
  lastActivityAt: string;
}

export interface SuperAdminOrgStats {
  total: number;
  organisations: OrgRow[];
}

// /dashboard/financials
export interface FinancialMonth {
  month: string;
  disbursed: number;
  repaid: number;
  principalRecovered: number;
  interestEarned: number;
}

export interface SuperAdminFinancials {
  totalDisbursed: number;
  totalRepaid: number;
  totalPrincipalRecovered: number;
  totalInterestEarned: number;
  outstandingPrincipal: number;
  byMonth: FinancialMonth[];
}

// /dashboard/repayments
export interface ScheduleItem {
  scheduleId: number;
  loanId: number;
  staffName: string;
  amountDue: number;
  dueDate: string;
  daysUntilDue?: number;
  daysOverdue?: number;
}

export interface SuperAdminRepayments {
  totalSchedules: number;
  paidSchedules: number;
  pendingSchedules: number;
  overdueSchedules: number;
  totalAmountDue: number;
  totalAmountPaid: number;
  totalOverdueAmount: number;
  onTimePaymentRate: number;
  upcomingDue: ScheduleItem[];
  overduePayments: ScheduleItem[];
}

// /dashboard/charts/orders
export interface ChartPoint {
  label: string;
  value: number;
  count: number;
}

// /dashboard/charts/loan-distribution
export interface LoanDistPoint {
  label: string;
  value: number;
  color: string;
}

// /dashboard/charts/comparison
export interface MonthSnapshot {
  month: string;
  orderCount: number;
  orderValue: number;
  loanCount: number;
  loanAmount: number;
}

export interface SuperAdminComparison {
  currentMonth: MonthSnapshot;
  previousMonth: MonthSnapshot;
  orderGrowth: number;
  loanGrowth: number;
  revenueGrowth: number;
}

// Aggregated shape passed to the component
export interface SuperAdminDashboardData {
  summary: SuperAdminSummary;
  orders: SuperAdminOrderStats;
  loans: SuperAdminLoanStats;
  payments: SuperAdminPaymentStats;
  staff: SuperAdminStaffStats;
  lenders: SuperAdminLenderStats;
  orgs: SuperAdminOrgStats;
  financials: SuperAdminFinancials;
  repayments: SuperAdminRepayments;
  orderTrend: ChartPoint[];
  loanDistribution: LoanDistPoint[];
  comparison: SuperAdminComparison;
}
