'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: '#0046FF' }}>
            <TrendingUp size={28} color="white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">모의투자</h1>
          <p className="text-sm text-gray-500 mt-1">코스피200 기반 모의투자 플랫폼</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all pr-11"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}
                className="w-4 h-4 rounded accent-[#0046FF]" />
              <span className="text-sm text-gray-600">자동 로그인</span>
            </label>
            <Link href="/reset-password" className="text-sm text-[#0046FF] font-medium">비밀번호 찾기</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70"
            style={{ backgroundColor: '#0046FF' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mt-4 w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.692H24v9.098h13.22c-.584 3.028-2.304 5.596-4.88 7.32v6.08h7.9c4.62-4.256 7.292-10.524 7.292-17.806z" fill="#4285F4"/>
            <path d="M24 48c6.624 0 12.18-2.196 16.24-5.948l-7.9-6.08c-2.196 1.476-5.004 2.34-8.34 2.34-6.408 0-11.836-4.328-13.776-10.152H2.064v6.264C6.104 42.668 14.46 48 24 48z" fill="#34A853"/>
            <path d="M10.224 28.16A14.94 14.94 0 0 1 9.412 24c0-1.444.248-2.844.812-4.16V13.576H2.064A23.98 23.98 0 0 0 0 24c0 3.876.928 7.544 2.064 10.424l8.16-6.264z" fill="#FBBC05"/>
            <path d="M24 9.536c3.612 0 6.852 1.244 9.4 3.68l7.032-7.032C36.172 2.196 30.62 0 24 0 14.46 0 6.104 5.332 2.064 13.576l8.16 6.264C12.164 13.864 17.592 9.536 24 9.536z" fill="#EA4335"/>
          </svg>
          Google로 계속하기
        </button>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">아직 계정이 없으신가요? </span>
          <Link href="/signup" className="text-sm text-[#0046FF] font-semibold">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
