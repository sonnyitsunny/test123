'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, TrendingUp, CheckCircle2 } from 'lucide-react';

type Step = 'form' | 'verify';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPw || !nickname) { setError('모든 항목을 입력해주세요.'); return; }
    if (password !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (!nicknameChecked) { setError('닉네임 중복 확인을 해주세요.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) { setError('인증코드를 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push('/dashboard');
  };

  const checkNickname = async () => {
    if (!nickname) return;
    await new Promise(r => setTimeout(r, 400));
    setNicknameChecked(true);
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 rounded-full bg-[#EBF0FF] flex items-center justify-center mb-4">
              <CheckCircle2 size={28} color="#0046FF" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">이메일 인증</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              <span className="font-medium text-gray-700">{email}</span>으로<br />인증 메일을 발송했습니다.
            </p>
          </div>
          <form onSubmit={handleVerify} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">인증 코드</label>
              <input
                type="text"
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)}
                placeholder="6자리 인증 코드 입력"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all tracking-widest text-center text-lg font-semibold"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ backgroundColor: '#0046FF' }}>
              {loading ? '확인 중...' : '인증 완료'}
            </button>
          </form>
          <button onClick={() => setStep('form')} className="mt-4 w-full text-sm text-gray-500 text-center">뒤로 가기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: '#0046FF' }}>
            <TrendingUp size={24} color="white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">닉네임</label>
            <div className="flex gap-2">
              <input type="text" value={nickname} onChange={e => { setNickname(e.target.value); setNicknameChecked(false); }}
                placeholder="닉네임 입력 (2~10자)"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all" />
              <button type="button" onClick={checkNickname}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${nicknameChecked ? 'bg-green-50 text-green-600 border border-green-200' : 'border border-gray-200 text-gray-600 hover:border-[#0046FF] hover:text-[#0046FF]'}`}>
                {nicknameChecked ? '✓ 확인됨' : '중복확인'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="8자 이상 입력"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all pr-11" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
              placeholder="비밀번호 재입력"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#0046FF]/10 transition-all ${confirmPw && password !== confirmPw ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#0046FF]'}`} />
            {confirmPw && password !== confirmPw && <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
            style={{ backgroundColor: '#0046FF' }}>
            {loading ? '처리 중...' : '인증 메일 발송'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-500">이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-sm text-[#0046FF] font-semibold">로그인</Link>
        </div>
      </div>
    </div>
  );
}
