
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { AIChat } from './components/AIChat';
import { StaffDashboard } from './components/StaffDashboard';
import { SupportStatus, ViewMode } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<SupportStatus>(SupportStatus.IDLE);
  const [viewMode, setViewMode] = useState<ViewMode>('partner');

  const startAIChat = () => {
    setStatus(SupportStatus.AI_CHAT);
  };
  
  const startHumanChat = () => setStatus(SupportStatus.HUMAN_SUPPORT);

  return (
    <Layout viewMode={viewMode} onToggleView={setViewMode}>
      {viewMode === 'staff' ? (
        <StaffDashboard />
      ) : (
        <div className="h-full flex items-center justify-center p-4 md:p-8 bg-gradient-to-b from-slate-50 to-blue-50/30">
          <div className="w-full max-w-3xl flex flex-col h-[700px] md:h-[800px] transition-all duration-500">
            {status === SupportStatus.IDLE ? (
              <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-8 h-full animate-fade-in">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                  </svg>
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    트립일레븐 파트너 컨시어지
                  </h2>
                  <p className="text-slate-500 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                    대표님의 비즈니스 성공을 돕는 전용 상담 채널입니다.<br />
                    AI 담당자와 전문 상담원이 대기하고 있습니다.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-3">
                  <button 
                    onClick={startAIChat}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-blue-200/50"
                  >
                    상담 시작하기
                  </button>
                  <button 
                    onClick={startHumanChat}
                    className="w-full bg-white text-slate-600 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    상담원 바로 연결
                  </button>
                </div>
                <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    AI 24/7 가동중
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    전문 담당자 연결 지원
                  </span>
                </div>
              </div>
            ) : status === SupportStatus.AI_CHAT ? (
              <AIChat 
                onTransferToHuman={startHumanChat} 
                isMaximized={true}
                onToggleMaximize={() => {}}
                mode="partner"
              />
            ) : (
              <div className="bg-white rounded-[2.5rem] h-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-fade-in">
                <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <h3 className="font-bold">전문 상담원 연결</h3>
                      <p className="text-xs text-slate-400">보안이 설정된 전용 채널로 이동합니다</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setStatus(SupportStatus.AI_CHAT)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                </div>
                <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-2 relative">
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">상담원 연결 중</h4>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-xs mx-auto">
                      트립일레븐 파트너 지원 시스템이<br />
                      전용 메신저와 동기화되고 있습니다.
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden max-w-[240px]">
                    <div className="h-full bg-blue-600 w-1/3 animate-[progress_2s_ease-in-out_infinite]"></div>
                  </div>
                  <button 
                    className="text-sm text-blue-600 font-bold hover:bg-blue-100/50 bg-blue-50 px-6 py-3 rounded-xl transition-all"
                    onClick={() => window.open('https://www.bookingplay.co.kr/api/channel_talk_partner/open_chat', '_blank')}
                  >
                    지금 즉시 상담방 열기 →
                  </button>
                </div>
                <style>{`
                  @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                  }
                  .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
