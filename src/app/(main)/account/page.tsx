'use client';

import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { MY_PORTFOLIO } from '@/data/dummy';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';

function fmt(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function AccountPage() {
  const { totalInvestment, totalValue, totalProfitLoss, totalProfitLossRate, cash, holdings } = MY_PORTFOLIO;

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Wallet size={22} style={{ color: '#0046FF' }} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 계좌</h1>
          <p className="text-sm text-gray-400 mt-0.5">나의 투자 현황을 한눈에 확인하세요</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-2 rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0046FF 0%, #0035CC 100%)' }}>
          <div className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(30%, -30%)' }} />
          <p className="text-xs text-blue-200 mb-1">보유 총 자산</p>
          <p className="text-2xl font-bold mb-1">{fmt(totalValue)}원</p>
          <p className={`text-sm font-semibold ${totalProfitLoss >= 0 ? 'text-yellow-300' : 'text-red-300'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{fmt(totalProfitLoss)}원 ({totalProfitLossRate >= 0 ? '+' : ''}{totalProfitLossRate.toFixed(2)}%)
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">보유 현금</p>
          <p className="text-xl font-bold text-gray-900">{fmt(cash)}원</p>
          <p className="text-xs text-gray-400 mt-1">투자원금 {fmt(totalInvestment)}원</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">보유 종목</p>
          <p className="text-xl font-bold text-gray-900">{holdings.length}개</p>
          <p className="text-xs text-gray-400 mt-1">총 평가액 {fmt(totalValue - cash)}원</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 mb-1">수익률</p>
          <p className={`text-xl font-bold ${totalProfitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
            {totalProfitLossRate >= 0 ? '+' : ''}{totalProfitLossRate.toFixed(2)}%
          </p>
          <p className={`text-xs font-semibold mt-1 ${totalProfitLoss >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}{fmt(totalProfitLoss)}원
          </p>
        </div>
      </div>

      {/* Chart + Holdings Detail */}
      <div className="grid grid-cols-5 gap-5 mb-6">
        {/* Pie Chart */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-bold text-gray-800 mb-4">종목 비중</p>
          <PortfolioPieChart holdings={holdings} />
        </div>

        {/* Holdings Table */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-800">보유 종목 상세</p>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-semibold">종목</th>
                <th className="text-right px-3 py-2.5 font-semibold">수량</th>
                <th className="text-right px-3 py-2.5 font-semibold">평균단가</th>
                <th className="text-right px-3 py-2.5 font-semibold">현재가</th>
                <th className="text-right px-3 py-2.5 font-semibold">평가액</th>
                <th className="text-right px-5 py-2.5 font-semibold">수익률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {holdings.map(h => (
                <tr key={h.stockId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: `hsl(${parseInt(h.stockId) * 47 % 360}, 65%, 50%)` }}>
                        {h.stock.name[0]}
                      </div>
                      <div>
                        <Link href={`/trading/${h.stockId}`}
                          className="text-sm font-semibold text-gray-800 hover:text-[#0046FF] transition-colors block">
                          {h.stock.name}
                        </Link>
                        <p className="text-[10px] text-gray-400">{h.stock.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-gray-600">{h.quantity}주</td>
                  <td className="px-3 py-3 text-right text-sm text-gray-600">{h.avgPrice.toLocaleString('ko-KR')}원</td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-800">{h.stock.currentPrice.toLocaleString('ko-KR')}원</td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-800">{fmt(h.currentValue)}원</td>
                  <td className="px-5 py-3 text-right">
                    <div className={`flex flex-col items-end ${h.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                      <div className="flex items-center gap-0.5 text-sm font-bold">
                        {h.profitLossRate >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {h.profitLossRate >= 0 ? '+' : ''}{h.profitLossRate.toFixed(2)}%
                      </div>
                      <span className="text-xs">{h.profitLoss >= 0 ? '+' : ''}{fmt(h.profitLoss)}원</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
