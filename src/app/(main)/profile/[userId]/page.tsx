'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, UserPlus, UserMinus, GraduationCap, X } from 'lucide-react';
import { RANKING_USERS, TRADE_JOURNALS, TRADE_HISTORIES, MY_PORTFOLIO, MY_USER, MENTOR_JOURNALS, MENTOR_PORTFOLIO, MENTOR_TRADE_HISTORIES } from '@/data/dummy';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';

type Tab = '매매일지' | '매매내역' | '포트폴리오';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function UserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const router = useRouter();
  const user = RANKING_USERS.find(u => u.id === userId) || RANKING_USERS[0];
  const isMe = userId === MY_USER.id;
  const isMentor = userId === MY_USER.mentorId;

  const [tab, setTab] = useState<Tab>('매매일지');
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [mentorRequestSent, setMentorRequestSent] = useState(user.isMentorRequestSent || false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Show mentor's data if viewing mentor, otherwise show user's data
  const journals = isMentor ? MENTOR_JOURNALS : TRADE_JOURNALS.slice(0, 4);
  const tradeHistories = isMentor ? MENTOR_TRADE_HISTORIES : TRADE_HISTORIES;
  const portfolio = isMentor ? MENTOR_PORTFOLIO : MY_PORTFOLIO;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">투자자 프로필</h1>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Left: Profile Info */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3"
                style={{ backgroundColor: isMentor ? '#F59E0B' : `hsl(${userId.charCodeAt(userId.length - 1) * 40}, 60%, 50%)` }}>
                {user.nickname[0]}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-gray-900">{user.nickname}</h2>
                {isMentor && <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">멘토</span>}
              </div>
            </div>

            {/* Followers / Following */}
            <div className="flex gap-1 mb-4">
              <button onClick={() => setShowFollowers(true)}
                className="flex-1 text-center py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <p className="text-base font-bold text-gray-900">{user.followers}</p>
                <p className="text-xs text-gray-400">팔로워</p>
              </button>
              <div className="w-px bg-gray-100" />
              <button onClick={() => setShowFollowing(true)}
                className="flex-1 text-center py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <p className="text-base font-bold text-gray-900">{user.following}</p>
                <p className="text-xs text-gray-400">팔로잉</p>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">총 수익률</p>
                <p className="text-sm font-bold text-red-500">+{user.totalReturnRate.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">총 수익</p>
                <p className="text-sm font-bold text-gray-800">+{fmtM(user.totalReturn)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">주간 수익률</p>
                <p className="text-sm font-bold text-red-500">+{user.weeklyReturnRate.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">월간 수익률</p>
                <p className="text-sm font-bold text-red-500">+{user.monthlyReturnRate.toFixed(1)}%</p>
              </div>
            </div>

            {!isMe && (
              <div className="space-y-2">
                <button onClick={() => setIsFollowing(!isFollowing)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${isFollowing ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'text-white hover:opacity-90'}`}
                  style={!isFollowing ? { backgroundColor: '#0046FF' } : {}}>
                  {isFollowing ? <UserMinus size={15} /> : <UserPlus size={15} />}
                  {isFollowing ? '언팔로우' : '팔로우'}
                </button>
                {!isMentor && (
                  <button
                    onClick={() => setMentorRequestSent(!mentorRequestSent)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mentorRequestSent ? 'border border-yellow-300 text-yellow-600 bg-yellow-50' : 'bg-yellow-400 text-white hover:opacity-90'}`}>
                    <GraduationCap size={15} />
                    {mentorRequestSent ? '멘토 신청 완료' : '멘토 신청'}
                  </button>
                )}
                {isMentor && (
                  <div className="text-center text-xs text-yellow-600 font-semibold py-2 rounded-xl bg-yellow-50">
                    현재 나의 멘토입니다
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['매매일지', '매매내역', '포트폴리오'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === t ? 'text-[#0046FF] border-b-2 border-[#0046FF]' : 'text-gray-400 hover:text-gray-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === '매매일지' && (
              <div className="space-y-3">
                {journals.map(j => {
                  const isProfit = (j.profitLoss ?? 0) >= 0;
                  return (
                    <div key={j.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${j.tradeType === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {j.tradeType === 'buy' ? '매수' : '매도'}
                          </span>
                          <span className="text-base font-bold text-gray-900">{j.stock.name}</span>
                          <span className="text-sm text-gray-400">{j.quantity}주 · {j.price.toLocaleString('ko-KR')}원</span>
                        </div>
                        <div className="text-right">
                          {j.profitLoss !== undefined && (
                            <span className={`text-sm font-bold ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                              {isProfit ? '+' : ''}{fmtM(j.profitLoss)}원
                            </span>
                          )}
                          <p className="text-xs text-gray-400">{new Date(j.createdAt).toLocaleDateString('ko-KR')}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{j.memo}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === '매매내역' && (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-4 py-3 font-semibold">종목</th>
                      <th className="text-center px-3 py-3 font-semibold">구분</th>
                      <th className="text-right px-3 py-3 font-semibold">수량</th>
                      <th className="text-right px-3 py-3 font-semibold">체결가</th>
                      <th className="text-right px-3 py-3 font-semibold">체결금액</th>
                      <th className="text-right px-3 py-3 font-semibold">손익</th>
                      <th className="text-right px-4 py-3 font-semibold">날짜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tradeHistories.map(trade => {
                      const isProfit = (trade.profitLoss ?? 0) >= 0;
                      return (
                        <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: `hsl(${parseInt(trade.stock.id) * 47 % 360}, 65%, 50%)` }}>
                                {trade.stock.name[0]}
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{trade.stock.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trade.type === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              {trade.type === 'buy' ? '매수' : '매도'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right text-sm text-gray-600">{trade.quantity}주</td>
                          <td className="px-3 py-3 text-right text-sm font-medium text-gray-800">{trade.price.toLocaleString('ko-KR')}원</td>
                          <td className="px-3 py-3 text-right text-sm text-gray-600">{fmtM(trade.totalAmount)}원</td>
                          <td className="px-3 py-3 text-right">
                            {trade.profitLoss !== undefined ? (
                              <div className={`flex flex-col items-end ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                                <div className="flex items-center gap-0.5 text-xs font-bold">
                                  {isProfit ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                  {isProfit ? '+' : ''}{fmtM(trade.profitLoss)}원
                                </div>
                                <span className="text-[11px]">{isProfit ? '+' : ''}{trade.profitLossRate?.toFixed(2)}%</span>
                              </div>
                            ) : <span className="text-xs text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-400">
                            {new Date(trade.executedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {tab === '포트폴리오' && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 투자금</p>
                    <p className="text-base font-bold text-gray-900">{fmtM(portfolio.totalInvestment)}원</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 수익률</p>
                    <p className="text-base font-bold text-red-500">+{portfolio.totalProfitLossRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 수익</p>
                    <p className="text-base font-bold text-red-500">+{fmtM(portfolio.totalProfitLoss)}원</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">종목 비중</p>
                    <PortfolioPieChart holdings={portfolio.holdings} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">보유 종목</p>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-xs text-gray-500">
                          <th className="text-left px-3 py-2 font-semibold">종목</th>
                          <th className="text-right px-3 py-2 font-semibold">수량</th>
                          <th className="text-right px-3 py-2 font-semibold">수익률</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {portfolio.holdings.map(h => (
                          <tr key={h.stockId} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                  style={{ backgroundColor: `hsl(${parseInt(h.stockId) * 47 % 360}, 65%, 50%)` }}>
                                  {h.stock.name[0]}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{h.stock.name}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">{h.quantity}주</td>
                            <td className={`px-3 py-2 text-right text-sm font-bold ${h.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                              {h.profitLossRate >= 0 ? '+' : ''}{h.profitLossRate.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFollowers(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">팔로워 ({user.followers})</h3>
              <button onClick={() => setShowFollowers(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-400 text-center py-8">팔로워 목록은 해당 사용자에게만 표시됩니다.</p>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFollowing(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">팔로잉 ({user.following})</h3>
              <button onClick={() => setShowFollowing(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-400 text-center py-8">팔로잉 목록은 해당 사용자에게만 표시됩니다.</p>
          </div>
        </div>
      )}
    </div>
  );
}
