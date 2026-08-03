// ----------------------------------------------------
// PHASE 1: DRIVE WORKSPACE TYPES
// ----------------------------------------------------
export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  isFolder: boolean;
  children?: DriveFile[];
  content?: string;
  extension?: string;
}

export interface ProjectAnalysis {
  summary: string;
  techStack: string[];
  architectureOverview: string;
  keyFiles: { name: string; purpose: string }[];
  fileDistribution: { type: string; count: number; percentage: number }[];
  suggestedFeatures: { title: string; description: string; priority: 'High' | 'Medium' | 'Low' }[];
  codeQualityNotes: string[];
}

export interface FeatureTask {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  priority: 'High' | 'Medium' | 'Low';
  suggestedFiles: string[];
  createdAt: string;
}

export interface UserAuth {
  isAuthenticated: boolean;
  userEmail?: string;
  userName?: string;
  userPicture?: string;
  accessToken?: string;
  role?: 'Admin' | 'Teacher' | 'User';
  userId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedFiles?: string[];
}

// ----------------------------------------------------
// PHASE 2: ENTERPRISE MODULE TYPES (MODULES 1 TO 10)
// ----------------------------------------------------

// MODULE 1: MULTILINGUAL
export type LanguageCode = 'fa' | 'en' | 'ar';

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
  isDefault: boolean;
}

// MODULE 2: AI REALTIME LIVE CLASS & SUBTITLES
export interface SubtitleChunk {
  id: string;
  speaker: string;
  originalText: string;
  translatedTextFa: string;
  translatedTextEn: string;
  translatedTextAr: string;
  timestamp: string;
  confidence: number;
}

export interface LiveClassSession {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  status: 'live' | 'ended';
  startedAt: string;
  transcripts: SubtitleChunk[];
}

// MODULE 3: TEACHER WHITE LABEL
export interface TeacherWhiteLabelConfig {
  teacherId: string;
  teacherName: string;
  subdomain: string;
  customDomain?: string;
  logoUrl: string;
  brandColor: string;
  secondaryColor: string;
  fontFamily: string;
  seoTitle: string;
  seoDescription: string;
  socialLinks: {
    telegram?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  customMenuItems: { title: string; url: string }[];
  apkConfig: {
    appName: string;
    packageName: string;
    splashScreenUrl: string;
    version: string;
    lastGeneratedAt?: string;
  };
  subscriptionStatus: 'Active' | 'Expired' | 'Pending';
  subscriptionExpiresAt: string;
  coursesCount: number;
  articlesCount: number;
  videosCount: number;
}

// MODULE 4: WALLET & FINANCIAL LEDGER
export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'COURSE_PURCHASE'
  | 'PACKAGE_PURCHASE'
  | 'REFERRAL_COMMISSION'
  | 'SHARE_POOL_DIVIDEND'
  | 'SUBSCRIPTION_FEE';

export interface TransactionLedger {
  id: string;
  userId: string;
  userName: string;
  amountToman: number;
  sharesChanged: number;
  type: TransactionType;
  description: string;
  referenceId: string;
  createdDate: string;
  balanceAfterToman: number;
  sharesAfter: number;
}

export interface UserWallet {
  userId: string;
  cashBalanceToman: number;
  shareBalanceCount: number;
  totalDividendsReceivedToman: number;
  totalReferralCommissionsToman: number;
  personalPurchasesToman: number;
  networkPurchasesToman: number;
}

// MODULE 5: SHARE POOL
export interface SharePoolRule {
  coursePercentage: number;
  walletChargePercentage: number;
  subscriptionPercentage: number;
  membershipPercentage: number;
}

export interface SharePoolState {
  totalPoolBalanceToman: number;
  totalSharesInCirculation: number;
  lastDistributionDate?: string;
  rulePercentages: SharePoolRule;
}

export interface SharePoolDividendRecord {
  id: string;
  distributionDate: string;
  totalDistributedAmountToman: number;
  perShareDividendToman: number;
  activeShareholdersCount: number;
  triggeredBy: 'AutomatedCron' | 'ManualAdmin';
}

// MODULE 6: WALLET PACKAGES
export interface WalletPackage {
  id: string;
  priceToman: number;
  shareCount: number;
  titleFa: string;
  titleEn: string;
  titleAr: string;
  isActive: boolean;
  displayOrder: number;
  badgeTag?: string;
}

// MODULE 7: REFERRAL NETWORK TREE
export interface ReferralNode {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  parentId?: string;
  level: number;
  directCount: number;
  totalNetworkCount: number;
  personalVolumeToman: number;
  networkVolumeToman: number;
  children?: ReferralNode[];
}

export interface ReferralCommissionLevel {
  levelNumber: number;
  commissionPercentage: number;
}

// MODULE 8: USER DASHBOARD SUMMARY
export interface UserDashboardData {
  wallet: UserWallet;
  monthlyDividendProfitToman: number;
  directReferralsCount: number;
  totalNetworkCount: number;
  recentTransactions: TransactionLedger[];
  recentNotifications: { id: string; title: string; message: string; date: string; isRead: boolean }[];
  monthlyRevenueChart: { month: string; profitToman: number; commissionToman: number }[];
}

// MODULE 9: GOFTINO LIVE CHAT
export interface GoftinoSettings {
  isEnabled: boolean;
  widgetId: string;
  scriptUrl: string;
  autoOpen: boolean;
}

// MODULE 10: ADMIN PANEL DATA & SYSTEM LOGS
export interface SystemAuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface BackgroundJobStatus {
  id: string;
  jobName: string;
  cronSchedule: string;
  lastRunAt: string;
  nextRunAt: string;
  status: 'IDLE' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  executionCount: number;
}
