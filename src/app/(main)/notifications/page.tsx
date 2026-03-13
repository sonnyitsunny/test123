'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bell, GraduationCap, Zap, Users, CheckCircle, XCircle } from 'lucide-react';
import { NOTIFICATIONS } from '@/data/dummy';
import type { Notification, NotificationType } from '@/types';

type Category = '전체' | '멘토신청' | '주문체결' | '팔로우';

const categoryMap: Record<Category, NotificationType[]> = {
  '전체': ['mentor_request', 'mentor_accepted', 'mentor_rejected', 'follow_trade', 'order_executed'],
  '멘토신청': ['mentor_request', 'mentor_accepted', 'mentor_rejected'],
  '주문체결': ['order_executed'],
  '팔로우': ['follow_trade'],
};

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [category, setCategory] = useState<Category>('전체');

  const filtered = useMemo(() =>
    notifications.filter(n => categoryMap[category].includes(n.type)),
    [notifications, category]
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMentorResponse = (notifId: string, accept: boolean) => {
    setNotifications(prev => prev.map(n => {
      if (n.id !== notifId) return n;
      return {
        ...n,
        isRead: true,
        mentorRequestData: n.mentorRequestData
          ? { ...n.mentorRequestData, status: (accept ? 'accepted' : 'rejected') as 'pending' | 'accepted' | 'rejected' }
          : undefined,
      };
    }));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'mentor_request': return <GraduationCap size={18} className="text-yellow-500" />;
      case 'mentor_accepted': return <CheckCircle size={18} className="text-green-500" />;
      case 'mentor_rejected': return <XCircle size={18} className="text-red-400" />;
      case 'follow_trade': return <Users size={18} style={{ color: '#0046FF' }} />;
      case 'order_executed': return <Zap size={18} className="text-orange-500" />;
    }
  };

  const getBg = (type: NotificationType) => {
    switch (type) {
      case 'mentor_request': return 'bg-yellow-50';
      case 'mentor_accepted': return 'bg-green-50';
      case 'mentor_rejected': return 'bg-red-50';
      case 'follow_trade': return 'bg-blue-50';
      case 'order_executed': return 'bg-orange-50';
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Bell size={22} style={{ color: '#0046FF' }} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">알림</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-0.5">읽지 않은 알림 {unreadCount}개</p>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['전체', '멘토신청', '주문체결', '팔로우'] as Category[]).map(c => {
          const count = notifications.filter(n => categoryMap[c].includes(n.type) && !n.isRead).length;
          return (
            <button key={c} onClick={() => setCategory(c)}
              className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${category === c ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              style={category === c ? { backgroundColor: '#0046FF' } : {}}>
              {c}
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-24">
          <Bell size={48} className="mb-3 text-gray-200" />
          <p className="text-sm text-gray-400">알림이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(notif => {
            const isPending = notif.type === 'mentor_request' && notif.mentorRequestData?.status === 'pending';
            return (
              <div
                key={notif.id}
                onClick={() => !notif.isRead && markRead(notif.id)}
                className={`bg-white rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead ? 'border-gray-100' : 'border-[#0046FF]/20 shadow-sm'
                }`}>
                <div className="flex gap-4 p-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(notif.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{notif.message}</p>

                    {/* Follow Trade detail */}
                    {notif.type === 'follow_trade' && notif.tradeData && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5">
                          <span className={`font-semibold ${notif.tradeData.tradeType === 'buy' ? 'text-red-500' : 'text-blue-600'}`}>
                            {notif.tradeData.tradeType === 'buy' ? '매수' : '매도'}
                          </span>
                          <span>{notif.tradeData.stockName}</span>
                          <span>{notif.tradeData.price.toLocaleString('ko-KR')}원</span>
                          <span>{notif.tradeData.quantity}주</span>
                        </div>
                        <Link href={`/profile/${notif.tradeData.investorId}`}
                          onClick={e => e.stopPropagation()}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors text-white hover:opacity-90"
                          style={{ backgroundColor: '#0046FF' }}>
                          프로필 보기
                        </Link>
                      </div>
                    )}

                    {/* Mentor Request: accept/reject buttons */}
                    {isPending && notif.mentorRequestData && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={e => { e.stopPropagation(); handleMentorResponse(notif.id, true); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-colors">
                          <CheckCircle size={13} />
                          수락
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); handleMentorResponse(notif.id, false); }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-400 hover:bg-red-500 transition-colors">
                          <XCircle size={13} />
                          거절
                        </button>
                        <Link href={`/profile/${notif.mentorRequestData.requesterId}`}
                          onClick={e => e.stopPropagation()}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                          프로필 보기
                        </Link>
                      </div>
                    )}

                    {/* Mentor request resolved status */}
                    {notif.type === 'mentor_request' && notif.mentorRequestData?.status !== 'pending' && (
                      <div className="mt-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          notif.mentorRequestData?.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {notif.mentorRequestData?.status === 'accepted' ? '수락됨' : '거절됨'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
