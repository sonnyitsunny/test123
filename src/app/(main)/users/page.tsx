'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Users, TrendingUp, UserCheck, UserPlus, GraduationCap } from 'lucide-react';
import { RANKING_USERS, MY_USER } from '@/data/dummy';
import type { RankingUser } from '@/types';

type Period = '주간' | '월간' | '전체';
type TabType = '전체' | '팔로잉';

export default function UsersPage() {
  const [period, setPeriod] = useState<Period>('전체');
  const [tab, setTab] = useState<TabType>('전체');
  const [search, setSearch] = useState('');
  const [following, setFollowing] = useState<Record<string, boolean>>(
    Object.fromEntries(RANKING_USERS.filter(u => u.isFollowing).map(u => [u.id, true]))
  );
  const [mentorRequests, setMentorRequests] = useState<Record<string, boolean>>(
    Object.fromEntries(RANKING_USERS.filter(u => u.isMentorRequestSent).map(u => [u.id, true]))
  );

  const sorted = useMemo(() => {
    let list = [...RANKING_USERS].filter(u => {
      const matchSearch = u.nickname.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === '전체' || following[u.id];
      return matchSearch && matchTab;
    });
    if (period === '주간') list.sort((a, b) => b.weeklyReturnRate - a.weeklyReturnRate);
    else if (period === '월간') list.sort((a, b) => b.monthlyReturnRate - a.monthlyReturnRate);
    else list.sort((a, b) => b.totalReturnRate - a.totalReturnRate);
    return list.map((u, i) => ({ ...u, rank: i + 1 }));
  }, [period, tab, search, following]);

  const getRate = (u: RankingUser) => {
    if (period === '주간') return u.weeklyReturnRate;
    if (period === '월간') return u.monthlyReturnRate;
    return u.totalReturnRate;
  };

  const top3 = sorted.slice(0, 3);
  const rest = search || tab === '팔로잉' ? sorted : sorted.slice(3);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users size={22} style={{ color: '#0046FF' }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">유저 목록</h1>
            <p className="text-sm text-gray-400 mt-0.5">수익률 기준 투자자 랭킹</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3.5 py-2.5">
            <Search size={15} className="text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="닉네임 검색"
              className="bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 w-40" />
          </div>
          <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1">
            {(['주간', '월간', '전체'] as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${period === p ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                style={period === p ? { backgroundColor: '#0046FF' } : {}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit mb-6">
        {(['전체', '팔로잉'] as TabType[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            style={tab === t ? { backgroundColor: '#0046FF' } : {}}>
            {t}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {!search && tab === '전체' && (
        <div className="bg-gradient-to-b from-[#EBF0FF] to-white rounded-2xl p-8 mb-6">
          <div className="flex items-end justify-center gap-6">
            {top3[1] && (
              <div className="flex flex-col items-center">
                <Link href={`/profile/${top3[1].id}`}>
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold mb-2 hover:scale-105 transition-transform">
                    {top3[1].nickname[0]}
                  </div>
                </Link>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold mb-1">2</div>
                <div className="bg-gray-100 rounded-t-xl w-28 h-20 flex flex-col items-center justify-center px-2">
                  <p className="text-xs font-semibold text-gray-700 text-center truncate w-full px-1">{top3[1].nickname}</p>
                  <p className="text-sm font-bold text-red-500 mt-0.5">+{getRate(top3[1]).toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-400">{top3[1].followers}명 팔로워</p>
                </div>
              </div>
            )}
            {top3[0] && (
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">👑</span>
                <Link href={`/profile/${top3[0].id}`}>
                  <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-white text-3xl font-bold mb-2 hover:scale-105 transition-transform">
                    {top3[0].nickname[0]}
                  </div>
                </Link>
                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold mb-1">1</div>
                <div className="rounded-t-xl w-28 h-28 flex flex-col items-center justify-center px-2" style={{ backgroundColor: '#EBF0FF' }}>
                  <p className="text-xs font-semibold text-gray-700 text-center truncate w-full px-1">{top3[0].nickname}</p>
                  <p className="text-lg font-bold text-red-500 mt-0.5">+{getRate(top3[0]).toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-400">{top3[0].followers}명 팔로워</p>
                </div>
              </div>
            )}
            {top3[2] && (
              <div className="flex flex-col items-center">
                <Link href={`/profile/${top3[2].id}`}>
                  <div className="w-16 h-16 rounded-full bg-orange-300 flex items-center justify-center text-white text-2xl font-bold mb-2 hover:scale-105 transition-transform">
                    {top3[2].nickname[0]}
                  </div>
                </Link>
                <div className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center text-white font-bold mb-1">3</div>
                <div className="bg-orange-50 rounded-t-xl w-28 h-16 flex flex-col items-center justify-center px-2">
                  <p className="text-xs font-semibold text-gray-700 text-center truncate w-full px-1">{top3[2].nickname}</p>
                  <p className="text-sm font-bold text-red-500 mt-0.5">+{getRate(top3[2]).toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-400">{top3[2].followers}명 팔로워</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500">
              <th className="text-left px-6 py-3.5 font-semibold w-12">순위</th>
              <th className="text-left px-4 py-3.5 font-semibold">투자자</th>
              <th className="text-right px-4 py-3.5 font-semibold">팔로워</th>
              <th className="text-right px-4 py-3.5 font-semibold">주간</th>
              <th className="text-right px-4 py-3.5 font-semibold">월간</th>
              <th className="text-right px-4 py-3.5 font-semibold">총 수익률</th>
              <th className="text-right px-4 py-3.5 font-semibold">총 수익</th>
              <th className="text-center px-3 py-3.5 font-semibold">팔로우</th>
              <th className="text-center px-3 py-3.5 font-semibold">멘토 신청</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rest.map(user => {
              const isMe = user.id === MY_USER.id;
              const isFollowed = following[user.id];
              const requestSent = mentorRequests[user.id];
              const isMentor = user.id === MY_USER.mentorId;
              return (
                <tr key={user.id} className={`group transition-colors ${isMe ? 'bg-blue-50/40' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                      style={user.rank <= 3 ? { backgroundColor: '#EBF0FF', color: '#0046FF' } : { backgroundColor: '#F9FAFB', color: '#9CA3AF' }}>
                      {user.rank}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: isMe ? '#0046FF' : `hsl(${user.id.charCodeAt(user.id.length - 1) * 40}, 60%, 55%)` }}>
                        {user.nickname[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#0046FF] transition-colors">{user.nickname}</p>
                          {isMe && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold" style={{ backgroundColor: '#0046FF' }}>나</span>}
                          {isMentor && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">내 멘토</span>}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-gray-500">
                      <Users size={12} />
                      <span className="text-sm">{user.followers}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-sm font-semibold ${user.weeklyReturnRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                      {user.weeklyReturnRate >= 0 ? '+' : ''}{user.weeklyReturnRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-sm font-semibold ${user.monthlyReturnRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                      {user.monthlyReturnRate >= 0 ? '+' : ''}{user.monthlyReturnRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-red-500">
                      <TrendingUp size={13} />
                      <span className="text-sm font-bold">+{user.totalReturnRate.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm text-gray-600">
                    +{user.totalReturn.toLocaleString('ko-KR')}원
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    {!isMe && (
                      <button
                        onClick={() => setFollowing(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all mx-auto ${isFollowed ? 'border border-[#0046FF]/30 text-[#0046FF]' : 'text-white hover:opacity-90'}`}
                        style={!isFollowed ? { backgroundColor: '#0046FF' } : { backgroundColor: '#EBF0FF' }}>
                        {isFollowed ? <UserCheck size={12} /> : <UserPlus size={12} />}
                        {isFollowed ? '팔로잉' : '팔로우'}
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    {!isMe && !isMentor && (
                      <button
                        onClick={() => setMentorRequests(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all mx-auto ${requestSent ? 'border border-yellow-400 text-yellow-600 bg-yellow-50' : 'text-white hover:opacity-90 bg-yellow-400'}`}>
                        <GraduationCap size={12} />
                        {requestSent ? '신청완료' : '멘토신청'}
                      </button>
                    )}
                    {isMentor && (
                      <span className="text-xs text-yellow-600 font-semibold">멘토</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rest.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-16 text-sm text-gray-400">검색 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
