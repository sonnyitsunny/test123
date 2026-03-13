'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart2, BookOpen, Users, Bell, User,
  GraduationCap, UserCheck, TrendingUp, LogOut, Home, Wallet
} from 'lucide-react';
import { MY_USER, NOTIFICATIONS } from '@/data/dummy';

const NAV_ITEMS = [
  { href: '/home', icon: Home, label: '홈' },
  { href: '/trading', icon: BarChart2, label: '모의투자' },
  { href: '/account', icon: Wallet, label: '내 계좌' },
  { href: '/trade-journal', icon: BookOpen, label: '매매일지' },
  { href: '/users', icon: Users, label: '유저 목록' },
  { href: '/notifications', icon: Bell, label: '알림' },
  { href: '/mentor', icon: UserCheck, label: '나의 멘토' },
  { href: '/mentees', icon: GraduationCap, label: '나의 멘티' },
  { href: '/profile', icon: User, label: '프로필' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const unreadCount = NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/trading" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0046FF' }}>
            <TrendingUp size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">모의투자</p>
            <p className="text-[10px] text-gray-400">KOSPI200 · 멘토멘티</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/trading' && href !== '/home' && pathname.startsWith(href));
          const badge = href === '/notifications' ? unreadCount : 0;
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
              style={isActive ? { backgroundColor: '#0046FF' } : {}}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-sm">{label}</span>
              {badge > 0 && !isActive && (
                <span className="ml-auto text-[10px] font-bold bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: '#0046FF' }}>
            {MY_USER.nickname[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate">{MY_USER.nickname}</p>
            <p className="text-[11px] text-red-500 font-medium">+{MY_USER.totalReturnRate.toFixed(1)}%</p>
          </div>
        </Link>
        <Link href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors mt-0.5">
          <LogOut size={16} />
          <span className="text-sm">로그아웃</span>
        </Link>
      </div>
    </aside>
  );
}
