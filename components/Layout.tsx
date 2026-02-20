
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: 'partner' | 'staff';
  onToggleView: (mode: 'partner' | 'staff') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, viewMode, onToggleView }) => {
  return (
    <div className={`min-h-screen flex flex-col ${viewMode === 'staff' ? 'bg-slate-100' : 'bg-slate-50'}`}>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-8 h-8 ${viewMode === 'staff' ? 'bg-slate-800' : 'bg-blue-600'} rounded-lg flex items-center justify-center transition-colors`}>
              <span className="text-white font-bold text-xl">{viewMode === 'staff' ? 'W' : 'B'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {viewMode === 'staff' ? 'Workspace' : 'BookingPlay'} 
                <span className={`${viewMode === 'staff' ? 'text-slate-500' : 'text-blue-600'} font-medium ml-1`}>
                  {viewMode === 'staff' ? 'Admin' : 'Partner'}
                </span>
              </span>
            </div>
          </div>
          <nav className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 mr-4">
              <a href="#" className="hover:text-blue-600 transition-colors">매뉴얼</a>
              <a href="#" className="hover:text-blue-600 transition-colors">공지관리</a>
            </div>
            <button 
              onClick={() => onToggleView(viewMode === 'partner' ? 'staff' : 'partner')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                viewMode === 'staff' 
                ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                : 'bg-slate-900 text-white border-transparent hover:bg-slate-800'
              }`}
            >
              {viewMode === 'staff' ? '파트너 화면 보기' : '직원 전용 대시보드'}
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-4 shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-slate-400 text-[10px] md:text-xs">
          <span>© 2024 BookingPlay Co., Ltd. All Rights Reserved.</span>
          <div className="flex gap-4">
            <span className="font-medium text-slate-500">직원용 내부 전용 채널</span>
            <span>v1.2.0-stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
