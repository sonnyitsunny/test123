'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Search, TrendingUp, TrendingDown, MessageCircle } from 'lucide-react';
import { TRADE_JOURNALS } from '@/data/dummy';
import type { TradeJournal } from '@/types';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function TradeJournalPage() {
  const [journals] = useState<TradeJournal[]>(TRADE_JOURNALS);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    journals.filter(j => j.stock.name.includes(search) || j.stock.code.includes(search)),
    [journals, search]
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen size={22} style={{ color: '#0046FF' }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">매매일지</h1>
            <p className="text-sm text-gray-400 mt-0.5">나의 매매 기록과 투자 근거를 관리하세요</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3.5 py-2.5">
          <Search size={15} className="text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="종목으로 검색"
            className="bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 w-40" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24">
          <BookOpen size={48} className="mb-3 text-gray-200" />
          <p className="text-sm font-medium text-gray-500">작성된 일지가 없습니다.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(j => {
            const isProfit = (j.profitLoss ?? 0) >= 0;
            const hasComments = j.comments.length > 0;
            return (
              <Link key={j.id} href={`/trade-journal/${j.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm hover:border-[#0046FF]/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${j.tradeType === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {j.tradeType === 'buy' ? '매수' : '매도'}
                      </span>
                      <span className="text-base font-bold text-gray-900 group-hover:text-[#0046FF] transition-colors">
                        {j.stock.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {j.quantity}주 · {j.price.toLocaleString('ko-KR')}원 · {new Date(j.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {j.profitLoss !== undefined && (
                      <div className={`flex items-center gap-0.5 text-sm font-bold ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                        {isProfit ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                        {isProfit ? '+' : ''}{fmtM(j.profitLoss)}원
                      </div>
                    )}
                    {hasComments && (
                      <div className="flex items-center gap-1 text-xs text-[#0046FF] bg-blue-50 px-2 py-1 rounded-full">
                        <MessageCircle size={11} />
                        <span>{j.comments.length}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{j.memo}</p>
                {hasComments && (
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-[#0046FF]">{j.comments[j.comments.length - 1].authorNickname}</span>
                      {' · '}{j.comments[j.comments.length - 1].content.slice(0, 40)}
                      {j.comments[j.comments.length - 1].content.length > 40 ? '...' : ''}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
