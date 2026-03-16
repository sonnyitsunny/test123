'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Star, ChevronRight, Bell } from 'lucide-react';
import { MARKET_INDICES, MY_PORTFOLIO, RANKING_USERS, STOCKS } from '@/data/dummy';
import MarketIndexCard from '@/components/MarketIndexCard';

function fmt(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

const today = new Date();
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 (${WEEKDAYS[today.getDay()]})`;

const TOP_USERS = RANKING_USERS.slice(0, 5);
const POPULAR_STOCKS = [...STOCKS].sort((a, b) => b.volume - a.volume).slice(0, 8);

const RANK_COLORS = ['#0046FF', '#7C3AED', '#F59E0B', '#10B981', '#EF4444'];

export default function HomePage() {
  const { totalValue, totalInvestment, cash, holdings, totalProfitLoss, totalProfitLossRate } = MY_PORTFOLIO;

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">홈</h1>
          <p className="text-sm text-gray-400 mt-0.5">{dateStr}</p>
        </div>
        <Link href="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors">
          <Bell size={17} className="text-gray-600" />
        </Link>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {MARKET_INDICES.map(idx => (
          <MarketIndexCard key={idx.name} idx={idx} compact />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-5 gap-5 mb-5">
        {/* Portfolio Summary Card */}
        <div className="col-span-3 rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0046FF 0%, #0035CC 100%)' }}>
          <div className="absolute right-0 top-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(35%, -35%)' }} />
          <p className="text-sm text-blue-200 mb-1">총 평가자산</p>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-4xl font-bold">{fmt(totalValue)}</p>
            <p className="text-xl font-semibold mb-0.5">원</p>
          </div>
          <p className={`text-sm font-semibold mb-6 ${totalProfitLoss >= 0 ? 'text-yellow-300' : 'text-red-300'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{fmt(totalProfitLoss)}원 ({totalProfitLossRate >= 0 ? '+' : ''}{totalProfitLossRate.toFixed(2)}%)
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs text-blue-200 mb-1">투자원금</p>
              <p className="text-base font-bold">{fmt(totalInvestment)}원</p>
            </div>
            <div>
              <p className="text-xs text-blue-200 mb-1">예수금</p>
              <p className="text-base font-bold">{fmt(cash)}원</p>
            </div>
            <div>
              <p className="text-xs text-blue-200 mb-1">보유종목</p>
              <p className="text-base font-bold">{holdings.length}개</p>
            </div>
          </div>
        </div>

        {/* TOP 투자자 */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-gray-800">TOP 투자자</span>
            </div>
            <Link href="/users" className="text-xs text-[#0046FF] font-semibold flex items-center gap-0.5 hover:opacity-80">
              전체 <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {TOP_USERS.map((user, i) => (
              <Link href={`/profile/${user.id}`} key={user.id}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-2 py-1.5 -mx-2 transition-colors">
                <span className="text-xs font-bold text-gray-400 w-3">{i + 1}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: RANK_COLORS[i] }}>
                  {user.nickname[0]}
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{user.nickname}</span>
                <span className="text-sm font-bold text-red-500">+{user.totalReturnRate.toFixed(1)}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-5 gap-5">
        {/* 보유 종목 */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-800">보유 종목</span>
            <Link href="/account" className="text-xs text-[#0046FF] font-semibold flex items-center gap-0.5 hover:opacity-80">
              전체 <ChevronRight size={12} />
            </Link>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-semibold">종목</th>
                <th className="text-right px-4 py-2.5 font-semibold">보유량</th>
                <th className="text-right px-4 py-2.5 font-semibold">평가금액</th>
                <th className="text-right px-4 py-2.5 font-semibold">평가손익</th>
                <th className="text-right px-5 py-2.5 font-semibold">수익률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {holdings.map(h => (
                <tr key={h.stockId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: `hsl(${parseInt(h.stockId) * 47 % 360}, 65%, 50%)` }}>
                        {h.stock.name[0]}
                      </div>
                      <Link href={`/trading/${h.stockId}`}
                        className="text-sm font-semibold text-gray-800 hover:text-[#0046FF] transition-colors">
                        {h.stock.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{h.quantity}주</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-800">{fmt(h.currentValue)}원</td>
                  <td className={`px-4 py-3 text-right text-sm font-bold ${h.profitLoss >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                    {h.profitLoss >= 0 ? '+' : ''}{fmt(h.profitLoss)}원
                  </td>
                  <td className={`px-5 py-3 text-right text-sm font-bold ${h.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                    {h.profitLossRate >= 0 ? '+' : ''}{h.profitLossRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 인기 종목 */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-800">인기 종목</span>
            <Link href="/trading" className="text-xs text-[#0046FF] font-semibold flex items-center gap-0.5 hover:opacity-80">
              전체 <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {POPULAR_STOCKS.map((stock, i) => (
              <Link href={`/trading/${stock.id}`} key={stock.id}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-2 py-2 -mx-2 transition-colors">
                <span className="text-xs font-bold text-gray-400 w-3">{i + 1}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: `hsl(${parseInt(stock.id) * 47 % 360}, 65%, 50%)` }}>
                  {stock.name[0]}
                </div>
                <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{stock.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{stock.currentPrice.toLocaleString('ko-KR')}</p>
                  <p className={`text-xs font-semibold ${stock.changeRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                    {stock.changeRate >= 0 ? '+' : ''}{stock.changeRate.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
