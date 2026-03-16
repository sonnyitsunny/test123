import type {
  Stock, Holding, Portfolio, User, RankingUser,
  TradeHistory, TradeJournal, Comment, Notification,
  MentorRelation, MarketIndex, PricePoint, PendingOrder
} from '@/types';

export const MARKET_INDICES: MarketIndex[] = [
  { name: 'KOSPI', value: 2648.73, change: 18.43, changeRate: 0.70 },
  { name: 'KOSDAQ', value: 871.26, change: -4.12, changeRate: -0.47 },
  { name: 'USD/KRW', value: 1342.50, change: -2.50, changeRate: -0.19 },
];

export const STOCKS: Stock[] = [
  { id: '1', code: '005930', name: '삼성전자', currentPrice: 73400, changeRate: 1.24, changeAmount: 900, volume: 12843200, marketCap: 438200000000000, high: 73900, low: 72300, open: 72500, previousClose: 72500, sector: '반도체' },
  { id: '2', code: '000660', name: 'SK하이닉스', currentPrice: 192500, changeRate: 2.39, changeAmount: 4500, volume: 3241800, marketCap: 139800000000000, high: 193500, low: 188000, open: 188200, previousClose: 188000, sector: '반도체' },
  { id: '3', code: '373220', name: 'LG에너지솔루션', currentPrice: 298000, changeRate: -0.83, changeAmount: -2500, volume: 542100, marketCap: 69800000000000, high: 301000, low: 296500, open: 300500, previousClose: 300500, sector: '2차전지' },
  { id: '4', code: '207940', name: '삼성바이오로직스', currentPrice: 978000, changeRate: 0.51, changeAmount: 5000, volume: 98400, marketCap: 65200000000000, high: 980000, low: 970000, open: 973000, previousClose: 973000, sector: '바이오' },
  { id: '5', code: '005380', name: '현대차', currentPrice: 241500, changeRate: 1.68, changeAmount: 4000, volume: 845200, marketCap: 51500000000000, high: 242500, low: 237500, open: 237500, previousClose: 237500, sector: '자동차' },
  { id: '6', code: '000270', name: '기아', currentPrice: 108500, changeRate: 2.07, changeAmount: 2200, volume: 1243500, marketCap: 43800000000000, high: 109000, low: 106300, open: 106300, previousClose: 106300, sector: '자동차' },
  { id: '7', code: '005490', name: 'POSCO홀딩스', currentPrice: 378500, changeRate: -1.17, changeAmount: -4500, volume: 412600, marketCap: 32100000000000, high: 384000, low: 377000, open: 383000, previousClose: 383000, sector: '철강' },
  { id: '8', code: '006400', name: '삼성SDI', currentPrice: 312000, changeRate: -2.19, changeAmount: -7000, volume: 387200, marketCap: 21500000000000, high: 320000, low: 310500, open: 319000, previousClose: 319000, sector: '2차전지' },
  { id: '9', code: '051910', name: 'LG화학', currentPrice: 298500, changeRate: -0.50, changeAmount: -1500, volume: 298700, marketCap: 21000000000000, high: 301000, low: 297000, open: 300000, previousClose: 300000, sector: '화학' },
  { id: '10', code: '035420', name: 'NAVER', currentPrice: 192000, changeRate: 0.79, changeAmount: 1500, volume: 672400, marketCap: 31500000000000, high: 193500, low: 190000, open: 190500, previousClose: 190500, sector: 'IT' },
  { id: '11', code: '035720', name: '카카오', currentPrice: 44850, changeRate: -1.21, changeAmount: -550, volume: 2341200, marketCap: 19500000000000, high: 45400, low: 44600, open: 45400, previousClose: 45400, sector: 'IT' },
  { id: '12', code: '105560', name: 'KB금융', currentPrice: 87200, changeRate: 0.92, changeAmount: 800, volume: 723400, marketCap: 34800000000000, high: 87500, low: 86400, open: 86400, previousClose: 86400, sector: '금융' },
  { id: '13', code: '055550', name: '신한지주', currentPrice: 54900, changeRate: 1.29, changeAmount: 700, volume: 1124500, marketCap: 26100000000000, high: 55100, low: 54200, open: 54200, previousClose: 54200, sector: '금융' },
  { id: '14', code: '086790', name: '하나금융지주', currentPrice: 68400, changeRate: 0.74, changeAmount: 500, volume: 543200, marketCap: 19800000000000, high: 68700, low: 67900, open: 67900, previousClose: 67900, sector: '금융' },
  { id: '15', code: '017670', name: 'SK텔레콤', currentPrice: 56500, changeRate: 0.27, changeAmount: 150, volume: 412300, marketCap: 13100000000000, high: 56700, low: 56200, open: 56350, previousClose: 56350, sector: '통신' },
  { id: '16', code: '030200', name: 'KT', currentPrice: 42350, changeRate: -0.35, changeAmount: -150, volume: 781200, marketCap: 10800000000000, high: 42600, low: 42200, open: 42500, previousClose: 42500, sector: '통신' },
  { id: '17', code: '066570', name: 'LG전자', currentPrice: 95600, changeRate: 1.49, changeAmount: 1400, volume: 612400, marketCap: 15600000000000, high: 96000, low: 94200, open: 94200, previousClose: 94200, sector: '가전' },
  { id: '18', code: '028260', name: '삼성물산', currentPrice: 148000, changeRate: 0.68, changeAmount: 1000, volume: 234100, marketCap: 28100000000000, high: 148500, low: 147000, open: 147000, previousClose: 147000, sector: '건설' },
  { id: '19', code: '068270', name: '셀트리온', currentPrice: 178500, changeRate: 2.29, changeAmount: 4000, volume: 987400, marketCap: 24300000000000, high: 179500, low: 174500, open: 174500, previousClose: 174500, sector: '바이오' },
  { id: '20', code: '247540', name: '에코프로비엠', currentPrice: 148500, changeRate: -3.19, changeAmount: -4900, volume: 1234500, marketCap: 13200000000000, high: 154000, low: 147500, open: 153400, previousClose: 153400, sector: '2차전지' },
];

export const MY_USER: User = {
  id: 'me',
  nickname: '투자왕김철수',
  email: 'kim@example.com',
  totalReturn: 1250000,
  totalReturnRate: 12.5,
  followers: 42,
  following: 3,
  isFollowing: false,
  mentorId: 'r1',
};

export const MY_PORTFOLIO: Portfolio = {
  totalInvestment: 10000000,
  totalValue: 11250000,
  totalProfitLoss: 1250000,
  totalProfitLossRate: 12.5,
  cash: 2140000,
  holdings: [
    { stockId: '1', stock: STOCKS[0], quantity: 15, avgPrice: 68200, currentValue: 1101000, profitLoss: 78000, profitLossRate: 7.62 },
    { stockId: '2', stock: STOCKS[1], quantity: 5, avgPrice: 174000, currentValue: 962500, profitLoss: 92500, profitLossRate: 10.63 },
    { stockId: '10', stock: STOCKS[9], quantity: 12, avgPrice: 178000, currentValue: 2304000, profitLoss: 168000, profitLossRate: 7.87 },
    { stockId: '5', stock: STOCKS[4], quantity: 8, avgPrice: 225000, currentValue: 1932000, profitLoss: 132000, profitLossRate: 7.33 },
    { stockId: '12', stock: STOCKS[11], quantity: 35, avgPrice: 81500, currentValue: 3052000, profitLoss: 252500, profitLossRate: 9.04 },
    { stockId: '19', stock: STOCKS[18], quantity: 4, avgPrice: 162000, currentValue: 714000, profitLoss: 66000, profitLossRate: 10.19 },
  ],
};

// 내 멘토 (주식마스터)
export const MY_MENTOR: User = {
  id: 'r1',
  nickname: '주식마스터',
  email: 'master@example.com',
  totalReturn: 18500000,
  totalReturnRate: 48.3,
  followers: 542,
  following: 5,
  isFollowing: true,
};

export const MENTOR_PORTFOLIO: Portfolio = {
  totalInvestment: 50000000,
  totalValue: 74150000,
  totalProfitLoss: 24150000,
  totalProfitLossRate: 48.3,
  cash: 5200000,
  holdings: [
    { stockId: '1', stock: STOCKS[0], quantity: 100, avgPrice: 58000, currentValue: 7340000, profitLoss: 1540000, profitLossRate: 26.55 },
    { stockId: '2', stock: STOCKS[1], quantity: 50, avgPrice: 140000, currentValue: 9625000, profitLoss: 2625000, profitLossRate: 37.50 },
    { stockId: '4', stock: STOCKS[3], quantity: 10, avgPrice: 820000, currentValue: 9780000, profitLoss: 1580000, profitLossRate: 19.27 },
    { stockId: '19', stock: STOCKS[18], quantity: 30, avgPrice: 125000, currentValue: 5355000, profitLoss: 1605000, profitLossRate: 42.80 },
    { stockId: '5', stock: STOCKS[4], quantity: 40, avgPrice: 198000, currentValue: 9660000, profitLoss: 1740000, profitLossRate: 21.97 },
  ],
};

// 나의 멘티 목록
export const MY_MENTEES: User[] = [
  { id: 'mentee1', nickname: '초보투자자', email: 'beginner@example.com', totalReturn: 120000, totalReturnRate: 3.2, followers: 5, following: 2, isFollowing: false },
  { id: 'mentee2', nickname: '주식공부중', email: 'study@example.com', totalReturn: 85000, totalReturnRate: 2.1, followers: 2, following: 1, isFollowing: false },
  { id: 'mentee3', nickname: '부자되자', email: 'rich@example.com', totalReturn: 450000, totalReturnRate: 8.7, followers: 18, following: 4, isFollowing: false },
];

export const MENTEE_PORTFOLIOS: Record<string, Portfolio> = {
  mentee1: {
    totalInvestment: 3000000,
    totalValue: 3096000,
    totalProfitLoss: 96000,
    totalProfitLossRate: 3.2,
    cash: 1200000,
    holdings: [
      { stockId: '1', stock: STOCKS[0], quantity: 10, avgPrice: 70000, currentValue: 734000, profitLoss: 34000, profitLossRate: 4.86 },
      { stockId: '12', stock: STOCKS[11], quantity: 15, avgPrice: 84000, currentValue: 1308000, profitLoss: 48000, profitLossRate: 3.81 },
    ],
  },
  mentee2: {
    totalInvestment: 2000000,
    totalValue: 2042000,
    totalProfitLoss: 42000,
    totalProfitLossRate: 2.1,
    cash: 900000,
    holdings: [
      { stockId: '10', stock: STOCKS[9], quantity: 6, avgPrice: 190000, currentValue: 1152000, profitLoss: 12000, profitLossRate: 1.05 },
    ],
  },
  mentee3: {
    totalInvestment: 5000000,
    totalValue: 5435000,
    totalProfitLoss: 435000,
    totalProfitLossRate: 8.7,
    cash: 1500000,
    holdings: [
      { stockId: '2', stock: STOCKS[1], quantity: 8, avgPrice: 170000, currentValue: 1540000, profitLoss: 180000, profitLossRate: 13.24 },
      { stockId: '5', stock: STOCKS[4], quantity: 5, avgPrice: 228000, currentValue: 1207500, profitLoss: 67500, profitLossRate: 5.92 },
      { stockId: '19', stock: STOCKS[18], quantity: 5, avgPrice: 165000, currentValue: 892500, profitLoss: 67500, profitLossRate: 8.18 },
    ],
  },
};

export const MENTOR_RELATION: MentorRelation = {
  id: 'mr1',
  mentorId: 'r1',
  mentorNickname: '주식마스터',
  menteeId: 'me',
  menteeNickname: '투자왕김철수',
  createdAt: '2025-02-01T00:00:00',
};

export const RANKING_USERS: RankingUser[] = [
  { id: 'r1', nickname: '주식마스터', email: '', totalReturn: 18500000, totalReturnRate: 48.3, followers: 542, following: 5, isFollowing: true, rank: 1, weeklyReturnRate: 8.2, monthlyReturnRate: 18.4 },
  { id: 'r2', nickname: '주식고수박영희', email: '', totalReturn: 5820000, totalReturnRate: 34.8, followers: 218, following: 12, isFollowing: true, rank: 2, weeklyReturnRate: 5.7, monthlyReturnRate: 12.1 },
  { id: 'r3', nickname: '황금손투자자', email: '', totalReturn: 9200000, totalReturnRate: 31.2, followers: 387, following: 8, isFollowing: false, rank: 3, weeklyReturnRate: 4.9, monthlyReturnRate: 10.8 },
  { id: 'r4', nickname: '코스피200왕', email: '', totalReturn: 7100000, totalReturnRate: 27.5, followers: 156, following: 6, isFollowing: false, rank: 4, weeklyReturnRate: 3.8, monthlyReturnRate: 9.4 },
  { id: 'r5', nickname: '반도체전문가', email: '', totalReturn: 4300000, totalReturnRate: 23.8, followers: 98, following: 3, isFollowing: false, rank: 5, weeklyReturnRate: 3.2, monthlyReturnRate: 8.7, isMentorRequestSent: true },
  { id: 'r6', nickname: '배당주러버', email: '', totalReturn: 3800000, totalReturnRate: 21.4, followers: 124, following: 9, isFollowing: false, rank: 6, weeklyReturnRate: 2.9, monthlyReturnRate: 7.2 },
  { id: 'r7', nickname: '성장주헌터', email: '', totalReturn: 2900000, totalReturnRate: 18.9, followers: 76, following: 4, isFollowing: false, rank: 7, weeklyReturnRate: 2.4, monthlyReturnRate: 6.8 },
  { id: 'r8', nickname: '가치투자자', email: '', totalReturn: 2400000, totalReturnRate: 16.3, followers: 63, following: 7, isFollowing: false, rank: 8, weeklyReturnRate: 1.8, monthlyReturnRate: 5.9 },
  { id: 'r9', nickname: '퀀트투자봇', email: '', totalReturn: 1900000, totalReturnRate: 14.7, followers: 45, following: 2, isFollowing: false, rank: 9, weeklyReturnRate: 1.5, monthlyReturnRate: 4.8 },
  { id: 'r10', nickname: '모멘텀라이더', email: '', totalReturn: 1600000, totalReturnRate: 13.2, followers: 38, following: 1, isFollowing: false, rank: 10, weeklyReturnRate: 1.3, monthlyReturnRate: 4.1 },
  { id: 'me', nickname: '투자왕김철수', email: 'kim@example.com', totalReturn: 1250000, totalReturnRate: 12.5, followers: 42, following: 3, isFollowing: false, rank: 11, weeklyReturnRate: 1.1, monthlyReturnRate: 3.7 },
];

export const TRADE_HISTORIES: TradeHistory[] = [
  { id: 'th1', type: 'buy', stock: STOCKS[0], quantity: 5, price: 68200, totalAmount: 341000, executedAt: '2025-03-08T09:32:00', journalId: 'j1' },
  { id: 'th2', type: 'sell', stock: STOCKS[9], quantity: 3, price: 196000, totalAmount: 588000, executedAt: '2025-03-07T14:15:00', profitLoss: 54000, profitLossRate: 10.17, journalId: 'j2' },
  { id: 'th3', type: 'buy', stock: STOCKS[1], quantity: 2, price: 174000, totalAmount: 348000, executedAt: '2025-03-06T10:08:00', journalId: 'j3' },
  { id: 'th4', type: 'sell', stock: STOCKS[11], quantity: 10, price: 84500, totalAmount: 845000, executedAt: '2025-03-05T11:42:00', profitLoss: 30000, profitLossRate: 3.68 },
  { id: 'th5', type: 'buy', stock: STOCKS[4], quantity: 3, price: 232000, totalAmount: 696000, executedAt: '2025-03-04T09:55:00', journalId: 'j4' },
  { id: 'th6', type: 'sell', stock: STOCKS[18], quantity: 2, price: 168000, totalAmount: 336000, executedAt: '2025-03-03T15:20:00', profitLoss: 12000, profitLossRate: 3.70 },
  { id: 'th7', type: 'buy', stock: STOCKS[11], quantity: 15, price: 81500, totalAmount: 1222500, executedAt: '2025-02-28T10:11:00', journalId: 'j5' },
  { id: 'th8', type: 'buy', stock: STOCKS[18], quantity: 4, price: 162000, totalAmount: 648000, executedAt: '2025-02-25T09:48:00' },
  { id: 'th9', type: 'sell', stock: STOCKS[2], quantity: 1.5, price: 301000, totalAmount: 451500, executedAt: '2025-02-20T13:30:00', profitLoss: -7500, profitLossRate: -1.64, journalId: 'j6' },
  { id: 'th10', type: 'buy', stock: STOCKS[9], quantity: 12, price: 178000, totalAmount: 2136000, executedAt: '2025-02-15T09:22:00', journalId: 'j7' },
];

export const MENTOR_TRADE_HISTORIES: TradeHistory[] = [
  { id: 'mth1', type: 'buy', stock: STOCKS[1], quantity: 20, price: 185000, totalAmount: 3700000, executedAt: '2025-03-09T09:15:00', journalId: 'mj1' },
  { id: 'mth2', type: 'sell', stock: STOCKS[0], quantity: 30, price: 74000, totalAmount: 2220000, executedAt: '2025-03-07T14:30:00', profitLoss: 480000, profitLossRate: 27.59, journalId: 'mj2' },
  { id: 'mth3', type: 'buy', stock: STOCKS[3], quantity: 5, price: 930000, totalAmount: 4650000, executedAt: '2025-03-05T10:00:00', journalId: 'mj3' },
  { id: 'mth4', type: 'buy', stock: STOCKS[18], quantity: 15, price: 170000, totalAmount: 2550000, executedAt: '2025-03-02T09:45:00', journalId: 'mj4' },
  { id: 'mth5', type: 'sell', stock: STOCKS[4], quantity: 20, price: 245000, totalAmount: 4900000, executedAt: '2025-02-28T15:00:00', profitLoss: 940000, profitLossRate: 23.75, journalId: 'mj5' },
];

export const MENTEE_TRADE_HISTORIES: Record<string, TradeHistory[]> = {
  mentee1: [
    { id: 'mt1_1', type: 'buy', stock: STOCKS[0], quantity: 10, price: 70000, totalAmount: 700000, executedAt: '2025-03-06T10:00:00', journalId: 'mntj1' },
    { id: 'mt1_2', type: 'buy', stock: STOCKS[11], quantity: 15, price: 84000, totalAmount: 1260000, executedAt: '2025-02-20T09:30:00', journalId: 'mntj2' },
  ],
  mentee2: [
    { id: 'mt2_1', type: 'buy', stock: STOCKS[9], quantity: 6, price: 190000, totalAmount: 1140000, executedAt: '2025-03-04T09:00:00', journalId: 'mntj3' },
  ],
  mentee3: [
    { id: 'mt3_1', type: 'buy', stock: STOCKS[1], quantity: 8, price: 170000, totalAmount: 1360000, executedAt: '2025-03-08T10:00:00', journalId: 'mntj4' },
    { id: 'mt3_2', type: 'buy', stock: STOCKS[4], quantity: 5, price: 228000, totalAmount: 1140000, executedAt: '2025-03-01T09:30:00', journalId: 'mntj5' },
    { id: 'mt3_3', type: 'buy', stock: STOCKS[18], quantity: 5, price: 165000, totalAmount: 825000, executedAt: '2025-02-25T09:45:00' },
  ],
};

const MENTOR_COMMENTS_ON_MY_JOURNALS: Comment[] = [
  {
    id: 'c_m1', journalId: 'j1', authorId: 'r1', authorNickname: '주식마스터',
    content: '좋은 진입 시점이에요. HBM 사이클은 아직 초입이니 분할매수 전략 잘 하셨습니다.',
    createdAt: '2025-03-08T11:00:00', updatedAt: '2025-03-08T11:00:00',
  },
  {
    id: 'c_m2', journalId: 'j2', authorId: 'r1', authorNickname: '주식마스터',
    content: '10% 익절 기준 잘 지키셨네요. 분할 매도 전략이 리스크 관리에 효과적입니다.',
    createdAt: '2025-03-07T16:00:00', updatedAt: '2025-03-07T16:00:00',
  },
  {
    id: 'c_m3', journalId: 'j6', authorId: 'r1', authorNickname: '주식마스터',
    content: '손절을 빠르게 결정하신 점 좋습니다. 진입 이유를 다시 점검해보고 다음 매매에 반영하세요.',
    createdAt: '2025-02-21T10:00:00', updatedAt: '2025-02-21T10:00:00',
  },
];

export const TRADE_JOURNALS: TradeJournal[] = [
  {
    id: 'j1', tradeHistoryId: 'th1', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[0], tradeType: 'buy', quantity: 5, price: 68200, totalAmount: 341000,
    memo: 'HBM 수요 증가로 인한 반도체 슈퍼사이클 진입 기대. 삼성전자 목표가 상향 조정 多. 분할 매수 1차.',
    createdAt: '2025-03-08T10:00:00', updatedAt: '2025-03-08T10:00:00',
    comments: [MENTOR_COMMENTS_ON_MY_JOURNALS[0]],
  },
  {
    id: 'j2', tradeHistoryId: 'th2', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[9], tradeType: 'sell', quantity: 3, price: 196000, totalAmount: 588000, profitLoss: 54000, profitLossRate: 10.17,
    memo: '목표 수익률 10% 달성하여 일부 익절. 광고 시장 불확실성으로 나머지 보유 유지.',
    createdAt: '2025-03-07T15:00:00', updatedAt: '2025-03-07T15:00:00',
    comments: [MENTOR_COMMENTS_ON_MY_JOURNALS[1]],
  },
  {
    id: 'j3', tradeHistoryId: 'th3', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[1], tradeType: 'buy', quantity: 2, price: 174000, totalAmount: 348000,
    memo: 'AI 서버용 HBM 독점 공급. 하반기 실적 기대감 매수. 엔비디아 수혜주.',
    createdAt: '2025-03-06T10:30:00', updatedAt: '2025-03-06T10:30:00',
    comments: [],
  },
  {
    id: 'j4', tradeHistoryId: 'th5', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[4], tradeType: 'buy', quantity: 3, price: 232000, totalAmount: 696000,
    memo: '전기차 전환 가속화, 미국 공장 가동률 개선. PER 저평가 구간. 장기 보유 목적.',
    createdAt: '2025-03-04T10:00:00', updatedAt: '2025-03-04T10:00:00',
    comments: [],
  },
  {
    id: 'j5', tradeHistoryId: 'th7', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[11], tradeType: 'buy', quantity: 15, price: 81500, totalAmount: 1222500,
    memo: '금리 인하 사이클 진입시 금융주 수혜. 배당수익률 매력적. 포트폴리오 안정성 확보.',
    createdAt: '2025-02-28T10:30:00', updatedAt: '2025-02-28T10:30:00',
    comments: [],
  },
  {
    id: 'j6', tradeHistoryId: 'th9', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[2], tradeType: 'sell', quantity: 1.5, price: 301000, totalAmount: 451500, profitLoss: -7500, profitLossRate: -1.64,
    memo: '전기차 수요 둔화 우려로 손절. 손절 기준(-5%) 이전에 선제 매도. 반성: 진입 시점 재검토 필요.',
    createdAt: '2025-02-20T14:00:00', updatedAt: '2025-02-21T09:00:00',
    comments: [MENTOR_COMMENTS_ON_MY_JOURNALS[2]],
  },
  {
    id: 'j7', tradeHistoryId: 'th10', authorId: 'me', authorNickname: '투자왕김철수',
    stock: STOCKS[9], tradeType: 'buy', quantity: 12, price: 178000, totalAmount: 2136000,
    memo: '검색 광고 회복 + AI 검색 신규 수익원 기대. 52주 신저가 근처 분할 매수 시작.',
    createdAt: '2025-02-15T09:40:00', updatedAt: '2025-02-15T09:40:00',
    comments: [],
  },
];

export const MENTOR_JOURNALS: TradeJournal[] = [
  {
    id: 'mj1', tradeHistoryId: 'mth1', authorId: 'r1', authorNickname: '주식마스터',
    stock: STOCKS[1], tradeType: 'buy', quantity: 20, price: 185000, totalAmount: 3700000,
    memo: 'HBM3E 양산 시작. AI 서버 수요 폭발적 증가 구간. 목표가 250,000원. 3개월 보유 전략.',
    createdAt: '2025-03-09T10:00:00', updatedAt: '2025-03-09T10:00:00',
    comments: [],
  },
  {
    id: 'mj2', tradeHistoryId: 'mth2', authorId: 'r1', authorNickname: '주식마스터',
    stock: STOCKS[0], tradeType: 'sell', quantity: 30, price: 74000, totalAmount: 2220000, profitLoss: 480000, profitLossRate: 27.59,
    memo: '목표가 도달. 반도체 섹터 비중 축소, SK하이닉스로 교체 목적. 삼성전자 HBM 경쟁력 우려.',
    createdAt: '2025-03-07T15:00:00', updatedAt: '2025-03-07T15:00:00',
    comments: [],
  },
  {
    id: 'mj3', tradeHistoryId: 'mth3', authorId: 'r1', authorNickname: '주식마스터',
    stock: STOCKS[3], tradeType: 'buy', quantity: 5, price: 930000, totalAmount: 4650000,
    memo: '바이오시밀러 미국 FDA 승인 기대. 글로벌 CDMO 수주 확대. 장기 성장성 높은 종목.',
    createdAt: '2025-03-05T11:00:00', updatedAt: '2025-03-05T11:00:00',
    comments: [],
  },
  {
    id: 'mj4', tradeHistoryId: 'mth4', authorId: 'r1', authorNickname: '주식마스터',
    stock: STOCKS[18], tradeType: 'buy', quantity: 15, price: 170000, totalAmount: 2550000,
    memo: '코스닥 바이오 중 가장 탄탄한 파이프라인. 항체 바이오시밀러 시장 점유율 확대 중.',
    createdAt: '2025-03-02T10:00:00', updatedAt: '2025-03-02T10:00:00',
    comments: [],
  },
  {
    id: 'mj5', tradeHistoryId: 'mth5', authorId: 'r1', authorNickname: '주식마스터',
    stock: STOCKS[4], tradeType: 'sell', quantity: 20, price: 245000, totalAmount: 4900000, profitLoss: 940000, profitLossRate: 23.75,
    memo: '미국 IRA 불확실성 해소. 목표가 도달하여 익절. 전기차 전환 속도 불확실성 있어 일부 매도.',
    createdAt: '2025-02-28T15:30:00', updatedAt: '2025-02-28T15:30:00',
    comments: [],
  },
];

export const MENTEE_JOURNALS: Record<string, TradeJournal[]> = {
  mentee1: [
    {
      id: 'mntj1', tradeHistoryId: 'mt1_1', authorId: 'mentee1', authorNickname: '초보투자자',
      stock: STOCKS[0], tradeType: 'buy', quantity: 10, price: 70000, totalAmount: 700000,
      memo: '멘토님이 삼성전자 사셨길래 저도 샀어요. 반도체가 좋다고 하셔서요.',
      createdAt: '2025-03-06T11:00:00', updatedAt: '2025-03-06T11:00:00',
      comments: [],
    },
    {
      id: 'mntj2', tradeHistoryId: 'mt1_2', authorId: 'mentee1', authorNickname: '초보투자자',
      stock: STOCKS[11], tradeType: 'buy', quantity: 15, price: 84000, totalAmount: 1260000,
      memo: '배당주가 안정적이라고 해서 KB금융 매수했습니다.',
      createdAt: '2025-02-20T10:00:00', updatedAt: '2025-02-20T10:00:00',
      comments: [],
    },
  ],
  mentee2: [
    {
      id: 'mntj3', tradeHistoryId: 'mt2_1', authorId: 'mentee2', authorNickname: '주식공부중',
      stock: STOCKS[9], tradeType: 'buy', quantity: 6, price: 190000, totalAmount: 1140000,
      memo: 'AI 관련 기업에 투자하고 싶었어요. NAVER가 AI 검색 잘 한다고 해서.',
      createdAt: '2025-03-04T10:00:00', updatedAt: '2025-03-04T10:00:00',
      comments: [],
    },
  ],
  mentee3: [
    {
      id: 'mntj4', tradeHistoryId: 'mt3_1', authorId: 'mentee3', authorNickname: '부자되자',
      stock: STOCKS[1], tradeType: 'buy', quantity: 8, price: 170000, totalAmount: 1360000,
      memo: 'SK하이닉스 HBM 수혜주. 엔비디아 납품 기대. 목표 수익률 20%.',
      createdAt: '2025-03-08T11:00:00', updatedAt: '2025-03-08T11:00:00',
      comments: [],
    },
    {
      id: 'mntj5', tradeHistoryId: 'mt3_2', authorId: 'mentee3', authorNickname: '부자되자',
      stock: STOCKS[4], tradeType: 'buy', quantity: 5, price: 228000, totalAmount: 1140000,
      memo: '현대차 전기차 전환 본격화. 미국 공장 풀가동. PER 5배 저평가 매력.',
      createdAt: '2025-03-01T10:00:00', updatedAt: '2025-03-01T10:00:00',
      comments: [],
    },
  ],
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', type: 'mentor_request', title: '멘토 신청', isRead: false,
    message: '반도체전문가님이 멘토 신청을 보냈습니다.',
    createdAt: '2025-03-10T15:00:00',
    mentorRequestData: { requesterId: 'r5', requesterNickname: '반도체전문가', status: 'pending' },
  },
  {
    id: 'n2', type: 'order_executed', title: '주문 체결', isRead: false,
    message: '삼성전자 매수 주문이 73,400원에 체결되었습니다.',
    createdAt: '2025-03-10T09:32:00',
  },
  {
    id: 'n3', type: 'follow_trade', title: '팔로우 거래 알림', isRead: false,
    message: '주식마스터님이 SK하이닉스를 185,000원에 매수했습니다.',
    createdAt: '2025-03-09T09:20:00',
    tradeData: { stockName: 'SK하이닉스', tradeType: 'buy', price: 185000, quantity: 20, investorNickname: '주식마스터', investorId: 'r1' },
  },
  {
    id: 'n4', type: 'order_executed', title: '주문 체결', isRead: true,
    message: 'KB금융 매수 주문이 87,200원에 체결되었습니다.',
    createdAt: '2025-03-08T10:05:00',
  },
  {
    id: 'n5', type: 'follow_trade', title: '팔로우 거래 알림', isRead: true,
    message: '주식마스터님이 삼성전자를 74,000원에 매도했습니다.',
    createdAt: '2025-03-07T14:35:00',
    tradeData: { stockName: '삼성전자', tradeType: 'sell', price: 74000, quantity: 30, investorNickname: '주식마스터', investorId: 'r1' },
  },
  {
    id: 'n6', type: 'mentor_accepted', title: '멘토 수락', isRead: true,
    message: '주식마스터님이 멘토 신청을 수락하셨습니다.',
    createdAt: '2025-02-01T10:00:00',
    mentorRequestData: { requesterId: 'me', requesterNickname: '투자왕김철수', status: 'accepted' },
  },
  {
    id: 'n7', type: 'follow_trade', title: '팔로우 거래 알림', isRead: true,
    message: '주식고수박영희님이 NAVER를 191,500원에 매도했습니다.',
    createdAt: '2025-03-06T11:15:00',
    tradeData: { stockName: 'NAVER', tradeType: 'sell', price: 191500, quantity: 5, investorNickname: '주식고수박영희', investorId: 'r2' },
  },
];

export const FOLLOWING_USERS: User[] = [
  MY_MENTOR,
  { id: 'r2', nickname: '주식고수박영희', email: '', totalReturn: 5820000, totalReturnRate: 34.8, followers: 218, following: 12, isFollowing: true },
  { id: 'r3', nickname: '황금손투자자', email: '', totalReturn: 9200000, totalReturnRate: 31.2, followers: 387, following: 8, isFollowing: true },
];

export function generatePriceHistory(basePrice: number, days: number = 30): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice * 0.88;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.45) * price * 0.02;
    price = Math.max(price + change, basePrice * 0.7);
    points.push({
      time: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      price: Math.round(price),
    });
  }
  return points;
}

export const MY_PENDING_ORDERS: PendingOrder[] = [
  { id: 'po1', type: 'buy', stockId: '1', stock: STOCKS[0], quantity: 5, price: 72000, totalAmount: 360000, orderType: '지정가', createdAt: '2026-03-16T09:30:00' },
  { id: 'po2', type: 'buy', stockId: '1', stock: STOCKS[0], quantity: 3, price: 71500, totalAmount: 214500, orderType: '지정가', createdAt: '2026-03-16T10:15:00' },
  { id: 'po3', type: 'sell', stockId: '1', stock: STOCKS[0], quantity: 5, price: 76000, totalAmount: 380000, orderType: '지정가', createdAt: '2026-03-16T11:00:00' },
  { id: 'po4', type: 'buy', stockId: '2', stock: STOCKS[1], quantity: 2, price: 185000, totalAmount: 370000, orderType: '지정가', createdAt: '2026-03-16T10:00:00' },
  { id: 'po5', type: 'sell', stockId: '10', stock: STOCKS[9], quantity: 4, price: 198000, totalAmount: 792000, orderType: '지정가', createdAt: '2026-03-16T09:45:00' },
];
