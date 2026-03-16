'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generatePriceHistory } from '@/data/dummy';
import type { MarketIndex } from '@/types';

type Period = '일' | '주' | '월' | '년';

const PERIOD_DAYS: Record<Period, number> = { '일': 1, '주': 7, '월': 30, '년': 365 };

// USD/KRW는 소수점 없이, 지수는 소수점 2자리
function formatValue(name: string, value: number) {
  if (name === 'USD/KRW') return value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface Props {
  idx: MarketIndex;
  compact?: boolean; // home 페이지용 compact 스타일
}

export default function MarketIndexCard({ idx, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [period, setPeriod] = useState<Period>('일');

  const isUp = idx.changeRate >= 0;
  const chartData = generatePriceHistory(idx.value, PERIOD_DAYS[period]);

  // 지수/환율이므로 tooltip 단위 조정
  const isForex = idx.name === 'USD/KRW';
  const unit = isForex ? '원' : 'pt';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-left w-full hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
      >
        {compact ? (
          // home 페이지 스타일
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">{idx.name}</span>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {isUp ? '+' : ''}{idx.changeRate.toFixed(2)}%
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatValue(idx.name, idx.value)}</p>
            <p className={`text-sm font-semibold mt-0.5 ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
              {isUp ? '+' : ''}{idx.change.toLocaleString('ko-KR')} {unit}
            </p>
          </>
        ) : (
          // trading 페이지 스타일
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">{idx.name}</span>
              {isUp ? <TrendingUp size={14} className="text-red-500" /> : <TrendingDown size={14} className="text-blue-600" />}
            </div>
            <p className="text-xl font-bold text-gray-900">{formatValue(idx.name, idx.value)}</p>
            <p className={`text-sm font-semibold mt-0.5 ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
              {isUp ? '+' : ''}{idx.change.toLocaleString('ko-KR')} ({isUp ? '+' : ''}{idx.changeRate.toFixed(2)}%)
            </p>
          </>
        )}
      </button>

      {/* 차트 모달 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl z-10 shadow-2xl">
            {/* 헤더 */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{idx.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-gray-900">{formatValue(idx.name, idx.value)}</span>
                  <span className={`text-sm font-bold flex items-center gap-0.5 ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isUp ? '+' : ''}{idx.change.toLocaleString('ko-KR')} ({isUp ? '+' : ''}{idx.changeRate.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* 기간 선택 */}
            <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-4 w-fit">
              {(['일', '주', '월', '년'] as Period[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${period === p ? 'text-white' : 'text-gray-500 hover:bg-white'}`}
                  style={period === p ? { backgroundColor: '#0046FF' } : {}}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 차트 */}
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(chartData.length / 5)}
                  />
                  <YAxis
                    domain={[
                      (min: number) => Math.floor(min * 0.998),
                      (max: number) => Math.ceil(max * 1.002),
                    ]}
                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => v.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}
                    formatter={(val) => [Number(val).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), idx.name]}
                    labelStyle={{ color: '#6B7280', marginBottom: 4 }}
                  />
                  <ReferenceLine y={chartData[0]?.price} stroke="#E5E7EB" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={isUp ? '#E53E3E' : '#2B6CB0'}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: isUp ? '#E53E3E' : '#2B6CB0' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 기간 요약 */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              {[
                { label: '시작', value: chartData[0]?.price ?? 0 },
                { label: '최고', value: Math.max(...chartData.map(d => d.price)) },
                { label: '최저', value: Math.min(...chartData.map(d => d.price)) },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                  <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800">
                    {item.value.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
