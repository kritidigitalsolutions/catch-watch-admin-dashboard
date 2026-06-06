// ===== DASHBOARD KPI STATS =====
export const dashboardStats = {
  totalUsers:      { value: 0, trend: 0, trendUp: true },
  activeUsers:     { value: 0, trend: 0, trendUp: true },
  subscribedUsers: { value: 0, trend: 0, trendUp: true },
  nonSubscribed:   { value: 0, trend: 0, trendUp: false },
  expiringSoon:    { value: 0, trend: 0, trendUp: true },
  todayRevenue:    { value: 0, trend: 0, trendUp: true },
  monthlyRevenue:  { value: 0, trend: 0, trendUp: true },
  totalContent:    { value: 0, trend: 0, trendUp: true },
};

// ===== REVENUE DATA =====
export const revenueDataDaily   = [];
export const revenueDataWeekly  = [];
export const revenueDataMonthly = [];
export const revenueDataYearly  = [];

// ===== USER GROWTH DATA =====
export const userGrowthData = [];

// ===== SUBSCRIPTION DONUT =====
export const subscriptionDistribution = [];

// ===== RECENT USERS =====
export const recentUsers = [];

// ===== FULL USER LIST =====
export const allUsers = [];

// ===== CONTENT - MOVIES =====
export const movies = [];

// ===== CONTENT - WEB SERIES =====
export const webSeries = [];

// ===== CONTENT - SHORT DRAMAS =====
export const shortDramas = [];

// ===== SUBSCRIPTION PLANS =====
export const subscriptionPlans = [];

// ===== PROMO CODES =====
export const promoCodes = [];

// ===== USER PLANS =====
export const userPlans = [];

// ===== NOTIFICATIONS =====
export const notifications = [];

// ===== SUPPORT TICKETS =====
export const supportTickets = [];

// ===== LEGAL CONTENT =====
export const legalContent = {
  privacy: { title: 'Privacy Policy',       lastUpdated: '', content: '' },
  terms:   { title: 'Terms & Conditions',   lastUpdated: '', content: '' },
  refund:  { title: 'Refund Policy',        lastUpdated: '', content: '' },
  about:   { title: 'About Catch & Watch',  lastUpdated: '', content: '' },
};

// ===== ADMIN PROFILE =====
export const adminProfile = {
  name:       '',
  email:      '',
  avatar:     'AU',
  role:       'Super Admin',
  joinedDate: '',
};
