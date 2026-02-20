
import React, { useState, useRef, useEffect } from 'react';
import { Message, Macro } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface AIChatProps {
  onTransferToHuman: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  mode?: 'partner' | 'staff';
  replyMode?: 'public' | 'note';
  sessionMessages?: Message[];
  onSendMessage?: (msg: Message) => void;
}

const MACROS: Macro[] = [
  { id: 'm1', title: '기본 인사', content: '안녕하세요, 대표님! 트립일레븐 파트너 지원팀입니다. 무엇을 도와드릴까요?', category: '일반' },
  { id: 'm2', title: 'API 연동 안내', content: 'API 연동 매뉴얼은 [여기](https://docs.bookingplay.co.kr)에서 확인 가능합니다. 인증키 재발급이 필요하신가요?', category: '기술' },
  { id: 'm3', title: '정산 확인 완료', content: '요청하신 기간의 정산 데이터 검토가 완료되었습니다. 정산 대시보드에서 확정 버튼을 눌러주세요.', category: '정산' },
  { id: 'm4', title: '상담 종료 알림', content: '추가 문의 사항이 없으시면 상담을 종료하겠습니다. 감사합니다.', category: '일반' },
];

export const AIChat: React.FC<AIChatProps> = ({ 
  onTransferToHuman, 
  mode = 'partner', 
  replyMode = 'public',
  sessionMessages = [],
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMacros, setShowMacros] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 세션이 바뀔 때 메시지 동기화
  useEffect(() => {
    if (mode === 'staff' && sessionMessages.length > 0) {
      setMessages(sessionMessages);
    } else if (mode === 'partner' && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: '안녕하세요, 대표님! 트립일레븐 파트너 담당자입니다.\n\n무엇을 도와드릴까요?',
          timestamp: new Date()
        }
      ]);
    }
  }, [sessionMessages, mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setSelectedImage({ data: base64Data, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (contentOverride?: string) => {
    const finalContent = contentOverride || input;
    if ((!finalContent.trim() && !selectedImage) || isLoading) return;

    const myRole = mode === 'staff' ? (replyMode === 'note' ? 'note' : 'staff') : 'user';
    const newMessage: Message = {
      id: Date.now().toString(),
      role: myRole,
      content: finalContent,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    if (onSendMessage) {
      onSendMessage(newMessage);
    } else {
      setMessages(prev => [...prev, newMessage]);
    }

    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setShowMacros(false);

    if (mode === 'staff' || replyMode === 'note') return;

    setIsLoading(true);
    const history = messages
      .filter(m => m.role !== 'note')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));

    const response = await chatWithGemini(finalContent, history, currentImage || undefined);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response || '오류가 발생했습니다.',
      timestamp: new Date()
    };

    if (onSendMessage) {
      onSendMessage(aiMsg);
    } else {
      setMessages(prev => [...prev, aiMsg]);
    }
    setIsLoading(false);
  };

  return (
    <div className={`flex flex-col h-full ${mode === 'staff' ? 'bg-white' : 'bg-white rounded-[2.5rem] border border-slate-200'} shadow-none overflow-hidden animate-fade-in`}>
      {mode === 'partner' && (
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white shrink-0 shadow-lg relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">파트너 지원 센터</h3>
              <p className="text-[11px] text-blue-100 opacity-80 uppercase font-black tracking-widest">AI Concierge Active</p>
            </div>
          </div>
          <button onClick={onTransferToHuman} className="text-xs bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-95">상담원 연결</button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar bg-[#F8FAFC]/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' || msg.role === 'staff' || (msg.role === 'note' && mode === 'staff') ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            {msg.role === 'note' ? (
              <div className="w-full flex justify-center my-2">
                <div className="max-w-[90%] bg-[#FFF9C4] border border-[#FBC02D] rounded-2xl px-6 py-4 text-[13px] text-[#5D4037] shadow-sm italic relative">
                  <span className="absolute -top-2 left-4 bg-[#FBC02D] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Internal Note</span>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className={`max-w-[80%] rounded-[1.5rem] px-6 py-4 text-[14px] shadow-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user' || msg.role === 'staff'
                  ? `${mode === 'staff' ? 'bg-slate-900' : 'bg-blue-600'} text-white rounded-tr-none shadow-blue-200/20` 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                {msg.image && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-black/5 shadow-inner">
                    <img src={`data:${msg.image.mimeType};base64,${msg.image.data}`} className="max-w-full h-auto" />
                  </div>
                )}
                {msg.content}
                <div className={`text-[9px] mt-2.5 opacity-50 font-black uppercase tracking-widest ${msg.role === 'user' || msg.role === 'staff' ? 'text-right' : 'text-left'}`}>
                   {msg.role === 'staff' ? 'Agent' : msg.role === 'user' ? 'Partner' : 'AI Assistant'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">AI Processing</span>
            </div>
          </div>
        )}
      </div>

      <div className={`p-6 md:p-8 shrink-0 border-t border-slate-100 transition-colors duration-500 relative ${replyMode === 'note' && mode === 'staff' ? 'bg-[#FFFDE7]' : 'bg-white'}`}>
        {/* Macros Popover */}
        {showMacros && mode === 'staff' && (
          <div className="absolute bottom-full left-8 mb-4 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up z-50">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">상담 답변 매크로</span>
              <button onClick={() => setShowMacros(false)} className="text-slate-400 hover:text-slate-600"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
              {MACROS.map(macro => (
                <button 
                  key={macro.id} 
                  onClick={() => { setInput(macro.content); setShowMacros(false); }}
                  className="w-full text-left p-3 hover:bg-blue-50 rounded-xl transition-all group"
                >
                  <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{macro.title}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{macro.content}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="mb-4 flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm animate-slide-up">
            <div className="w-12 h-12 rounded-lg overflow-hidden border shrink-0"><img src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} className="w-full h-full object-cover" /></div>
            <p className="text-xs font-bold text-slate-500 flex-1 truncate">이미지 파일 준비됨</p>
            <button onClick={() => setSelectedImage(null)} className="p-2 text-slate-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
          
          {mode === 'staff' && (
            <button 
              onClick={() => setShowMacros(!showMacros)} 
              className={`p-4 rounded-2xl transition-all shrink-0 ${showMacros ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4"/><path d="M10 9h4"/></svg>
            </button>
          )}

          <div className="relative flex-1 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={replyMode === 'note' ? "팀원들과만 공유할 비공개 메모를 입력하세요..." : "파트너에게 보낼 답변을 입력하세요..."}
              className={`w-full py-4 px-6 rounded-2xl text-sm border focus:ring-4 outline-none transition-all ${
                replyMode === 'note' && mode === 'staff' 
                ? 'bg-[#FFF9C4]/30 border-[#FBC02D]/30 focus:ring-[#FBC02D]/10 focus:border-[#FBC02D]' 
                : 'bg-slate-50 border-slate-200 focus:ring-blue-500/10 focus:border-blue-500 font-medium'
              }`}
            />
            <button onClick={() => handleSend()} disabled={isLoading || (!input.trim() && !selectedImage)} className={`p-4 rounded-xl transition-all shadow-lg active:scale-95 ${
              replyMode === 'note' && mode === 'staff' ? 'bg-[#FBC02D] text-white shadow-[#FBC02D]/20' : 'bg-slate-900 text-white shadow-slate-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
