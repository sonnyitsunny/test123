'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { STOCKS, MARKET_INDICES, MY_PORTFOLIO } from '@/data/dummy';

type SortKey = '거래량순' | '상승순' | '하락순' | '고가순';

const SECTORS = ['전체', '반도체', '2차전지', '바이오', '자동차', 'IT', '금융', '철강', '화학', '통신', '가전', '건설'];

function fmt(n: number) {
  if (Math.abs(n) >= 1000000000000) return `${(n / 1000000000000).toFixed(1)}조`;
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(0)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function TradingPage() {
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('전체');
  const [sortKey, setSortKey] = useState<SortKey>('거래량순');

  const filtered = useMemo(() => {
    const list = STOCKS.filter(s =>
      (sector === '전체' || s.sector === sector) &&
      (s.name.includes(search) || s.code.includes(search))
    );
    if (sortKey === '거래량순') return [...list].sort((a, b) => b.volume - a.volume);
    if (sortKey === '상승순') return [...list].sort((a, b) => b.changeRate - a.changeRate);
    if (sortKey === '하락순') return [...list].sort((a, b) => a.changeRate - b.changeRate);
    if (sortKey === '고가순') return [...list].sort((a, b) => b.high - a.high);
    return list;
  }, [search, sector, sortKey]);

  const { holdings } = MY_PORTFOLIO;

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">모의투자</h1>
        <p className="text-sm text-gray-400">KOSPI200 종목으로 실전 같은 모의 매매를 경험하세요</p>
      </div>

      {/* Market Indices */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {MARKET_INDICES.map(idx => (
          <div key={idx.name} className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">{idx.name}</span>
              {idx.changeRate >= 0
                ? <TrendingUp size={14} className="text-red-500" />
                : <TrendingDown size={14} className="text-blue-600" />}
            </div>
            <p className="text-xl font-bold text-gray-900">{idx.value.toLocaleString('ko-KR')}</p>
            <p className={`text-sm font-semibold mt-0.5 ${idx.changeRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
              {idx.changeRate >= 0 ? '+' : ''}{idx.change.toLocaleString('ko-KR')} ({idx.changeRate >= 0 ? '+' : ''}{idx.changeRate.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>

      {/* Search + Filter + Sort */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3.5 py-2.5 w-64">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="종목명 또는 코드 검색"
              className="bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 w-full" />
          </div>
          {/* Sort buttons */}
          <div className="flex gap-1.5">
            {(['거래량순', '상승순', '하락순', '고가순'] as SortKey[]).map(s => (
              <button key={s} onClick={() => setSortKey(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${sortKey === s ? 'text-white' : 'text-gray-500 bg-white border border-gray-100 hover:border-gray-200'}`}
                style={sortKey === s ? { backgroundColor: '#0046FF' } : {}}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${sector === s ? 'text-white' : 'text-gray-500 bg-white border border-gray-100 hover:border-gray-200'}`}
              style={sector === s ? { backgroundColor: '#0046FF' } : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stock List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500">
              <th className="text-left px-6 py-3.5 font-semibold">종목명</th>
              <th className="text-center px-4 py-3.5 font-semibold">섹터</th>
              <th className="text-right px-4 py-3.5 font-semibold">현재가</th>
              <th className="text-right px-4 py-3.5 font-semibold">등락률</th>
              <th className="text-right px-4 py-3.5 font-semibold">거래량</th>
              <th className="text-right px-4 py-3.5 font-semibold">시가총액</th>
              <th className="text-center px-6 py-3.5 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(stock => {
              const isUp = stock.changeRate >= 0;
              const holding = MY_PORTFOLIO.holdings.find(h => h.stockId === stock.id);
              return (
                <tr key={stock.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: `hsl(${parseInt(stock.id) * 47 % 360}, 65%, 50%)` }}>
                        {stock.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#0046FF] transition-colors">{stock.name}</p>
                          {holding && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">보유</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{stock.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{stock.sector}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-bold text-gray-900">{stock.currentPrice.toLocaleString('ko-KR')}원</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className={`flex flex-col items-end ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
                      <span className="text-sm font-bold">{isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%</span>
                      <span className="text-xs">{isUp ? '+' : ''}{stock.changeAmount.toLocaleString('ko-KR')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-gray-500">{fmt(stock.volume)}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-gray-500">{fmt(stock.marketCap)}원</td>
                  <td className="px-6 py-3.5 text-center">
                    <Link href={`/trading/${stock.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-white hover:opacity-90"
                      style={{ backgroundColor: '#0046FF' }}>
                      거래 <ChevronRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={36} className="mb-3 text-gray-200" />
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
