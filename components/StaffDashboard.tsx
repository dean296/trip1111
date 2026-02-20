
import React, { useState, useEffect } from 'react';
import { ChatSession, Message } from '../types';
import { AIChat } from './AIChat';

export const StaffDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { 
      id: 's1', 
      partnerName: '그랜드 힐튼 서울', 
      lastMessage: 'API 연동 관련 확인 부탁드립니다.', 
      lastTimestamp: new Date(), 
      status: 'waiting', 
      unreadCount: 2, 
      priority: 'high', 
      tags: ['API', '기술문의'], 
      assignedAgent: '김철수',
      messages: [
        { id: 'm1', role: 'user', content: '안녕하세요, API 연동 키 재발급 부탁드려도 될까요?', timestamp: new Date(Date.now() - 3600000) },
        { id: 'm2', role: 'assistant', content: '네, 대표님! 확인해드리겠습니다.', timestamp: new Date(Date.now() - 3500000) },
        { id: 'm3', role: 'note', content: '직원 메모: 이 파트너는 작년에 골드 등급이었습니다.', timestamp: new Date(Date.now() - 3400000) },
        { id: 'm4', role: 'user', content: 'API 연동 관련 확인 부탁드립니다.', timestamp: new Date() },
      ]
    },
    { 
      id: 's2', 
      partnerName: '제주 신라 호텔', 
      lastMessage: '정산 명세서 잘 받았습니다.', 
      lastTimestamp: new Date(Date.now() - 3600000), 
      status: 'active', 
      unreadCount: 0, 
      priority: 'medium', 
      tags: ['정산', '재무'], 
      assignedAgent: '이영희',
      messages: [
        { id: 'm1', role: 'user', content: '정산 명세서 잘 받았습니다. 고맙습니다.', timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    { 
      id: 's3', 
      partnerName: '부산 파라다이스', 
      lastMessage: '재고 동기화가 조금 늦는 것 같아요.', 
      lastTimestamp: new Date(Date.now() - 7200000), 
      status: 'active', 
      unreadCount: 1, 
      priority: 'low', 
      tags: ['재고', '동기화'],
      messages: [
        { id: 'm1', role: 'user', content: '재고 동기화가 조금 늦는 것 같아요.', timestamp: new Date(Date.now() - 7200000) }
      ]
    },
  ]);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(sessions[0].id);
  const [activeNav, setActiveNav] = useState<'inbox' | 'customers' | 'stats'>('inbox');
  const [replyMode, setReplyMode] = useState<'public' | 'note'>('public');

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  const handleSendMessage = (msg: Message) => {
    if (!selectedSessionId) return;
    setSessions(prev => prev.map(s => {
      if (s.id === selectedSessionId) {
        return {
          ...s,
          messages: [...s.messages, msg],
          lastMessage: msg.content,
          lastTimestamp: msg.timestamp
        };
      }
      return s;
    }));
  };

  const renderSidebar = () => {
    switch (activeNav) {
      case 'inbox':
        return (
          <aside className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 animate-fade-in shadow-sm z-10">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Inbox</h2>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                </div>
              </div>
              <div className="relative mb-6">
                <input type="text" placeholder="상담 세션 검색..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
                <svg className="absolute left-4 top-4 text-slate-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <div className="flex gap-6 border-b border-slate-100 mb-2">
                <button className="pb-3 text-[11px] font-black text-blue-600 border-b-2 border-blue-600 uppercase tracking-widest">Pending</button>
                <button className="pb-3 text-[11px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">Assigned</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 custom-scrollbar">
              {sessions.map(session => (
                <div 
                  key={session.id} 
                  onClick={() => setSelectedSessionId(session.id)} 
                  className={`p-5 rounded-[1.75rem] cursor-pointer transition-all duration-300 border-2 ${selectedSessionId === session.id ? 'bg-blue-50/50 border-blue-500 shadow-xl shadow-blue-500/5 translate-x-1' : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${session.priority === 'high' ? 'bg-red-500 animate-pulse' : session.priority === 'medium' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">{session.status}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300 uppercase">{session.lastTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="font-extrabold text-[14px] text-slate-900 truncate mb-1.5">{session.partnerName}</h4>
                  <p className="text-[12px] text-slate-500 line-clamp-1 mb-4 leading-relaxed font-medium">{session.lastMessage}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {session.tags.map(tag => <span key={tag} className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase tracking-tighter">#{tag}</span>)}
                    {session.unreadCount > 0 && <span className="ml-auto w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-blue-200 animate-bounce">{session.unreadCount}</span>}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        );
      case 'customers':
        return (
          <aside className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 animate-fade-in shadow-sm z-10">
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-8">Directory</h2>
              <div className="space-y-4">
                <div className="p-6 bg-slate-950 rounded-[2rem] text-white shadow-2xl shadow-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Active Partners</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-black tracking-tighter">1,248</p>
                    <span className="text-xs font-bold text-green-400 bg-white/10 px-2 py-0.5 rounded-full">↑ 12.4%</span>
                  </div>
                </div>
                <div className="relative">
                  <input type="text" placeholder="파트너명, 사업자번호..." className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none" />
                  <svg className="absolute left-3.5 top-3.5 text-slate-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-10 custom-scrollbar">
               {['그랜드 힐튼 서울', '제주 신라 호텔', '부산 파라다이스', '강원 하이원 리조트', '콘래드 서울', '포시즌스 서울'].map((name, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100 group">
                    <div className="w-11 h-11 bg-white border-2 border-slate-100 rounded-[1.25rem] flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">{name[0]}</div>
                    <div>
                      <p className="text-[13px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Premium Enterprise · v2.1</p>
                    </div>
                 </div>
               ))}
            </div>
          </aside>
        );
      case 'stats':
        return (
          <aside className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0 animate-fade-in shadow-sm z-10">
            <div className="p-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-10">Intelligence</h2>
              <div className="space-y-10">
                 <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">CSat Score</p>
                    <div className="flex items-end gap-1">
                       <p className="text-5xl font-black text-blue-900 tracking-tighter">4.9</p>
                       <span className="text-xs font-bold text-blue-400 mb-2">/ 5.0</span>
                    </div>
                    <div className="mt-6 flex gap-1 h-2">
                       {[90, 85, 95, 80, 100, 92].map((h, i) => (
                         <div key={i} className="flex-1 bg-blue-200 rounded-full relative overflow-hidden">
                           <div className="absolute bottom-0 left-0 right-0 bg-blue-600 transition-all duration-1000" style={{ height: `${h}%` }}></div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-5 px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">실시간 이슈 토픽</p>
                    {[
                      { l: 'API 인증 에러', v: 48, c: 'bg-red-500' },
                      { l: '정산 내역 불일치', v: 32, c: 'bg-blue-500' },
                      { l: '재고 연동 지연', v: 20, c: 'bg-slate-300' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[11px] font-black">
                           <span className="text-slate-700">{item.l}</span>
                           <span className="text-slate-400">{item.v}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className={`h-full ${item.c}`} style={{ width: `${item.v}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </aside>
        );
    }
  };

  const renderMainContent = () => {
    if (activeNav === 'inbox') {
      return selectedSession ? (
        <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-white">
          <header className="h-[80px] flex items-center justify-between px-10 border-b border-slate-100 shrink-0 z-20 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-slate-300 transform transition-transform hover:scale-110 cursor-pointer">{selectedSession.partnerName[0]}</div>
              <div>
                <h3 className="text-[17px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{selectedSession.partnerName}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></span><span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">Connected</span></div>
                  <span className="text-slate-200">/</span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-tighter">AGENCY ID: 104-55-9032</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
                <button onClick={() => setReplyMode('public')} className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all duration-300 ${replyMode === 'public' ? 'bg-white text-blue-600 shadow-xl shadow-slate-200 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}>Public Reply</button>
                <button onClick={() => setReplyMode('note')} className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all duration-300 ${replyMode === 'note' ? 'bg-[#FFF9C4] text-[#A67C00] shadow-xl shadow-slate-200 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}>Internal Note</button>
              </div>
              <button className="bg-slate-900 text-white px-7 py-3 rounded-xl text-[11px] font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">Complete Session</button>
            </div>
          </header>
          <div className="flex-1 overflow-hidden relative">
            <AIChat 
              onTransferToHuman={() => {}} 
              isMaximized={true} 
              onToggleMaximize={() => {}} 
              mode="staff" 
              replyMode={replyMode}
              sessionMessages={selectedSession.messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-20 animate-fade-in bg-slate-50/20">
          <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-slate-100 mb-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Ready to Assist?</h3>
          <p className="text-slate-400 text-[14px] mt-4 max-w-[280px] leading-relaxed font-medium">상담 리스트에서 파트너를 선택하여<br />문의 대응을 시작하세요.</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col p-16 bg-white animate-fade-in overflow-y-auto custom-scrollbar">
         <div className="max-w-6xl w-full mx-auto">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">{activeNav === 'customers' ? 'Partner CRM' : 'Performance Insights'}</h1>
                <p className="text-xl text-slate-400 font-medium">{activeNav === 'customers' ? '트립일레븐 생태계의 모든 파트너 데이터를 실시간으로 조회합니다.' : 'CX 운영 성과를 정량적으로 분석하고 병목 지점을 파악합니다.'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-10">
                  <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm transition-all hover:shadow-2xl">
                     <div className="flex justify-between items-center mb-12">
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">유입 및 처리 추이</h3>
                       <div className="flex gap-2">
                         <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-slate-400 border border-slate-100">Daily</span>
                         <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black text-white shadow-lg shadow-blue-200">Weekly</span>
                       </div>
                     </div>
                     <div className="w-full h-80 bg-white/80 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 p-10 text-center animate-pulse">
                        <svg className="mb-6 opacity-30" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                        <p className="text-lg font-black text-slate-400">데이터 시각화 준비 중...</p>
                        <p className="text-sm mt-2 opacity-60">파트너사의 실시간 상담 메트릭을 수집하고 있습니다.</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    {[
                      { t: '자동 응답 성공률', v: '68.2%', d: '↑ 4.1%', c: 'blue' },
                      { t: '평균 첫 응답 시간', v: '1m 12s', d: '↓ 12s', c: 'green' }
                    ].map((card, i) => (
                      <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:scale-105 transition-all">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">{card.t}</p>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{card.v}</h4>
                        <p className={`text-xs font-bold ${card.c === 'blue' ? 'text-blue-600' : 'text-green-500'}`}>{card.d} <span className="text-slate-300 font-normal ml-1">vs Last Week</span></p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="space-y-10">
                  <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] group-hover:bg-blue-600/40 transition-all"></div>
                     <h3 className="text-2xl font-black mb-10 tracking-tight">AI Insights</h3>
                     <div className="space-y-8">
                        <div className="flex gap-5">
                           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                           <p className="text-[14px] leading-relaxed font-medium text-slate-300">"API 연동" 키워드 유입이 평일 대비 <span className="text-white font-black underline underline-offset-4 decoration-blue-500">240% 폭증</span>했습니다. 기술 지원팀의 비상 대기가 필요합니다.</p>
                        </div>
                        <div className="flex gap-5">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 shrink-0"></div>
                           <p className="text-[14px] leading-relaxed font-medium text-slate-300">최근 정산 시스템 업데이트에 대한 파트너 반응이 <span className="text-white font-black">매우 긍정적</span>입니다 (CSat 4.9+)</p>
                        </div>
                     </div>
                     <button className="w-full mt-12 py-5 bg-white/10 hover:bg-white/20 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all backdrop-blur-md">Full Intelligence Report</button>
                  </div>
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                     <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Notice</p>
                     <p className="text-[13px] font-bold text-slate-500">다음 정기 점검:<br/>2024.03.24 02:00 ~ 06:00</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="h-full flex bg-[#F8FAFC] overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Side Navigation Rail */}
      <nav className="w-[84px] bg-slate-950 flex flex-col items-center py-10 gap-10 shrink-0 z-50">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_25px_rgba(37,99,235,0.4)] cursor-pointer transition-transform hover:scale-110 active:scale-95">B</div>
        <div className="flex flex-col gap-6 flex-1">
          {[
            { id: 'inbox', icon: 'M22 13-8.67 8.67A2 2 0 0 1 11.91 22H5a2 2 0 0 1-2-2V7.41a2 2 0 0 1 .59-1.41L7.41 2.59A2 2 0 0 1 8.83 2H20a2 2 0 0 1 2 2z' },
            { id: 'customers', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
            { id: 'stats', icon: 'M3 3v18h18 M19 9l-5 5-4-4-3 3' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveNav(item.id as any)}
              className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 relative group ${
                activeNav === item.id 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40' 
                : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              {activeNav !== item.id && <span className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 uppercase tracking-widest">{item.id}</span>}
            </button>
          ))}
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] text-white font-black cursor-pointer hover:bg-slate-700 transition-all shadow-lg active:scale-90">AD</div>
      </nav>

      {renderSidebar()}
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        {renderMainContent()}
        
        {activeNav === 'inbox' && selectedSession && (
          <aside className="absolute top-0 right-0 w-[360px] h-full bg-[#F8FAFC] border-l border-slate-200 flex flex-col shrink-0 animate-slide-left overflow-y-auto custom-scrollbar z-40 shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="p-10 space-y-12">
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Partner Context</h4>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl shadow-blue-200 mb-4 transform hover:rotate-12 transition-transform cursor-pointer">BP</div>
                    <p className="text-xl font-black text-slate-900 tracking-tight mb-1">{selectedSession.partnerName}</p>
                    <span className="px-3 py-1 bg-blue-50 text-[10px] font-black text-blue-600 rounded-full uppercase tracking-widest">Enterprise Premium</span>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Manager</span><span className="text-[11px] text-slate-800 font-black">김하나 팀장</span></div>
                    <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Call</span><span className="text-[11px] text-blue-600 font-black underline underline-offset-4 cursor-pointer">010-1234-5678</span></div>
                    <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">Status</span><span className="text-[11px] text-green-500 font-black">Verified</span></div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Timeline</h4>
                  <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">View All</button>
                </div>
                <div className="relative pl-7 space-y-10 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  <div className="relative before:absolute before:-left-[23px] before:top-1.5 before:w-3 before:h-3 before:bg-blue-600 before:rounded-full before:ring-4 before:ring-blue-50 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase">Mar 12, 14:30</p>
                    <p className="text-[13px] font-bold text-slate-800 leading-snug">API 연동 인증키 신규 발급 및 샌드박스 설정 완료</p>
                  </div>
                  <div className="relative before:absolute before:-left-[23px] before:top-1.5 before:w-3 before:h-3 before:bg-slate-200 before:rounded-full before:ring-4 before:ring-slate-50 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                    <p className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase">Mar 10, 09:15</p>
                    <p className="text-[13px] font-bold text-slate-500 leading-snug">정산 시스템 2.0 업데이트 내역 컨펌 확인</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Partner Toolbox</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-600 hover:text-blue-600 transition-all group shadow-sm hover:shadow-2xl active:scale-95">
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                      <svg className="text-slate-400 group-hover:text-blue-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Inventory</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-blue-600 hover:text-blue-600 transition-all group shadow-sm hover:shadow-2xl active:scale-95">
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                      <svg className="text-slate-400 group-hover:text-blue-600 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Billing</span>
                  </button>
                </div>
              </section>
            </div>
          </aside>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        .animate-slide-left { animation: slideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
