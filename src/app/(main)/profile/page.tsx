'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, TrendingUp, TrendingDown, X, Eye, EyeOff, Trash2, Camera, Settings, LogOut } from 'lucide-react';
import { MY_USER, TRADE_JOURNALS, TRADE_HISTORIES, MY_PORTFOLIO, FOLLOWING_USERS } from '@/data/dummy';
import PortfolioPieChart from '@/components/charts/PortfolioPieChart';

type Tab = '매매일지' | '매매내역' | '포트폴리오';
type Modal = null | 'edit' | 'password' | 'logout' | 'delete' | 'followers' | 'following';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function MyProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('매매일지');
  const [modal, setModal] = useState<Modal>(null);
  const [nickname, setNickname] = useState(MY_USER.nickname);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editProfileImage, setEditProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditProfileImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function openEditModal() {
    setEditProfileImage(profileImage);
    setModal('edit');
  }

  function saveProfile() {
    setProfileImage(editProfileImage);
    setModal(null);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Left: Profile Info */}
        <div className="col-span-1 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex flex-col items-center text-center mb-4">
              {profileImage ? (
                <img src={profileImage} alt="프로필" className="w-20 h-20 rounded-full object-cover mb-3" />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3"
                  style={{ backgroundColor: '#0046FF' }}>
                  {MY_USER.nickname[0]}
                </div>
              )}
              <h2 className="text-lg font-bold text-gray-900">{MY_USER.nickname}</h2>
              <p className="text-sm text-gray-400">{MY_USER.email}</p>
            </div>
            {/* Followers / Following */}
            <div className="flex gap-1 mb-4">
              <button onClick={() => setModal('followers')}
                className="flex-1 text-center py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <p className="text-base font-bold text-gray-900">{MY_USER.followers}</p>
                <p className="text-xs text-gray-400">팔로워</p>
              </button>
              <div className="w-px bg-gray-100" />
              <button onClick={() => setModal('following')}
                className="flex-1 text-center py-2 rounded-xl hover:bg-gray-50 transition-colors">
                <p className="text-base font-bold text-gray-900">{MY_USER.following}</p>
                <p className="text-xs text-gray-400">팔로잉</p>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">수익률</p>
                <p className="text-sm font-bold text-red-500">+{MY_USER.totalReturnRate.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">총 수익</p>
                <p className="text-sm font-bold text-red-500">+{fmtM(MY_USER.totalReturn)}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <button onClick={openEditModal}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                <Settings size={14} />
                프로필 편집
              </button>
              <button onClick={() => setModal('logout')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700">
                <LogOut size={14} />
                로그아웃
              </button>
              <button onClick={() => setModal('delete')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors text-sm font-medium text-red-500">
                <Trash2 size={14} />
                회원탈퇴
              </button>
            </div>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['매매일지', '매매내역', '포트폴리오'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === t ? 'text-[#0046FF] border-b-2 border-[#0046FF]' : 'text-gray-400 hover:text-gray-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* 매매일지 Tab */}
            {tab === '매매일지' && (
              <div className="space-y-3">
                {TRADE_JOURNALS.map(j => {
                  const isProfit = (j.profitLoss ?? 0) >= 0;
                  return (
                    <Link href={`/trade-journal/${j.id}`} key={j.id}
                      className="block p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-[#0046FF]/20 transition-all group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${j.tradeType === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            {j.tradeType === 'buy' ? '매수' : '매도'}
                          </span>
                          <span className="text-base font-bold text-gray-900 group-hover:text-[#0046FF] transition-colors">{j.stock.name}</span>
                          <span className="text-sm text-gray-400">{j.quantity}주 · {j.price.toLocaleString('ko-KR')}원</span>
                        </div>
                        {j.profitLoss !== undefined && (
                          <span className={`text-sm font-bold ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                            {isProfit ? '+' : ''}{fmtM(j.profitLoss)}원
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{j.memo}</p>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 매매내역 Tab */}
            {tab === '매매내역' && (
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-4 py-3 font-semibold">종목</th>
                      <th className="text-center px-3 py-3 font-semibold">구분</th>
                      <th className="text-right px-3 py-3 font-semibold">수량</th>
                      <th className="text-right px-3 py-3 font-semibold">체결가</th>
                      <th className="text-right px-3 py-3 font-semibold">체결금액</th>
                      <th className="text-right px-3 py-3 font-semibold">손익</th>
                      <th className="text-right px-4 py-3 font-semibold">날짜</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {TRADE_HISTORIES.map(trade => {
                      const isProfit = (trade.profitLoss ?? 0) >= 0;
                      return (
                        <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: `hsl(${parseInt(trade.stock.id) * 47 % 360}, 65%, 50%)` }}>
                                {trade.stock.name[0]}
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{trade.stock.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trade.type === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              {trade.type === 'buy' ? '매수' : '매도'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right text-sm text-gray-600">{trade.quantity}주</td>
                          <td className="px-3 py-3 text-right text-sm font-medium text-gray-800">{trade.price.toLocaleString('ko-KR')}원</td>
                          <td className="px-3 py-3 text-right text-sm text-gray-600">{fmtM(trade.totalAmount)}원</td>
                          <td className="px-3 py-3 text-right">
                            {trade.profitLoss !== undefined ? (
                              <div className={`flex flex-col items-end ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
                                <div className="flex items-center gap-0.5 text-xs font-bold">
                                  {isProfit ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                  {isProfit ? '+' : ''}{fmtM(trade.profitLoss)}원
                                </div>
                                <span className="text-[11px]">{isProfit ? '+' : ''}{trade.profitLossRate?.toFixed(2)}%</span>
                              </div>
                            ) : <span className="text-xs text-gray-300">-</span>}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-gray-400">
                            {new Date(trade.executedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* 포트폴리오 Tab */}
            {tab === '포트폴리오' && (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 평가금액</p>
                    <p className="text-lg font-bold text-gray-900">{fmtM(MY_PORTFOLIO.totalValue)}원</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 수익률</p>
                    <p className="text-lg font-bold text-red-500">+{MY_PORTFOLIO.totalProfitLossRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 mb-1">총 수익</p>
                    <p className="text-lg font-bold text-red-500">+{fmtM(MY_PORTFOLIO.totalProfitLoss)}원</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">종목 비중</p>
                    <PortfolioPieChart holdings={MY_PORTFOLIO.holdings} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">보유 종목</p>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="text-xs text-gray-500">
                          <th className="text-left px-3 py-2 font-semibold">종목</th>
                          <th className="text-right px-3 py-2 font-semibold">수량</th>
                          <th className="text-right px-3 py-2 font-semibold">수익률</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MY_PORTFOLIO.holdings.map(h => (
                          <tr key={h.stockId} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <Link href={`/trading/${h.stockId}`} className="text-sm font-medium text-gray-800 hover:text-[#0046FF] transition-colors">{h.stock.name}</Link>
                            </td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">{h.quantity}주</td>
                            <td className={`px-3 py-2 text-right text-sm font-bold ${h.profitLossRate >= 0 ? 'text-red-500' : 'text-blue-600'}`}>
                              {h.profitLossRate >= 0 ? '+' : ''}{h.profitLossRate.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {modal === 'followers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">팔로워 ({MY_USER.followers})</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                    {['초', '주', '부', '월', '파'][i]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {['초보투자자', '주식공부중', '부자되자', '월급쟁이투자', '파이어족목표'][i]}
                    </p>
                    <p className="text-xs text-gray-400">수익률 +{[3.2, 2.1, 8.7, 4.6, 11.3][i]}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {modal === 'following' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">팔로잉 ({MY_USER.following})</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-2">
              {FOLLOWING_USERS.map(u => (
                <Link href={`/profile/${u.id}`} key={u.id}
                  onClick={() => setModal(null)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: `hsl(${u.id.charCodeAt(0) * 47 % 360}, 65%, 50%)` }}>
                    {u.nickname[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{u.nickname}</p>
                    <div className="flex items-center gap-1 text-red-500">
                      <TrendingUp size={10} />
                      <span className="text-xs">+{u.totalReturnRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {modal === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">프로필 편집</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {editProfileImage ? (
                  <img src={editProfileImage} alt="프로필" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold"
                    style={{ backgroundColor: '#0046FF' }}>
                    {nickname[0]}
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:border-[#0046FF] hover:text-[#0046FF] transition-colors text-gray-500">
                  <Camera size={14} />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              {editProfileImage && (
                <button
                  onClick={() => setEditProfileImage(null)}
                  className="mt-2 text-xs text-gray-400 hover:text-red-400 transition-colors">
                  이미지 삭제
                </button>
              )}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1.5">닉네임</label>
            <div className="flex gap-2 mb-6">
              <input type="text" value={nickname} onChange={e => { setNickname(e.target.value); setNicknameChecked(false); }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF]" />
              <button onClick={() => setNicknameChecked(true)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${nicknameChecked ? 'bg-green-50 text-green-600 border border-green-200' : 'border border-gray-200 text-gray-600 hover:border-[#0046FF] hover:text-[#0046FF]'}`}>
                {nicknameChecked ? '✓ 확인됨' : '중복확인'}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={saveProfile} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90" style={{ backgroundColor: '#0046FF' }}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">비밀번호 변경</h3>
              <button onClick={() => setModal(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 mb-6">
              <div className="relative">
                <input type={showOldPw ? 'text' : 'password'} value={oldPw} onChange={e => setOldPw(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] pr-11" />
                <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showOldPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="새 비밀번호 (8자 이상)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF]" />
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="새 비밀번호 확인"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF]" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#0046FF' }}>변경</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {modal === 'logout' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">로그아웃</h3>
            <p className="text-sm text-gray-500 mb-6">정말 로그아웃 하시겠습니까?</p>
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={() => router.push('/login')} className="flex-1 py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#0046FF' }}>로그아웃</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl text-center">
            <Trash2 size={32} className="text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-500 mb-2">회원탈퇴</h3>
            <p className="text-sm text-gray-500 mb-4">탈퇴 시 모든 데이터가 삭제됩니다.</p>
            <input type="password" placeholder="비밀번호 확인"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-red-400 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={() => router.push('/login')} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm">탈퇴</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
