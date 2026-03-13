'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserCheck, Users, TrendingUp, TrendingDown, BookOpen, BarChart2, PieChart, MessageCircle, UserX, ArrowRight } from 'lucide-react';
import { MY_USER, MY_MENTOR, MENTOR_JOURNALS, MENTOR_TRADE_HISTORIES, MENTOR_PORTFOLIO } from '@/data/dummy';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';

type MentorTab = '매매일지' | '매매내역' | '포트폴리오';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function MentorPage() {
  const [activeTab, setActiveTab] = useState<MentorTab>('매매일지');
  const [hasMentor, setHasMentor] = useState(!!MY_USER.mentorId);
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  if (!hasMentor) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <UserCheck size={28} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">아직 멘토가 없습니다</h2>
          <p className="text-sm text-gray-400 mb-6">
            유저 목록에서 마음에 드는 투자자에게<br />멘토 신청을 해보세요!
          </p>
          <Link href="/users"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0046FF' }}>
            유저 목록으로 이동
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const mentor = MY_MENTOR;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <UserCheck size={22} style={{ color: '#0046FF' }} />
        <h1 className="text-2xl font-bold text-gray-900">나의 멘토</h1>
      </div>

      {/* Mentor Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: '#F59E0B' }}>
              {mentor.nickname[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">{mentor.nickname}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">멘토</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={13} />
                  <span>팔로워 <strong className="text-gray-800">{mentor.followers}</strong>명</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={13} />
                  <span>총 수익률 <strong className="text-red-500">+{mentor.totalReturnRate.toFixed(1)}%</strong></span>
                </div>
                <div className="text-gray-500">
                  총 수익 <strong className="text-gray-800">+{fmtM(mentor.totalReturn)}원</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/profile/${mentor.id}`}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              프로필 보기
            </Link>
            <button
              onClick={() => setHasMentor(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <UserX size={14} />
              멘토 취소
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['매매일지', '매매내역', '포트폴리오'] as MentorTab[]).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            style={activeTab === t ? { backgroundColor: '#0046FF' } : {}}>
            {t === '매매일지' && <BookOpen size={14} />}
            {t === '매매내역' && <BarChart2 size={14} />}
            {t === '포트폴리오' && <PieChart size={14} />}
            {t}
          </button>
        ))}
      </div>

      {/* 매매일지 Tab */}
      {activeTab === '매매일지' && (
        <div className="space-y-4">
          {MENTOR_JOURNALS.map(journal => {
            const isProfit = (journal.profitLoss ?? 0) >= 0;
            return (
              <div key={journal.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${journal.tradeType === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {journal.tradeType === 'buy' ? '매수' : '매도'}
                      </span>
                      <span className="text-base font-bold text-gray-900">{journal.stock.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {journal.quantity}주 · {journal.price.toLocaleString('ko-KR')}원 · {new Date(journal.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  {journal.profitLoss !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                      {isProfit ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {isProfit ? '+' : ''}{fmtM(journal.profitLoss)}원
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{journal.memo}</p>

                {/* Comment on mentor journal */}
                <div className="border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle size={14} style={{ color: '#0046FF' }} />
                    <span className="text-xs font-semibold text-gray-600">댓글</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newComment[journal.id] || ''}
                      onChange={e => setNewComment(prev => ({ ...prev, [journal.id]: e.target.value }))}
                      placeholder="멘토에게 댓글을 남기세요..."
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] transition-colors"
                    />
                    <button
                      disabled={!newComment[journal.id]?.trim()}
                      className="px-4 py-2 rounded-xl text-white text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#0046FF' }}
                      onClick={() => setNewComment(prev => ({ ...prev, [journal.id]: '' }))}>
                      작성
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 매매내역 Tab */}
      {activeTab === '매매내역' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-500">
                <th className="text-left px-6 py-3.5 font-semibold">종목</th>
                <th className="text-center px-4 py-3.5 font-semibold">구분</th>
                <th className="text-right px-4 py-3.5 font-semibold">수량</th>
                <th className="text-right px-4 py-3.5 font-semibold">체결가</th>
                <th className="text-right px-4 py-3.5 font-semibold">체결금액</th>
                <th className="text-right px-4 py-3.5 font-semibold">손익</th>
                <th className="text-right px-4 py-3.5 font-semibold">날짜</th>
                <th className="text-center px-4 py-3.5 font-semibold">종목 이동</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MENTOR_TRADE_HISTORIES.map(trade => {
                const isProfit = (trade.profitLoss ?? 0) >= 0;
                return (
                  <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: `hsl(${trade.stock.id.charCodeAt(0) * 47 % 360}, 65%, 50%)` }}>
                          {trade.stock.name[0]}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{trade.stock.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trade.type === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {trade.type === 'buy' ? '매수' : '매도'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-600">{trade.quantity}주</td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-gray-800">{trade.price.toLocaleString('ko-KR')}원</td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-600">{fmtM(trade.totalAmount)}원</td>
                    <td className="px-4 py-3.5 text-right">
                      {trade.profitLoss !== undefined ? (
                        <div className={`flex flex-col items-end ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                          <span className="text-xs font-bold">{isProfit ? '+' : ''}{fmtM(trade.profitLoss)}원</span>
                          <span className="text-[11px]">{isProfit ? '+' : ''}{trade.profitLossRate?.toFixed(2)}%</span>
                        </div>
                      ) : <span className="text-xs text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3.5 text-right text-xs text-gray-400">
                      {new Date(trade.executedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Link href={`/trading/${trade.stock.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white hover:opacity-90"
                        style={{ backgroundColor: '#0046FF' }}>
                        보기
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 포트폴리오 Tab */}
      {activeTab === '포트폴리오' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '총 투자금', value: `${fmtM(MENTOR_PORTFOLIO.totalInvestment)}원` },
              { label: '총 평가금액', value: `${fmtM(MENTOR_PORTFOLIO.totalValue)}원` },
              { label: '총 수익률', value: `+${MENTOR_PORTFOLIO.totalProfitLossRate.toFixed(1)}%`, color: 'text-red-500' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                <p className={`text-lg font-bold ${item.color || 'text-gray-900'}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">종목 비중</p>
              <PortfolioPieChart holdings={MENTOR_PORTFOLIO.holdings} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">보유 종목</p>
              <div className="space-y-2">
                {MENTOR_PORTFOLIO.holdings.map(h => (
                  <div key={h.stockId} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: `hsl(${parseInt(h.stockId) * 47 % 360}, 65%, 50%)` }}>
                        {h.stock.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{h.stock.name}</p>
                        <p className="text-[10px] text-gray-400">{h.quantity}주</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${h.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                        {h.profitLossRate >= 0 ? '+' : ''}{h.profitLossRate.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-gray-400">{fmtM(h.currentValue)}원</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
