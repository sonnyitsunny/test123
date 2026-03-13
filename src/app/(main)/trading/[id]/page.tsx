'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, X, AlertCircle } from 'lucide-react';
import { STOCKS, MY_PORTFOLIO, generatePriceHistory } from '@/data/dummy';
import StockChart from '@/components/charts/StockChart';

type ChartPeriod = '일' | '주' | '월' | '년';
type OrderType = '시장가' | '지정가';
type OrderSide = 'buy' | 'sell';

function fmt(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

// 호가 10단계 생성
function generateOrderBook(price: number) {
  const step = Math.round(price * 0.003);
  const asks = Array.from({ length: 10 }, (_, i) => ({
    price: price + step * (10 - i),
    volume: Math.floor(Math.random() * 5000) + 500,
  }));
  const bids = Array.from({ length: 10 }, (_, i) => ({
    price: price - step * (i + 1),
    volume: Math.floor(Math.random() * 5000) + 500,
  }));
  return { asks, bids };
}

export default function StockDetailPage() {
  'use no memo';
  const rawParams = useParams();
  const id = rawParams.id as string;
  const router = useRouter();
  const stock = STOCKS.find(s => s.id === id);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('일');
  const [orderModal, setOrderModal] = useState<{ side: OrderSide } | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('시장가');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [journalModal, setJournalModal] = useState(false);
  const [journalMemo, setJournalMemo] = useState('');
  const [pendingOrderSide, setPendingOrderSide] = useState<OrderSide>('buy');

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">종목을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isUp = stock.changeRate >= 0;
  const holding = MY_PORTFOLIO.holdings.find(h => h.stockId === stock.id);
  const priceHistory = generatePriceHistory(stock.currentPrice, chartPeriod === '일' ? 1 : chartPeriod === '주' ? 7 : chartPeriod === '월' ? 30 : 365);
  const orderBook = generateOrderBook(stock.currentPrice);

  const execPrice = orderType === '시장가' ? stock.currentPrice : Number(limitPrice.replace(/,/g, '')) || stock.currentPrice;
  const qty = parseFloat(quantity) || 0;
  const totalAmount = execPrice * qty;

  const handleProceedToJournal = () => {
    setPendingOrderSide(orderModal!.side);
    setOrderModal(null);
    setJournalModal(true);
  };

  const handleJournalNext = () => {
    setJournalModal(false);
    setShowConfirm(true);
  };

  const handleOrderConfirm = () => {
    setShowConfirm(false);
    setQuantity('');
    setLimitPrice('');
    setJournalMemo('');
  };

  return (
    <div className="p-8 max-w-6xl">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: `hsl(${parseInt(stock.id) * 47 % 360}, 65%, 50%)` }}>
            {stock.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{stock.name}</h1>
              <span className="text-sm text-gray-400 font-mono">{stock.code}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{stock.sector}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-bold text-gray-900">{stock.currentPrice.toLocaleString('ko-KR')}원</span>
              <span className={`flex items-center gap-0.5 text-sm font-bold ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}{stock.changeAmount.toLocaleString('ko-KR')} ({isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setOrderModal({ side: 'buy' })}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#E53E3E' }}>
            매수
          </button>
          <button onClick={() => setOrderModal({ side: 'sell' })}
            className="px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-colors">
            매도
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Chart + Info */}
        <div className="col-span-2 space-y-4">
          {/* Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">주가 차트</p>
              <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
                {(['일', '주', '월', '년'] as ChartPeriod[]).map(p => (
                  <button key={p} onClick={() => setChartPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${chartPeriod === p ? 'text-white' : 'text-gray-500 hover:bg-white'}`}
                    style={chartPeriod === p ? { backgroundColor: '#0046FF' } : {}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <StockChart data={priceHistory} color={isUp ? '#E53E3E' : '#2B6CB0'} />
          </div>

          {/* Stock Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">종목 정보</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '시가', value: `${stock.open.toLocaleString('ko-KR')}원` },
                { label: '고가', value: `${stock.high.toLocaleString('ko-KR')}원`, color: 'text-red-500' },
                { label: '저가', value: `${stock.low.toLocaleString('ko-KR')}원`, color: 'text-blue-600' },
                { label: '전일종가', value: `${stock.previousClose.toLocaleString('ko-KR')}원` },
                { label: '거래량', value: fmt(stock.volume) },
                { label: '시가총액', value: `${fmt(stock.marketCap)}원` },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.color || 'text-gray-800'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Book + My Holdings */}
        <div className="space-y-4">
          {/* My Holdings */}
          {holding && (
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">내 보유 현황</p>
              <div className="space-y-2">
                {[
                  { label: '보유수량', value: `${holding.quantity}주` },
                  { label: '평균매수가', value: `${holding.avgPrice.toLocaleString('ko-KR')}원` },
                  { label: '평가금액', value: `${fmt(holding.currentValue)}원` },
                  { label: '평가손익', value: `${holding.profitLoss >= 0 ? '+' : ''}${fmt(holding.profitLoss)}원`, color: holding.profitLoss >= 0 ? 'text-red-500' : 'text-blue-600' },
                  { label: '수익률', value: `${holding.profitLossRate >= 0 ? '+' : ''}${holding.profitLossRate.toFixed(2)}%`, color: holding.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.color || 'text-gray-800'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Cash */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">보유 원화</p>
            <p className="text-lg font-bold text-gray-900">{fmt(MY_PORTFOLIO.cash)}원</p>
          </div>

          {/* Order Book */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">호가 (10단계)</p>
            <div className="space-y-0.5">
              {orderBook.asks.map((ask, i) => (
                <div key={i} className="flex justify-between text-xs py-0.5 px-2 rounded hover:bg-blue-50 cursor-pointer">
                  <span className="text-blue-600 font-medium">{ask.price.toLocaleString('ko-KR')}</span>
                  <div className="flex-1 flex justify-end">
                    <div className="bg-blue-100 h-3 rounded-sm self-center" style={{ width: `${Math.min(ask.volume / 100, 60)}px` }} />
                  </div>
                  <span className="text-gray-400 w-16 text-right">{ask.volume.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-1.5 px-2 bg-gray-50 rounded-lg my-1">
                <span className="text-sm font-bold text-gray-800">{stock.currentPrice.toLocaleString('ko-KR')}</span>
                <span className={`text-xs font-semibold ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
                  {isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%
                </span>
              </div>
              {orderBook.bids.map((bid, i) => (
                <div key={i} className="flex justify-between text-xs py-0.5 px-2 rounded hover:bg-red-50 cursor-pointer">
                  <span className="text-red-500 font-medium">{bid.price.toLocaleString('ko-KR')}</span>
                  <div className="flex-1 flex justify-end">
                    <div className="bg-red-100 h-3 rounded-sm self-center" style={{ width: `${Math.min(bid.volume / 100, 60)}px` }} />
                  </div>
                  <span className="text-gray-400 w-16 text-right">{bid.volume.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModal && !showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOrderModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  <span className={orderModal.side === 'buy' ? 'text-red-500' : 'text-blue-600'}>
                    {orderModal.side === 'buy' ? '매수' : '매도'}
                  </span>
                  {' '}{stock.name}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">현재가: {stock.currentPrice.toLocaleString('ko-KR')}원</p>
              </div>
              <button onClick={() => setOrderModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>

            {/* Order Type */}
            <div className="flex gap-2 mb-4">
              {(['시장가', '지정가'] as OrderType[]).map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${orderType === t ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                  style={orderType === t ? { backgroundColor: '#0046FF' } : {}}>
                  {t}
                </button>
              ))}
            </div>

            {/* Price (지정가 only) */}
            {orderType === '지정가' && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">주문가격 (원)</label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={e => setLimitPrice(e.target.value)}
                  placeholder={stock.currentPrice.toString()}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] transition-colors"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">수량 (소수점 가능)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] transition-colors"
              />
              {orderModal.side === 'buy' && (
                <p className="text-xs text-gray-400 mt-1">최대 {Math.floor(MY_PORTFOLIO.cash / stock.currentPrice * 100) / 100}주 매수 가능</p>
              )}
              {orderModal.side === 'sell' && holding && (
                <p className="text-xs text-gray-400 mt-1">최대 {holding.quantity}주 매도 가능</p>
              )}
            </div>

            {/* Total */}
            {qty > 0 && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">주문금액</span>
                  <span className="font-bold text-gray-900">{fmt(totalAmount)}원</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setOrderModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button
                onClick={handleProceedToJournal}
                disabled={qty <= 0}
                className={`flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity ${orderModal.side === 'buy' ? 'bg-red-500' : 'bg-blue-600'}`}>
                {orderModal.side === 'buy' ? '매수하기' : '매도하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl text-center">
            <AlertCircle size={32} className={`mx-auto mb-3 ${pendingOrderSide === 'buy' ? 'text-red-500' : 'text-blue-600'}`} />
            <h3 className="text-base font-bold text-gray-900 mb-2">주문 확인</h3>
            <p className="text-sm text-gray-500 mb-1">{stock.name} {pendingOrderSide === 'buy' ? '매수' : '매도'}</p>
            <p className="text-lg font-bold text-gray-900 mb-5">{qty}주 · {fmt(totalAmount)}원</p>
            <div className="flex gap-2">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={handleOrderConfirm}
                className={`flex-1 py-3 rounded-xl text-white font-bold text-sm ${pendingOrderSide === 'buy' ? 'bg-red-500' : 'bg-blue-600'}`}>
                체결
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Write Modal (required BEFORE order confirm) */}
      {journalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg z-10 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={18} className={pendingOrderSide === 'buy' ? 'text-red-500' : 'text-blue-600'} />
              <h3 className="text-lg font-bold text-gray-900">매매일지 작성</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">매매일지를 작성해야 주문을 확인할 수 있습니다.</p>
            <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-medium ${pendingOrderSide === 'buy' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
              {stock.name} · {pendingOrderSide === 'buy' ? '매수' : '매도'} · {qty}주 · {execPrice.toLocaleString('ko-KR')}원 · 합계 {fmt(totalAmount)}원
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">매매 이유 / 전략 <span className="text-red-400">*</span></label>
                <span className={`text-xs ${journalMemo.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>{journalMemo.length}/500</span>
              </div>
              <textarea
                value={journalMemo}
                onChange={e => e.target.value.length <= 500 && setJournalMemo(e.target.value)}
                placeholder="이 종목을 매수/매도한 이유, 전략, 목표가 등을 기록하세요."
                rows={6}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all resize-none leading-relaxed"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setJournalModal(false); setJournalMemo(''); }}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">
                취소
              </button>
              <button
                onClick={handleJournalNext}
                disabled={!journalMemo.trim()}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#0046FF' }}>
                다음: 주문 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
