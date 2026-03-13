'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Trash2, MessageCircle, Send, TrendingUp, TrendingDown, X } from 'lucide-react';
import { TRADE_JOURNALS, MY_USER } from '@/data/dummy';
import type { TradeJournal, Comment } from '@/types';

function fmtM(n: number) {
  if (Math.abs(n) >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(0)}만`;
  return n.toLocaleString('ko-KR');
}

export default function TradeJournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const original = TRADE_JOURNALS.find(j => j.id === id);
  const [journal, setJournal] = useState<TradeJournal | undefined>(original);
  const [editMode, setEditMode] = useState(false);
  const [editMemo, setEditMemo] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  if (!journal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">일지를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isProfit = (journal.profitLoss ?? 0) >= 0;
  const isMyJournal = journal.authorId === MY_USER.id;

  const handleEdit = () => {
    setEditMemo(journal.memo);
    setEditMode(true);
  };

  const handleEditSave = () => {
    setJournal(prev => prev ? { ...prev, memo: editMemo, updatedAt: new Date().toISOString() } : prev);
    setEditMode(false);
  };

  const handleDelete = () => {
    router.push('/trade-journal');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `c_${Date.now()}`,
      journalId: journal.id,
      authorId: MY_USER.id,
      authorNickname: MY_USER.nickname,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournal(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : prev);
    setNewComment('');
  };

  const handleEditComment = (commentId: string) => {
    const comment = journal.comments.find(c => c.id === commentId);
    if (comment) {
      setEditingComment(commentId);
      setEditCommentContent(comment.content);
    }
  };

  const handleSaveEditComment = (commentId: string) => {
    setJournal(prev => prev ? {
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId ? { ...c, content: editCommentContent, updatedAt: new Date().toISOString() } : c
      )
    } : prev);
    setEditingComment(null);
    setEditCommentContent('');
  };

  const handleDeleteComment = (commentId: string) => {
    setJournal(prev => prev ? {
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId)
    } : prev);
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">매매일지 상세</h1>
        {isMyJournal && !editMode && (
          <div className="ml-auto flex gap-1">
            <button onClick={handleEdit}
              className="p-2 rounded-xl text-gray-400 hover:text-[#0046FF] hover:bg-[#EBF0FF] transition-colors">
              <Edit3 size={16} />
            </button>
            <button onClick={() => setDeleteConfirm(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Journal Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        {/* Stock Info */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${journal.tradeType === 'buy' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                {journal.tradeType === 'buy' ? '매수' : '매도'}
              </span>
              <span className="text-xl font-bold text-gray-900">{journal.stock.name}</span>
              <span className="text-sm text-gray-400 font-mono">{journal.stock.code}</span>
            </div>
            <p className="text-sm text-gray-500">
              {journal.quantity}주 · {journal.price.toLocaleString('ko-KR')}원 · {new Date(journal.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          {journal.profitLoss !== undefined && (
            <div className={`flex flex-col items-end ${isProfit ? 'text-red-500' : 'text-blue-600'}`}>
              <div className="flex items-center gap-1">
                {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="text-lg font-bold">{isProfit ? '+' : ''}{fmtM(journal.profitLoss)}원</span>
              </div>
              <span className="text-sm font-semibold">{isProfit ? '+' : ''}{journal.profitLossRate?.toFixed(2)}%</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">체결수량</p>
            <p className="text-sm font-bold text-gray-800">{journal.quantity}주</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">체결가격</p>
            <p className="text-sm font-bold text-gray-800">{journal.price.toLocaleString('ko-KR')}원</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">총 체결금액</p>
            <p className="text-sm font-bold text-gray-800">{fmtM(journal.totalAmount)}원</p>
          </div>
        </div>

        {/* Memo */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">매매 일지</p>
          {editMode ? (
            <div>
              <textarea
                value={editMemo}
                onChange={e => setEditMemo(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 resize-none leading-relaxed"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setEditMode(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
                <button onClick={handleEditSave} className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90" style={{ backgroundColor: '#0046FF' }}>저장</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{journal.memo}</p>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle size={18} style={{ color: '#0046FF' }} />
          <h2 className="text-base font-bold text-gray-900">댓글 ({journal.comments.length})</h2>
        </div>

        {journal.comments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">아직 댓글이 없습니다.</p>
        ) : (
          <div className="space-y-4 mb-5">
            {journal.comments.map(comment => {
              const isMyComment = comment.authorId === MY_USER.id;
              const isEditing = editingComment === comment.id;
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: comment.authorId === 'r1' ? '#F59E0B' : '#0046FF' }}>
                    {comment.authorNickname[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-800">{comment.authorNickname}</span>
                      {comment.authorId === 'r1' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">멘토</span>
                      )}
                      <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                      {isMyComment && (
                        <div className="ml-auto flex gap-1">
                          <button onClick={() => handleEditComment(comment.id)}
                            className="text-xs text-gray-400 hover:text-[#0046FF] transition-colors">수정</button>
                          <button onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors">삭제</button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          value={editCommentContent}
                          onChange={e => setEditCommentContent(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#0046FF] transition-colors"
                        />
                        <button onClick={() => handleSaveEditComment(comment.id)}
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ backgroundColor: '#0046FF' }}>저장</button>
                        <button onClick={() => setEditingComment(null)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600"><X size={14} /></button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Comment (본인 일지에만) */}
        {isMyJournal && (
          <div className="flex gap-2 pt-4 border-t border-gray-50">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
              placeholder="댓글 작성..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0046FF] focus:ring-2 focus:ring-[#0046FF]/10 transition-all"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#0046FF' }}>
              <Send size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm z-10 shadow-2xl text-center">
            <Trash2 size={32} className="text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">일지 삭제</h3>
            <p className="text-sm text-gray-500 mb-6">삭제된 일지는 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm">취소</button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
