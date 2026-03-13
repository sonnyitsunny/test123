export interface Stock {
  id: string;
  code: string;
  name: string;
  currentPrice: number;
  changeRate: number;
  changeAmount: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sector: string;
}

export interface Holding {
  stockId: string;
  stock: Stock;
  quantity: number;
  avgPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossRate: number;
}

export interface Portfolio {
  totalInvestment: number;
  totalValue: number;
  totalProfitLoss: number;
  totalProfitLossRate: number;
  cash: number;
  holdings: Holding[];
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  profileImage?: string;
  totalReturn: number;
  totalReturnRate: number;
  followers: number;
  following: number;
  isFollowing: boolean;
  mentorId?: string;
}

export interface RankingUser extends User {
  rank: number;
  weeklyReturnRate: number;
  monthlyReturnRate: number;
  isMentorRequestSent?: boolean;
  portfolio?: Portfolio;
}

export interface TradeHistory {
  id: string;
  type: 'buy' | 'sell';
  stock: Stock;
  quantity: number;
  price: number;
  totalAmount: number;
  executedAt: string;
  profitLoss?: number;
  profitLossRate?: number;
  journalId?: string;
}

export interface Comment {
  id: string;
  journalId: string;
  authorId: string;
  authorNickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeJournal {
  id: string;
  tradeHistoryId: string;
  authorId: string;
  authorNickname: string;
  stock: Stock;
  tradeType: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  memo: string;
  createdAt: string;
  updatedAt: string;
  profitLoss?: number;
  profitLossRate?: number;
  comments: Comment[];
}

export type NotificationType =
  | 'mentor_request'
  | 'mentor_accepted'
  | 'mentor_rejected'
  | 'follow_trade'
  | 'order_executed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  mentorRequestData?: {
    requesterId: string;
    requesterNickname: string;
    status: 'pending' | 'accepted' | 'rejected';
  };
  tradeData?: {
    stockName: string;
    tradeType: 'buy' | 'sell';
    price: number;
    quantity: number;
    investorNickname: string;
    investorId: string;
  };
}

export interface MentorRelation {
  id: string;
  mentorId: string;
  mentorNickname: string;
  menteeId: string;
  menteeNickname: string;
  createdAt: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changeRate: number;
}

export interface PricePoint {
  time: string;
  price: number;
}
