'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, X, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { STOCKS, MY_PORTFOLIO, MY_PENDING_ORDERS, TRADE_HISTORIES, generatePriceHistory } from '@/data/dummy';
import StockChart from '@/components/charts/StockChart';
import type { PendingOrder } from '@/types';

type ChartPeriod = '일' | '주' | '월' | '년';
type OrderType = '시장가' | '지정가';
type OrderSide = 'buy' | 'sell';
type DetailTab = '미체결' | '체결';

function fmt(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

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
  const [journalMemo, setJournalMemo] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>('미체결');

  // 미체결 주문 상태 (이 종목 것만)
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(
    MY_PENDING_ORDERS.filter(o => o.stockId === id)
  );

  // 체결 내역 (이 종목 것만)
  const executedOrders = TRADE_HISTORIES.filter(h => h.stock.id === id);

  if (!stock) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">종목을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isUp = stock.changeRate >= 0;
  const holding = MY_PORTFOLIO.holdings.find(h => h.stockId === stock.id);
  const priceHistory = useMemo(
    () => generatePriceHistory(
      stock.currentPrice,
      chartPeriod === '일' ? 1 : chartPeriod === '주' ? 7 : chartPeriod === '월' ? 30 : 365
    ),
    [stock.currentPrice, chartPeriod]
  );
  const [orderBook] = useState(() => generateOrderBook(stock.currentPrice));

  const execPrice = orderType === '시장가'
    ? stock.currentPrice
    : Number(limitPrice.replace(/,/g, '')) || stock.currentPrice;
  const qty = parseInt(quantity) || 0;
  const totalAmount = execPrice * qty;

  const maxBuyQty = Math.floor(MY_PORTFOLIO.cash / stock.currentPrice);
  const maxSellQty = holding ? holding.quantity : 0;

  const canSubmitOrder = qty > 0 && journalMemo.trim().length > 0;

  const handleOpenModal = (side: OrderSide) => {
    setOrderModal({ side });
    setOrderType('시장가');
    setQuantity('');
    setLimitPrice('');
    setJournalMemo('');
  };

  const handleCloseModal = () => {
    setOrderModal(null);
    setQuantity('');
    setLimitPrice('');
    setJournalMemo('');
  };

  const handleProceedToConfirm = () => {
    setOrderModal(null);
    setShowConfirm(true);
  };

  const handleOrderConfirm = () => {
    setShowConfirm(false);
    setQuantity('');
    setLimitPrice('');
    setJournalMemo('');
  };

  const handleCancelPendingOrder = (orderId: string) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="p-8 max-w-6xl">
      {/* Back + Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: `hsl(${parseInt(stock.id) * 47 % 360}, 65%, 50%)` }}
          >
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
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${chartPeriod === p ? 'text-white' : 'text-gray-500 hover:bg-white'}`}
                    style={chartPeriod === p ? { backgroundColor: '#0046FF' } : {}}
                  >
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

          {/* 미체결 / 체결 내역 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-4 w-fit">
              {(['미체결', '체결'] as DetailTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${detailTab === tab ? 'text-white' : 'text-gray-500 hover:bg-white'}`}
                  style={detailTab === tab ? { backgroundColor: '#0046FF' } : {}}
                >
                  {tab} 내역
                  {tab === '미체결' && pendingOrders.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                      {pendingOrders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 미체결 내역 */}
            {detailTab === '미체결' && (
              <>
                {pendingOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Clock size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">미체결 주문이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-2 px-3 py-1.5 text-[11px] font-semibold text-gray-400">
                      <span>구분</span>
                      <span>주문유형</span>
                      <span className="text-right">주문가격</span>
                      <span className="text-right">수량</span>
                      <span className="text-right">주문금액</span>
                      <span className="text-right">취소</span>
                    </div>
                    {pendingOrders.map(order => (
                      <div key={order.id} className="grid grid-cols-6 gap-2 items-center px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <span className={`text-xs font-bold ${order.type === 'buy' ? 'text-red-500' : 'text-blue-600'}`}>
                          {order.type === 'buy' ? '매수' : '매도'}
                        </span>
                        <span className="text-xs text-gray-500">{order.orderType}</span>
                        <span className="text-xs font-medium text-gray-800 text-right">{order.price.toLocaleString('ko-KR')}원</span>
                        <span className="text-xs font-medium text-gray-800 text-right">{order.quantity}주</span>
                        <span className="text-xs font-medium text-gray-800 text-right">{fmt(order.totalAmount)}원</span>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleCancelPendingOrder(order.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors"
                          >
                            <XCircle size={12} />
                            취소
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 체결 내역 */}
            {detailTab === '체결' && (
              <>
                {executedOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <CheckCircle2 size={32} className="mb-2 opacity-40" />
                    <p className="text-sm">체결 내역이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2 px-3 py-1.5 text-[11px] font-semibold text-gray-400">
                      <span>구분</span>
                      <span className="text-right">체결가격</span>
                      <span className="text-right">수량</span>
                      <span className="text-right">체결금액</span>
                      <span className="text-right">체결일시</span>
                    </div>
                    {executedOrders.map(order => (
                      <div key={order.id} className="grid grid-cols-5 gap-2 items-center px-3 py-2.5 rounded-xl bg-gray-50">
                        <span className={`text-xs font-bold ${order.type === 'buy' ? 'text-red-500' : 'text-blue-600'}`}>
                          {order.type === 'buy' ? '매수' : '매도'}
                        </span>
                        <span className="text-xs font-medium text-gray-800 text-right">{order.price.toLocaleString('ko-KR')}원</span>
                        <span className="text-xs font-medium text-gray-800 text-right">{order.quantity}주</span>
                        <span className="text-xs font-medium text-gray-800 text-right">{fmt(order.totalAmount)}원</span>
                        <span className="text-xs text-gray-400 text-right">
                          {new Date(order.executedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: My Holdings + My Cash + Order Book */}
        <div className="space-y-4">
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

          {/* My Cash + 매수/매도 버튼 */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">보유 원화</p>
            <p className="text-lg font-bold text-gray-900 mb-3">{MY_PORTFOLIO.cash.toLocaleString('ko-KR')}원</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal('buy')}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#E53E3E' }}
              >
                매수
              </button>
              <button
                onClick={() => handleOpenModal('sell')}
                className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                매도
              </button>
            </div>
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

      {/* 매수/매도 통합 모달 (매매일지 포함) */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
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
              <button onClick={handleCloseModal}><X size={20} className="text-gray-400" /></button>
            </div>

            {/* 주문 가능금액 */}
            <div className={`rounded-xl px-4 py-3 mb-4 ${orderModal.side === 'buy' ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500">주문 가능금액</span>
                <span className={`text-sm font-bold ${orderModal.side === 'buy' ? 'text-red-600' : 'text-blue-600'}`}>
                  {MY_PORTFOLIO.cash.toLocaleString('ko-KR')}원
                </span>
              </div>
              {orderModal.side === 'sell' && holding && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-semibold text-gray-500">보유수량</span>
                  <span className="text-sm font-bold text-blue-600">{holding.quantity}주</span>
                </div>
              )}
            </div>

            {/* 주문 유형 */}
            <div className="flex gap-2 mb-4">
              {(['시장가', '지정가'] as OrderType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${orderType === t ? 'text-white' : 'bg-gray-100 text-gray-500'}`}
                  style={orderType === t ? { backgroundColor: '#0046FF' } : {}}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* 가격 (지정가만) */}
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

            {/* 수량 */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">수량 (주)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="0"
                step="1"
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] transition-colors"
              />
              {orderModal.side === 'buy' && (
                <p className="text-xs text-gray-400 mt-1">최대 {maxBuyQty}주 매수 가능</p>
              )}
              {orderModal.side === 'sell' && holding && (
                <p className="text-xs text-gray-400 mt-1">최대 {maxSellQty}주 매도 가능</p>
              )}
            </div>

            {/* 주문금액 */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">주문금액</span>
                <span className="font-bold text-gray-900">{qty > 0 ? totalAmount.toLocaleString('ko-KR') : '-'}원</span>
              </div>
            </div>

            {/* 매매일지 (필수) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  매매일지 <span className="text-red-400">*</span>
                  <span className="text-xs font-normal text-gray-400 ml-1">(필수 작성)</span>
                </label>
                <span className={`text-xs ${journalMemo.length > 450 ? 'text-red-400' : 'text-gray-400'}`}>
                  {journalMemo.length}/500
                </span>
              </div>
              <textarea
                value={journalMemo}
                onChange={e => e.target.value.length <= 500 && setJournalMemo(e.target.value)}
                placeholder="이 종목을 매수/매도한 이유, 전략, 목표가 등을 기록하세요."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all resize-none leading-relaxed"
              />
              {!journalMemo.trim() && qty > 0 && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle size={11} />
                  매매일지를 작성해야 주문할 수 있습니다.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm"
              >
                취소
              </button>
              <button
                onClick={handleProceedToConfirm}
                disabled={!canSubmitOrder}
                className={`flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40 hover:opacity-90 transition-opacity ${orderModal.side === 'buy' ? 'bg-red-500' : 'bg-blue-600'}`}
              >
                {orderModal.side === 'buy' ? '매수하기' : '매도하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 주문 최종 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl text-center">
            <AlertCircle
              size={32}
              className={`mx-auto mb-3 ${orderModal?.side === 'buy' || qty > 0 ? 'text-red-500' : 'text-blue-600'}`}
            />
            <h3 className="text-base font-bold text-gray-900 mb-2">주문 확인</h3>
            <p className="text-sm text-gray-500 mb-1">
              {stock.name} {execPrice > 0 ? (execPrice === stock.currentPrice ? '시장가' : `${execPrice.toLocaleString('ko-KR')}원`) : ''}
            </p>
            <p className="text-lg font-bold text-gray-900 mb-1">{qty}주 · {totalAmount.toLocaleString('ko-KR')}원</p>
            <p className="text-xs text-gray-400 mb-5">매매일지가 함께 저장됩니다.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm"
              >
                취소
              </button>
              <button
                onClick={handleOrderConfirm}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm bg-red-500"
              >
                체결
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
