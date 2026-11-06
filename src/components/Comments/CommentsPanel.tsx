import React, { useState } from 'react';
import {
  X,
  MessageSquare,
  CornerDownRight,
  CheckCircle2,
  Trash2,
  Send,
  Plus,
} from 'lucide-react';
import { DocumentComment } from '../../types/document';

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  selectedText?: string;
  onAddComment: (text: string, selection?: string) => void;
  onReplyComment: (commentId: string, replyText: string) => void;
  onToggleResolve: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({
  isOpen,
  onClose,
  comments,
  selectedText,
  onAddComment,
  onReplyComment,
  onToggleResolve,
  onDeleteComment,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim(), selectedText);
    setNewCommentText('');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;
    onReplyComment(commentId, text);
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  return (
    <aside className="w-80 bg-slate-50 border-l border-slate-300 flex flex-col shrink-0 text-slate-800 text-xs shadow-xl select-none z-30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2b579a] text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="font-semibold text-sm">Comments & Annotations</span>
        </div>
        <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-white/20 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Comment Box */}
      <form onSubmit={handleCreateComment} className="p-3 bg-white border-b border-slate-200 space-y-2">
        {selectedText && (
          <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 truncate">
            <strong>Selected:</strong> &quot;{selectedText}&quot;
          </div>
        )}
        <div className="relative">
          <textarea
            rows={2}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-[#2b579a]"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="flex items-center gap-1 px-3 py-1 bg-[#2b579a] text-white rounded text-xs font-semibold hover:bg-[#1e3f70] disabled:opacity-40 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No comments in this document.</p>
            <p className="text-[11px] mt-1 text-slate-400">Select text and click New Comment to annotate.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border transition-all ${
                comment.resolved
                  ? 'bg-slate-100 border-slate-200 opacity-60'
                  : 'bg-white border-slate-300 shadow-xs'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-[#2b579a] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                    {comment.author.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-900">{comment.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onToggleResolve(comment.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                    title={comment.resolved ? 'Reopen comment' : 'Resolve comment'}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${comment.resolved ? 'text-emerald-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Delete comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {comment.selectionText && (
                <div className="text-[10px] bg-slate-50 border-l-2 border-[#2b579a] pl-2 py-0.5 my-1 text-slate-500 italic truncate">
                  &quot;{comment.selectionText}&quot;
                </div>
              )}

              <p className="text-xs text-slate-700 select-text leading-relaxed mt-1">
                {comment.text}
              </p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2 pl-3 border-l-2 border-slate-200">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-xs">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                        <span>{reply.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          &bull; {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 select-text mt-0.5">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {!comment.resolved && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1">
                  <input
                    type="text"
                    value={replyInputs[comment.id] || ''}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.id)}
                    placeholder="Reply..."
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] focus:bg-white focus:outline-none focus:border-[#2b579a]"
                  />
                  <button
                    onClick={() => handleSendReply(comment.id)}
                    className="p-1 text-[#2b579a] hover:bg-blue-50 rounded"
                    title="Send reply"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};
