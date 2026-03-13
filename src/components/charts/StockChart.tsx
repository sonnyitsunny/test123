'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PricePoint } from '@/types';

interface Props {
  data: PricePoint[];
  color?: string;
}

export default function StockChart({ data, color = '#0046FF' }: Props) {
  const min = Math.min(...data.map(d => d.price));
  const max = Math.max(...data.map(d => d.price));
  const first = data[0]?.price ?? 0;
  const last = data[data.length - 1]?.price ?? 0;
  const isUp = last >= first;
  const lineColor = isUp ? '#E53E3E' : '#2B6CB0';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          interval={Math.floor(data.length / 5)}
        />
        <YAxis
          domain={[min * 0.998, max * 1.002]}
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => (v >= 10000 ? `${(v / 10000).toFixed(0)}만` : v.toLocaleString())}
          width={45}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'white' }}
          formatter={(val) => [`${Number(val).toLocaleString('ko-KR')}원`, '주가']}
          labelStyle={{ color: '#6B7280', marginBottom: 4 }}
        />
        <ReferenceLine y={first} stroke="#E5E7EB" strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="price"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
