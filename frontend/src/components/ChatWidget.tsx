'use client';
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, X, Send, Paperclip, Smile, Download, FileText, XCircle } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { fetchSettings, str } from "@/lib/settings";
import WhatsappIcon from "@/components/WhatsappIcon";

const EMOJIS = ["😊","😂","🙏","👍","❤️","🔥","✅","⚡","🎉","💯","😍","🤔","👋","💪","🚀","😅","🙌","💡","📌","⭐"];

interface DM {
  id: number;
  body: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  is_read: boolean;
  created_at: string;
  user: { id: number; name: string; role: string };
}

interface VisitorMsg {
  id: number;
  body: string | null;
  sender: 'visitor' | 'admin';
  is_read: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  created_at: string;
}

interface ChatMsg {
  id: number;
  body: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  is_read: boolean;
  created_at: string;
  is_own: boolean;
  sender_name: string;
}

function getVisitorToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('visitor_chat_token');
  if (!token) {
    // Generate a UUID-like token
    token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    localStorage.setItem('visitor_chat_token', token);
  }
  return token;
}

export default function ChatWidget() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchSettings().then((s) => setWhatsapp(str(s.contact_whatsapp)));
  }, []);

  const isVisitor = !user;

  // Stable per-session visitor token, generated lazily on the client.
  const [visitorToken] = useState<string>(() => (isVisitor ? getVisitorToken() : ''));

  // Init session to get the visitor's display name.
  useEffect(() => {
    if (!isVisitor || !visitorToken) return;
    api.post('/visitor/init', { token: visitorToken })
      .then((r) => setVisitorName(r.data.name ?? 'You'))
      .catch(() => {});
  }, [isVisitor, visitorToken]);

  // ── Unread count ──────────────────────────────────────────
  const { data: clientUnread = 0 } = useQuery<number>({
    queryKey: ['dm-unread'],
    queryFn: () => api.get('/dm/unread').then((r) => r.data.count),
    refetchInterval: 5000,
    enabled: !isVisitor,
  });

  const { data: visitorUnread = 0 } = useQuery<number>({
    queryKey: ['visitor-unread', visitorToken],
    queryFn: () => api.get('/visitor/unread', { params: { token: visitorToken } }).then((r) => r.data.count),
    refetchInterval: 5000,
    enabled: isVisitor && !!visitorToken,
  });

  const unread = isVisitor ? visitorUnread : clientUnread;

  // ── Messages ──────────────────────────────────────────────
  const { data: clientMessages = [] } = useQuery<ChatMsg[]>({
    queryKey: ['dm'],
    queryFn: async () => {
      const r = await api.get('/dm');
      return (r.data.messages ?? [] as DM[]).map((m: DM) => ({
        id: m.id,
        body: m.body,
        attachment_url: m.attachment_url,
        attachment_name: m.attachment_name,
        attachment_mime: m.attachment_mime,
        is_read: m.is_read,
        created_at: m.created_at,
        is_own: m.user.id === user?.id,
        sender_name: m.user.name,
      }));
    },
    refetchInterval: open ? 2000 : 10000,
    enabled: !isVisitor,
  });

  const { data: visitorMessages = [] } = useQuery<ChatMsg[]>({
    queryKey: ['visitor-messages', visitorToken],
    queryFn: async () => {
      const r = await api.get('/visitor/messages', { params: { token: visitorToken } });
      return (r.data.messages ?? [] as VisitorMsg[]).map((m: VisitorMsg) => ({
        id: m.id,
        body: m.body,
        attachment_url: m.attachment_url,
        attachment_name: m.attachment_name,
        attachment_mime: m.attachment_mime,
        is_read: m.is_read,
        created_at: m.created_at,
        is_own: m.sender === 'visitor',
        sender_name: m.sender === 'admin' ? 'Ibrahim' : (visitorName || 'You'),
      }));
    },
    refetchInterval: open ? 2000 : 10000,
    enabled: isVisitor && !!visitorToken,
  });

  const messages = isVisitor ? visitorMessages : clientMessages;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, open]);

  // Invalidate on open
  useEffect(() => {
    if (open) {
      if (isVisitor && visitorToken) {
        qc.invalidateQueries({ queryKey: ['visitor-messages', visitorToken] });
        qc.invalidateQueries({ queryKey: ['visitor-unread', visitorToken] });
      } else if (!isVisitor) {
        qc.invalidateQueries({ queryKey: ['dm'] });
        qc.invalidateQueries({ queryKey: ['dm-unread'] });
      }
    }
  }, [open, isVisitor, visitorToken, qc]);

  // ── Send ──────────────────────────────────────────────────
  const clientSend = useMutation({
    mutationFn: (fd: FormData) =>
      api.post('/dm', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.message),
    onSuccess: (newMsg: DM) => {
      const mapped: ChatMsg = {
        id: newMsg.id, body: newMsg.body,
        attachment_url: newMsg.attachment_url, attachment_name: newMsg.attachment_name,
        attachment_mime: newMsg.attachment_mime, is_read: newMsg.is_read,
        created_at: newMsg.created_at,
        is_own: true,
        sender_name: user?.name ?? 'You',
      };
      qc.setQueryData<ChatMsg[]>(['dm'], (old = []) => [...old, mapped]);
      setText(''); setFile(null); setFilePreview(null); setShowEmoji(false);
    },
  });

  const visitorSend = useMutation({
    mutationFn: (fd: FormData) =>
      api.post('/visitor/messages', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.message),
    onSuccess: (newMsg: VisitorMsg) => {
      const mapped: ChatMsg = {
        id: newMsg.id, body: newMsg.body,
        attachment_url: newMsg.attachment_url, attachment_name: newMsg.attachment_name,
        attachment_mime: newMsg.attachment_mime, is_read: newMsg.is_read,
        created_at: newMsg.created_at,
        is_own: true,
        sender_name: visitorName || 'You',
      };
      qc.setQueryData<ChatMsg[]>(['visitor-messages', visitorToken], (old = []) => [...old, mapped]);
      setText(''); setFile(null); setFilePreview(null); setShowEmoji(false);
    },
  });

  const isPending = isVisitor ? visitorSend.isPending : clientSend.isPending;

  const handleSend = () => {
    if (!text.trim() && !file) return;
    const fd = new FormData();
    if (text.trim()) fd.append('body', text.trim());
    if (file) fd.append('attachment', file);
    if (isVisitor) {
      fd.append('token', visitorToken);
      visitorSend.mutate(fd);
    } else {
      clientSend.mutate(fd);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith('image/')) setFilePreview(URL.createObjectURL(f));
    else setFilePreview(null);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isImage = (mime: string | null) => mime?.startsWith('image/');
  const formatTime = (dt: string) => new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const headerSub = isVisitor
    ? (visitorName ? `You're chatting as ${visitorName}` : 'Usually replies within a few hours')
    : 'Usually replies within a few hours';

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {!open && whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
            target="_blank" rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 text-white"
            style={{ background: '#25D366' }}>
            <WhatsappIcon size={26} />
          </a>
        )}

        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open live chat"
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
            style={{ background: 'var(--primary)' }}>
            <MessageCircle size={26} className="text-white" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#ef4444' }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        )}

        {open && (
          <div className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{ width: 360, height: 520, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: 'var(--primary)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Chat with Ibrahim</div>
                  <div className="text-xs text-white/70">{headerSub}</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--bg)' }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center"
                  style={{ color: 'var(--text-muted)' }}>
                  <MessageCircle size={40} className="opacity-30" />
                  <p className="text-sm">Send a message to get started!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] flex flex-col gap-1 ${msg.is_own ? 'items-end' : 'items-start'}`}>
                    {!msg.is_own && (
                      <span className="text-xs font-semibold px-1" style={{ color: 'var(--primary)' }}>
                        {msg.sender_name}
                      </span>
                    )}

                    {msg.attachment_url && (
                      <div className="rounded-xl overflow-hidden"
                        style={msg.is_own ? { background: 'var(--primary)' } : { background: 'var(--bg-muted)' }}>
                        {isImage(msg.attachment_mime) ? (
                          <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                            <Image src={msg.attachment_url} alt={msg.attachment_name ?? 'image'}
                              width={220} height={160} className="object-cover rounded-xl" unoptimized />
                          </a>
                        ) : (
                          <a href={msg.attachment_url} download={msg.attachment_name}
                            className="flex items-center gap-2 px-3 py-2.5 text-sm"
                            style={{ color: msg.is_own ? '#fff' : 'var(--text)' }}>
                            <FileText size={16} />
                            <span className="truncate max-w-[160px]">{msg.attachment_name}</span>
                            <Download size={14} className="shrink-0 opacity-70" />
                          </a>
                        )}
                      </div>
                    )}

                    {msg.body && (
                      <div className="px-3 py-2 rounded-2xl text-sm leading-relaxed"
                        style={msg.is_own
                          ? { background: 'var(--primary)', color: '#fff', borderBottomRightRadius: '4px' }
                          : { background: 'var(--bg-muted)', color: 'var(--text)', borderBottomLeftRadius: '4px' }}>
                        {msg.body}
                      </div>
                    )}

                    <span className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>
                      {formatTime(msg.created_at)}
                      {msg.is_own && msg.is_read && <span className="ml-1" style={{ color: 'var(--primary)' }}>✓✓</span>}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Emoji picker */}
            {showEmoji && (
              <div className="px-3 py-2 shrink-0 flex flex-wrap gap-1 border-t"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                {EMOJIS.map((em) => (
                  <button key={em} type="button"
                    onClick={() => { setText((t) => t + em); textRef.current?.focus(); }}
                    className="text-lg hover:scale-125 transition-transform w-8 h-8 flex items-center justify-center rounded">
                    {em}
                  </button>
                ))}
              </div>
            )}

            {/* File preview */}
            {file && (
              <div className="px-3 py-2 shrink-0 flex items-center gap-2 border-t text-sm"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                {filePreview
                  ? <Image src={filePreview} alt="preview" width={40} height={40} className="w-10 h-10 rounded object-cover" unoptimized />
                  : <FileText size={18} style={{ color: 'var(--primary)' }} />}
                <span className="flex-1 truncate" style={{ color: 'var(--text-muted)' }}>{file.name}</span>
                <button onClick={() => { setFile(null); setFilePreview(null); }}>
                  <XCircle size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 shrink-0 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <div className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                <textarea
                  ref={textRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  className="flex-1 text-sm resize-none outline-none bg-transparent min-h-[24px] max-h-[96px]"
                  style={{ color: 'var(--text)' }}
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => setShowEmoji((v) => !v)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: showEmoji ? 'var(--primary)' : 'var(--text-muted)' }}>
                    <Smile size={18} />
                  </button>
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: 'var(--text-muted)' }}>
                    <Paperclip size={18} />
                  </button>
                  <button type="button" onClick={handleSend}
                    disabled={isPending || (!text.trim() && !file)}
                    className="p-1.5 rounded-lg transition-all disabled:opacity-30"
                    style={{ color: 'var(--primary)' }}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            <input ref={fileRef} type="file" className="hidden"
              accept="image/*,.pdf,.doc,.docx,.zip,.txt,.xlsx,.csv"
              onChange={handleFileChange} />
          </div>
        )}
      </div>
    </>
  );
}
