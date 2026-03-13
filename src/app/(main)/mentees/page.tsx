'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, TrendingUp, TrendingDown, BookOpen, BarChart2, PieChart, MessageCircle } from 'lucide-react';
import { MY_MENTEES, MENTEE_JOURNALS, MENTEE_TRADE_HISTORIES, MENTEE_PORTFOLIOS, MY_USER } from '@/data/dummy';
import type { User } from '@/types';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';

type MenteeTab = '매매일지' | '매매내역' | '포트폴리오';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function MenteesPage() {
  const [selectedMentee, setSelectedMentee] = useState<User | null>(MY_MENTEES[0] || null);
  const [activeTab, setActiveTab] = useState<MenteeTab>('매매일지');
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  if (MY_MENTEES.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <GraduationCap size={28} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">아직 멘티가 없습니다</h2>
          <p className="text-sm text-gray-400">
            다른 투자자가 멘토 신청을 하면<br />이곳에서 확인할 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  const journals = selectedMentee ? (MENTEE_JOURNALS[selectedMentee.id] || []) : [];
  const trades = selectedMentee ? (MENTEE_TRADE_HISTORIES[selectedMentee.id] || []) : [];
  const portfolio = selectedMentee ? MENTEE_PORTFOLIOS[selectedMentee.id] : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <GraduationCap size={22} style={{ color: '#0046FF' }} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">나의 멘티</h1>
          <p className="text-sm text-gray-400 mt-0.5">총 {MY_MENTEES.length}명의 멘티</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Mentee List (left sidebar) */}
        <div className="w-56 shrink-0 space-y-2">
          {MY_MENTEES.map(mentee => (
            <button key={mentee.id}
              onClick={() => { setSelectedMentee(mentee); setActiveTab('매매일지'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                selectedMentee?.id === mentee.id
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-gray-100 text-gray-700 hover:border-[#0046FF]/20'
              }`}
              style={selectedMentee?.id === mentee.id ? { backgroundColor: '#0046FF' } : {}}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                selectedMentee?.id === mentee.id ? 'bg-white/20' : ''
              }`}
                style={selectedMentee?.id !== mentee.id ? { backgroundColor: `hsl(${mentee.id.charCodeAt(mentee.id.length - 1) * 40}, 60%, 55%)` } : {}}>
                {mentee.nickname[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${selectedMentee?.id === mentee.id ? 'text-white' : 'text-gray-800'}`}>
                  {mentee.nickname}
                </p>
                <p className={`text-xs ${selectedMentee?.id === mentee.id ? 'text-blue-200' : mentee.totalReturnRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                  {mentee.totalReturnRate >= 0 ? '+' : ''}{mentee.totalReturnRate.toFixed(1)}%
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        {selectedMentee && (
          <div className="flex-1 min-w-0">
            {/* Mentee Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: `hsl(${selectedMentee.id.charCodeAt(selectedMentee.id.length - 1) * 40}, 60%, 55%)` }}>
                  {selectedMentee.nickname[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedMentee.nickname}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-0.5">
                    <span>팔로워 <strong className="text-gray-800">{selectedMentee.followers}</strong>명</span>
                    <span>총 수익 <strong className={selectedMentee.totalReturn >= 0 ? 'text-red-500' : 'text-blue-600'}>
                      {selectedMentee.totalReturn >= 0 ? '+' : ''}{fmtM(selectedMentee.totalReturn)}원
                    </strong></span>
                    <span>수익률 <strong className={selectedMentee.totalReturnRate >= 0 ? 'text-red-500' : 'text-blue-600'}>
                      {selectedMentee.totalReturnRate >= 0 ? '+' : ''}{selectedMentee.totalReturnRate.toFixed(1)}%
                    </strong></span>
                  </div>
                </div>
                <div className="ml-auto">
                  <Link href={`/profile/${selectedMentee.id}`}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    프로필 보기
                  </Link>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-5">
              {(['매매일지', '매매내역', '포트폴리오'] as MenteeTab[]).map(t => (
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

            {/* 매매일지 */}
            {activeTab === '매매일지' && (
              journals.length === 0
                ? <div className="bg-white rounded-2xl border border-gray-100 flex items-center justify-center py-16">
                    <p className="text-sm text-gray-400">작성된 일지가 없습니다.</p>
                  </div>
                : <div className="space-y-4">
                    {journals.map(journal => {
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

                          {/* Mentor comment input */}
                          <div className="border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageCircle size={13} style={{ color: '#0046FF' }} />
                              <span className="text-xs font-semibold text-gray-500">멘토 피드백</span>
                            </div>
                            <div className="flex gap-2">
                              <input
                                value={newComment[journal.id] || ''}
                                onChange={e => setNewComment(prev => ({ ...prev, [journal.id]: e.target.value }))}
                                placeholder="멘티에게 피드백을 남기세요..."
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

            {/* 매매내역 */}
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
                      <th className="text-right px-4 py-3.5 font-semibold">날짜</th>
                      <th className="text-center px-4 py-3.5 font-semibold">종목</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {trades.map(trade => (
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
                        <td className="px-4 py-3.5 text-right text-sm text-gray-800">{trade.price.toLocaleString('ko-KR')}원</td>
                        <td className="px-4 py-3.5 text-right text-sm text-gray-600">{fmtM(trade.totalAmount)}원</td>
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
                    ))}
                    {trades.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-sm text-gray-400">매매 내역이 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 포트폴리오 */}
            {activeTab === '포트폴리오' && portfolio && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '총 투자금', value: `${fmtM(portfolio.totalInvestment)}원` },
                    { label: '총 수익', value: `${portfolio.totalProfitLoss >= 0 ? '+' : ''}${fmtM(portfolio.totalProfitLoss)}원`, color: portfolio.totalProfitLoss >= 0 ? 'text-red-500' : 'text-blue-600' },
                    { label: '수익률', value: `${portfolio.totalProfitLossRate >= 0 ? '+' : ''}${portfolio.totalProfitLossRate.toFixed(1)}%`, color: portfolio.totalProfitLossRate >= 0 ? 'text-red-500' : 'text-blue-600' },
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
                    <PortfolioPieChart holdings={portfolio.holdings} />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-sm font-semibold text-gray-700 mb-4">보유 종목</p>
                    <div className="space-y-2">
                      {portfolio.holdings.map(h => (
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
        )}
      </div>
    </div>
  );
}
