'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';

type Step = 'email' | 'verify' | 'reset' | 'done';

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('이메일을 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('verify');
    startResendTimer();
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    startResendTimer();
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) { setError('인증코드 6자리를 모두 입력해주세요.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    // 데모: 모든 코드 통과
    setStep('reset');
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPw) { setError('모든 항목을 입력해주세요.'); return; }
    if (newPassword.length < 8) { setError('비밀번호는 8자 이상이어야 합니다.'); return; }
    if (newPassword !== confirmPw) { setError('비밀번호가 일치하지 않습니다.'); return; }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('done');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {step !== 'done' && (
          <Link href="/login" className="flex items-center gap-2 text-gray-600 mb-8 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm">로그인으로 돌아가기</span>
          </Link>
        )}

        {/* Step 1: 이메일 입력 */}
        {step === 'email' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">비밀번호 재설정</h2>
              <p className="text-sm text-gray-500 mt-2">가입한 이메일로 인증코드를 발송합니다.</p>
            </div>
            <form onSubmit={handleSendCode} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="가입한 이메일 주소"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ backgroundColor: '#0046FF' }}>
                {loading ? '발송 중...' : '인증코드 발송'}
              </button>
            </form>
          </>
        )}

        {/* Step 2: 인증코드 입력 */}
        {step === 'verify' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">인증코드 입력</h2>
              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium text-gray-700">{email}</span>으로<br />
                발송된 6자리 인증코드를 입력해주세요.
              </p>
            </div>
            <form onSubmit={handleVerifyCode} className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

              {/* 6-digit code input */}
              <div className="flex gap-2 justify-center">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => handleCodeKeyDown(i, e)}
                    className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all ${
                      digit
                        ? 'border-[#0046FF] bg-[#EBF0FF] text-[#0046FF]'
                        : 'border-gray-200 text-gray-800 focus:border-[#0046FF]'
                    }`}
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || code.join('').length < 6}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ backgroundColor: '#0046FF' }}>
                {loading ? '확인 중...' : '인증 확인'}
              </button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-400">코드를 받지 못했나요?</span>
                <button type="button" onClick={handleResend} disabled={resendTimer > 0}
                  className={`font-semibold transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-default' : 'text-[#0046FF] hover:underline'}`}>
                  {resendTimer > 0 ? `재발송 (${resendTimer}초)` : '재발송'}
                </button>
              </div>

              <button type="button" onClick={() => { setStep('email'); setCode(['', '', '', '', '', '']); setError(''); }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors">
                다른 이메일로 시도
              </button>
            </form>
          </>
        )}

        {/* Step 3: 새 비밀번호 설정 */}
        {step === 'reset' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">새 비밀번호 설정</h2>
              <p className="text-sm text-gray-500 mt-2">새로운 비밀번호를 입력해주세요.</p>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">새 비밀번호</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="8자 이상 입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all pr-11" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="text-xs text-red-500 mt-1">8자 이상 입력해주세요.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setError(''); }}
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all pr-11" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPw.length > 0 && newPassword !== confirmPw && (
                  <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
                {confirmPw.length > 0 && newPassword === confirmPw && newPassword.length >= 8 && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle size={11} /> 비밀번호가 일치합니다.
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ backgroundColor: '#0046FF' }}>
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          </>
        )}

        {/* Step 4: 완료 */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">비밀번호 변경 완료</h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              비밀번호가 성공적으로 변경되었습니다.<br />새 비밀번호로 로그인해주세요.
            </p>
            <Link href="/login"
              className="mt-8 w-full py-3.5 rounded-xl text-white font-semibold text-sm text-center block hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0046FF' }}>
              로그인하러 가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
