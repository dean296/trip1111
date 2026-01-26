import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  MapPin, 
  ChevronRight, 
  Play, 
  Calendar, 
  Users, 
  Copy, 
  X, 
  Plus, 
  Minus, 
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Gift, 
  ShieldCheck, 
  Zap, 
  Info, 
  Waves, 
  Utensils, 
  Camera,
  Clock,
  MessageCircle,
  Users2,
  CheckCircle2,
  Check,
  CreditCard,
  Building2,
  ArrowRightLeft,
  Layers,
  Home,
  PawPrint
} from 'lucide-react';

// --- Reusable Components ---

const PlatformIcon = ({ type }: { type: 'Naver' | 'Yanolja' | 'Yeogiyeottae' }) => {
  const configs = {
    Naver: { color: 'bg-[#03C75A]', text: 'N' },
    Yanolja: { color: 'bg-[#FF3478]', text: '야' },
    Yeogiyeottae: { color: 'bg-[#F21137]', text: '여' }
  };
  const config = configs[type];
  return (
    <div className={`${config.color} w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px] text-white font-bold shrink-0`}>
      {config.text}
    </div>
  );
};

const RatingDisplay = ({ platform, rating }: { platform: string, rating: number }) => {
  if (platform === 'Naver') {
    return (
      <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
        방문자 인증
      </span>
    );
  }
  
  const maxScore = platform === 'Yeogiyeottae' ? 10 : 5;
  
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="text-yellow-400 fill-current" />
      <span className="text-[11px] font-bold text-gray-700">
        {rating} <span className="text-gray-300 font-medium">/ {maxScore}</span>
      </span>
    </div>
  );
};

const PaymentIcon = ({ id, name, icon }: { id: string; name: string; icon: string }) => {
  const [error, setError] = useState(false);

  const fallbacks: Record<string, React.ReactNode> = {
    card: <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center text-gray-500"><CreditCard size={12} /></div>,
    vbank: <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center text-gray-500"><Building2 size={12} /></div>,
    naver: <div className="w-5 h-5 bg-[#03C75A] rounded-md flex items-center justify-center text-[10px] text-white font-black">N</div>,
    kakao: <div className="w-5 h-5 bg-[#FAE100] rounded-md flex items-center justify-center text-[10px] text-[#3C1E1E] font-black">P</div>,
    toss: <div className="w-5 h-5 bg-[#0064FF] rounded-md flex items-center justify-center text-[8px] text-white font-black">Toss</div>,
    transfer: <div className="w-5 h-5 bg-[#0064FF] rounded-md flex items-center justify-center text-[8px] text-white font-black">Toss</div>
  };

  if (error || !icon) {
    return fallbacks[id] || <div className="w-5 h-5 bg-gray-100 rounded-md" />;
  }

  return (
    <img 
      src={icon} 
      className="w-5 h-5 object-contain rounded-sm" 
      alt={name} 
      onError={() => setError(true)} 
    />
  );
};

const maskId = (id: string) => {
  if (id.length <= 3) return id + '***';
  return id.substring(0, 3) + '****';
};

const MosaicGallery = ({ 
  images, 
  totalCount, 
  id, 
  onOpenGallery 
}: { 
  images: string[], 
  totalCount: number, 
  id: string,
  onOpenGallery: (index: number) => void
}) => {
  return (
    <div className="relative w-full aspect-[4/3] flex gap-1 bg-white overflow-hidden cursor-pointer group">
      <div className="w-1/2 h-full" onClick={(e) => { e.stopPropagation(); onOpenGallery(0); }}>
        <img 
          src={images[0]} 
          alt={`${id}-1`} 
          className="w-full h-full object-cover group-hover:opacity-95 transition-opacity" 
          onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800")}
        />
      </div>
      <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-1">
        <img onClick={(e) => { e.stopPropagation(); onOpenGallery(1); }} src={images[1]} alt={`${id}-2`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
        <img onClick={(e) => { e.stopPropagation(); onOpenGallery(2); }} src={images[2]} alt={`${id}-3`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
        <img onClick={(e) => { e.stopPropagation(); onOpenGallery(3); }} src={images[3]} alt={`${id}-4`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
        <div className="relative w-full h-full" onClick={(e) => { e.stopPropagation(); onOpenGallery(4); }}>
          <img src={images[4]} alt={`${id}-5`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
          {totalCount > 5 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold backdrop-blur-[1px]">
              +{totalCount - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Modal Components ---

const ShortsPlayerModal = ({ videoId, onClose }: { videoId: string | null, onClose: () => void }) => {
  if (!videoId) return null;
  
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&origin=${origin}&rel=0&modestbranding=1`;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[900] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full backdrop-blur-md active:scale-90 transition-transform">
          <X size={24} />
        </button>
        <iframe 
          src={embedUrl}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

const ReviewFrameModal = ({ isOpen, onClose, url }: { isOpen: boolean, onClose: () => void, url: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[900] flex items-end justify-center bg-black/60 animate-in fade-in duration-300">
      <div className="bg-white w-full h-[92vh] rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex-1 w-full bg-gray-50 relative">
          <iframe 
            src={url}
            className="w-full h-full border-none"
            title="Review Frame"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
          <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-bold mb-2">프레임 내 로딩이 제한될 수 있습니다.</p>
              <button className="text-xs font-black text-blue-600 underline pointer-events-auto" onClick={() => window.open(url, '_blank')}>새 창에서 보기</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all text-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomInfoModal = ({ isOpen, onClose, room, onOpenGallery, onReserve }: { isOpen: boolean, onClose: () => void, room: any, onOpenGallery: (imgs: string[], idx: number) => void, onReserve: () => void }) => {
  if (!isOpen || !room) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[550] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto hide-scrollbar shadow-2xl">
      {/* Header - Fixed & Fully Opaque */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center px-4 py-4 w-full">
        <button onClick={onClose} className="p-1"><ChevronLeft size={24} /></button>
        <h2 className="flex-1 text-center font-bold text-lg mr-6">객실 상세보기</h2>
      </header>

      <div className="flex-1 bg-white">
        <section className="w-full">
          <MosaicGallery 
            images={room.images} 
            totalCount={room.images.length} 
            id="room-detail-mosaic" 
            onOpenGallery={(idx) => onOpenGallery(room.images, idx)} 
          />
        </section>
        <div className="p-6 space-y-8 pb-10">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">객실 {room.name}</h3>
            <div className="flex flex-wrap items-center text-gray-500 text-sm gap-y-2 gap-x-4 bg-gray-50 p-5 rounded-2xl">
              <div className="flex items-center"><Users size={18} className="mr-2 text-blue-600" /><span className="font-semibold">기준 {room.minGuests}인 / 최대 {room.maxGuests}인</span></div>
              <div className="text-gray-200 hidden sm:block">|</div>
              <div className="flex items-center"><Calendar size={18} className="mr-2 text-blue-600" /><span className="font-semibold">체크인 15:00 / 체크아웃 11:00</span></div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center"><span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>객실 상세 설명</h4>
            <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap font-normal bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {room.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Button - Fixed Docked at bottom of viewport */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onReserve} 
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all text-lg"
        >
          이 객실 예약하기
        </button>
      </div>
    </div>
  );
};

const UnifiedBookingModal = ({ 
  isOpen, 
  onClose, 
  startDate, 
  endDate, 
  adults, 
  children, 
  infants, 
  onDateSelect, 
  onGuestSelect 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  startDate: Date, 
  endDate: Date,
  adults: number,
  children: number,
  infants: number,
  onDateSelect: (start: Date, end: Date) => void,
  onGuestSelect: (a: number, c: number, i: number) => void
}) => {
  if (!isOpen) return null;
  const [viewDate, setViewDate] = useState(new Date(startDate));
  const [localStart, setLocalStart] = useState<Date | null>(startDate);
  const [localEnd, setLocalEnd] = useState<Date | null>(endDate);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDateLabel = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);
    
    if (clickedDate < today) return;

    if (!localStart || (localStart && localEnd)) {
      setLocalStart(clickedDate);
      setLocalEnd(null);
    } else if (clickedDate > localStart) {
      setLocalEnd(clickedDate);
    } else {
      setLocalStart(clickedDate);
      setLocalEnd(null);
    }
  };

  const days = [];
  const totalDays = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const isSelected = (day: number) => {
    if (!day) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    const time = d.getTime();
    if (localStart && time === localStart.getTime()) return true;
    if (localEnd && time === localEnd.getTime()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!day || !localStart || !localEnd) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    const time = d.getTime();
    return time > localStart.getTime() && time < localEnd.getTime();
  };

  const isPast = (day: number) => {
    if (!day) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  };

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[850] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full h-[90vh] rounded-t-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-bold">일정 및 인원 선택</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-8 pb-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">체크인</p>
              <p className="text-xs font-bold text-gray-800">{localStart ? formatDateLabel(localStart) : '날짜 선택'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase tracking-wider">체크아웃</p>
              <p className="text-xs font-bold text-gray-800">{localEnd ? formatDateLabel(localEnd) : '날짜 선택'}</p>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 text-gray-400 hover:text-gray-900"><ChevronLeft size={20} /></button>
              <h4 className="font-bold text-gray-900">{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</h4>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 text-gray-400 hover:text-gray-900"><ChevronRightIcon size={20} /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-gray-400 mb-2">
              {['일','월','화','수','목','금','토'].map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {days.map((day, i) => {
                const selected = day ? isSelected(day) : false;
                const inRange = day ? isInRange(day) : false;
                const past = day ? isPast(day) : false;

                return (
                  <div 
                    key={i} 
                    onClick={() => day && handleDateClick(day)}
                    className={`
                      relative h-11 flex items-center justify-center text-sm font-medium transition-all
                      ${!day ? 'pointer-events-none' : 'cursor-pointer'}
                      ${past ? 'text-gray-200 pointer-events-none' : (selected ? 'text-white' : 'text-gray-700 hover:bg-gray-50')}
                      ${selected ? 'bg-blue-600 font-bold rounded-lg shadow-sm z-10' : ''}
                      ${inRange ? 'bg-blue-50 text-blue-600 rounded-none' : 'rounded-lg'}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Users2 size={16} className="text-blue-600" /> 인원 설정
            </h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">성인</p>
                  <p className="text-[11px] text-gray-400 font-medium">만 13세 이상</p>
                </div>
                <div className="flex items-center gap-5">
                  <button onClick={() => onGuestSelect(Math.max(1, adults - 1), children, infants)} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={16} /></button>
                  <span className="font-bold text-base w-4 text-center">{adults}</span>
                  <button onClick={() => onGuestSelect(adults + 1, children, infants)} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">아동</p>
                  <p className="text-[11px] text-gray-400 font-medium">만 2세 ~ 12세</p>
                </div>
                <div className="flex items-center gap-5">
                  <button onClick={() => onGuestSelect(adults, Math.max(0, children - 1), infants)} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={16} /></button>
                  <span className="font-bold text-base w-4 text-center">{children}</span>
                  <button onClick={() => onGuestSelect(adults, children + 1, infants)} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">유아</p>
                  <p className="text-[11px] text-gray-400 font-medium">만 2세 미만</p>
                </div>
                <div className="flex items-center gap-5">
                  <button onClick={() => onGuestSelect(adults, children, Math.max(0, infants - 1))} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={16} /></button>
                  <span className="font-bold text-base w-4 text-center">{infants}</span>
                  <button onClick={() => onGuestSelect(adults, children, infants + 1)} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (localStart && localEnd) {
              onDateSelect(localStart, localEnd);
              onClose();
            }
          }} 
          disabled={!localStart || !localEnd}
          className={`w-full font-bold py-4 rounded-2xl mt-4 shadow-lg transition-all shrink-0 ${localStart && localEnd ? 'bg-blue-600 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'}`}
        >
          {localStart && localEnd ? '선택 완료' : '날짜를 선택해 주세요'}
        </button>
      </div>
    </div>
  );
};

const ImageGalleryModal = ({ isOpen, onClose, images, activeIndex, setActiveIndex }: { isOpen: boolean, onClose: () => void, images: string[], activeIndex: number, setActiveIndex: (i: number) => void }) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && thumbContainerRef.current) {
      const container = thumbContainerRef.current;
      const activeThumb = container.children[activeIndex] as HTMLElement;
      if (activeThumb) {
        const scrollLeft = activeThumb.offsetLeft + (activeThumb.offsetWidth / 2) - (container.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeIndex, isOpen]);

  if (!isOpen || !images.length) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
      } else {
        setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[800] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/50 to-transparent">
        <span className="font-bold tracking-widest">{activeIndex + 1} / {images.length}</span>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button>
      </div>
      
      <div 
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)} className="absolute left-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-md z-10 active:scale-90 transition-transform"><ChevronLeft size={28} /></button>
        <img 
          src={images[activeIndex]} 
          alt={`gallery-${activeIndex}`} 
          className="max-w-full max-h-[80vh] object-contain select-none transition-opacity duration-300" 
        />
        <button onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)} className="absolute right-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-md z-10 active:scale-90 transition-transform"><ChevronRightIcon size={28} /></button>
      </div>

      <div 
        ref={thumbContainerRef}
        className="h-24 px-4 flex items-center gap-2 overflow-x-auto hide-scrollbar bg-black/50 backdrop-blur-md border-t border-white/10 scroll-smooth"
      >
        {images.map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            onClick={() => setActiveIndex(idx)} 
            className={`h-16 w-16 object-cover rounded-lg cursor-pointer transition-all duration-300 shrink-0 ${idx === activeIndex ? 'ring-2 ring-blue-500 scale-105 opacity-100' : 'opacity-40'}`} 
          />
        ))}
      </div>
    </div>
  );
};

// --- Agreement Term Modal ---
const AgreementTermModal = ({ isOpen, title, onClose, onAgree }: { isOpen: boolean, title: string, onClose: () => void, onAgree: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[1000] flex items-end justify-center bg-black/50 animate-in fade-in duration-300">
      <div className="bg-white w-full h-[70vh] rounded-t-3xl flex flex-col p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4 pr-1 hide-scrollbar">
          <p>이곳에 약관 본문 내용이 들어갑니다.</p>
          <p>태안 엘플레이트 풀빌라는 고객님의 안전과 쾌적한 휴식을 위해 최선을 다하고 있습니다.</p>
        </div>
        <div className="pt-6 mt-4 border-t border-gray-100">
          <button 
            onClick={onAgree}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all text-lg"
          >
            동의합니다
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Facilities Modal ---
const FacilitiesModal = ({ isOpen, onClose, facilities }: { isOpen: boolean, onClose: () => void, facilities: any[] }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[750] flex items-end justify-center bg-black/50 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full h-[70vh] rounded-t-3xl flex flex-col p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold">숙소 테마 및 시설</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
          <div className="grid grid-cols-2 gap-y-6 py-4">
            {facilities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-gray-400">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[15px] font-bold text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 mt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all text-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Attractions Modal ---
const AttractionsModal = ({ isOpen, onClose, attractions }: { isOpen: boolean, onClose: () => void, attractions: any[] }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[750] flex items-end justify-center bg-black/50 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full h-[70vh] rounded-t-3xl flex flex-col p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold">주변 관광지</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar">
          <div className="flex flex-col gap-y-3.5 py-4">
            {attractions.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 bg-blue-50 rounded-md text-blue-500 shrink-0"><MapPin size={12} className="fill-current" /></div>
                  <span className="text-[14px] font-bold text-gray-800 truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded shrink-0 ml-2">{item.distance}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 mt-4 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all text-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Shared Footer Component ---
const SharedFooter = () => (
  <footer className="bg-[#f2f2f2] border-t border-gray-200 px-6 py-6">
    <div className="space-y-1.5 text-[12px] text-[#777] font-medium leading-relaxed">
      <div className="flex items-center flex-wrap gap-x-2">
        <span>트립일레븐</span>
        <span className="text-gray-300">|</span>
        <span>서울 금천구 가산디지털1로 186 제이플라츠 903호</span>
      </div>
      <div className="flex items-center flex-wrap gap-x-2">
        <span>대표명: 손기훈</span>
        <span className="text-gray-300">|</span>
        <span>사업자번호: 367-88-00819</span>
      </div>
    </div>
    <div className="mt-6 pt-4 border-t border-gray-300/40">
      <p className="text-[12px] text-[#999] leading-[1.6]">
        트립일레븐은 통신판매 중개자로서 예약시스템만 제공하며, 예약 관련 서비스는 숙박업체의 책임하에 운영되고 있습니다.
      </p>
      <p className="mt-4 text-[11px] text-[#aaa] font-bold tracking-wider uppercase">
        COPYRIGHT©(주)트립일레븐. ALL RIGHTS RESERVED.
      </p>
    </div>
  </footer>
);

// --- Reservation/Booking View Component ---

const ReservationView = ({ 
  isOpen, 
  onClose, 
  room, 
  startDate, 
  endDate, 
  adults, 
  children, 
  infants,
  secondsRemaining
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  room: any,
  startDate: Date,
  endDate: Date,
  adults: number,
  children: number,
  infants: number,
  secondsRemaining: number
}) => {
  if (!isOpen) return null;

  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  const [agreements, setAgreements] = useState({
    rules: false,
    refund: false,
    privacy: false,
    age: false
  });
  const [activeAgreementModal, setActiveAgreementModal] = useState<string | null>(null);

  const nameRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const verifyRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);
  const verifyInputRef = useRef<HTMLInputElement>(null);

  const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = 159000;
  const totalPriceRaw = basePrice * diffDays;
  const discountAmount = 4000;
  const finalPrice = totalPriceRaw - discountAmount;

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const formatDateWithDay = (date: Date) => {
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} (${dayNames[date.getDay()]})`;
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    let formatted = val;
    if (val.length > 3 && val.length <= 7) {
      formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
    } else if (val.length > 7) {
      formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7, 11)}`;
    }
    setPhoneNumber(formatted);
  };

  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setVerificationCode(val);
  };

  const digitsOnly = phoneNumber.replace(/[^0-9]/g, '');
  const isPhoneValid = digitsOnly.length === 11;
  const isCodeValid = verificationCode.length === 4;

  const handleRequestVerification = () => {
    if (isPhoneValid) {
      setShowVerification(true);
      setTimeout(() => {
        verifyInputRef.current?.focus();
      }, 50);
    }
  };

  const paymentMethods = [
    { id: 'card', name: '신용/체크카드', icon: 'https://cdn-icons-png.flaticon.com/512/657/657076.png' },
    { id: 'vbank', name: '가상계좌', icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png' },
    { id: 'naver', name: '네이버페이', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Naver_Pay_Logo.png' },
    { id: 'kakao', name: '카카오페이', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/KakaoPay_logo.png' },
    { id: 'toss', name: '토스페이', icon: 'https://static.toss.im/assets/homepage/safety/icn-logo.png' },
    { id: 'transfer', name: '퀵계좌이체', icon: 'https://static.toss.im/assets/homepage/safety/icn-logo.png' }
  ];

  const handlePayment = () => {
    if (!userName.trim()) {
      nameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!isPhoneValid) {
      phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (showVerification && !isVerified) {
      verifyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!selectedPayment) {
      paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!agreements.rules || !agreements.refund || !agreements.privacy || !agreements.age) {
      agreementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    alert('결제 단계로 진행합니다.');
  };

  const handleAgreedAll = () => {
    const newState = !Object.values(agreements).every(v => v);
    setAgreements({
      rules: newState,
      refund: newState,
      privacy: newState,
      age: newState
    });
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isAgreedAll = Object.values(agreements).every(v => v);

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[600] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto hide-scrollbar shadow-2xl">
      <AgreementTermModal 
        isOpen={!!activeAgreementModal} 
        title={activeAgreementModal || ''} 
        onClose={() => setActiveAgreementModal(null)}
        onAgree={() => {
          if (activeAgreementModal === '[필수] 이용규칙') setAgreements(p => ({...p, rules: true}));
          if (activeAgreementModal === '[필수] 취소 및 환불 규칙') setAgreements(p => ({...p, refund: true}));
          if (activeAgreementModal === '[필수] 개인정보 제3자 제공 안내') setAgreements(p => ({...p, privacy: true}));
          setActiveAgreementModal(null);
        }}
      />
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center px-4 py-4 w-full">
        <button onClick={onClose} className="p-1"><ChevronLeft size={24} /></button>
        <h2 className="flex-1 text-center font-bold text-lg mr-6">예약</h2>
      </header>
      <div className="flex-1 bg-gray-50 pb-0">
        <div className="p-4 bg-white">
          <div className="bg-[#121212] p-5 rounded-2xl border border-gray-800 mb-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 p-10 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#FF4F4F] rounded-full shadow-[0_0_8px_rgba(255,79,79,0.8)]"></div>
                  <h2 className="text-[12px] font-black text-[#FF4F4F] uppercase tracking-tighter leading-none">
                    LOWEST PRICE <br /> GUARANTEE
                  </h2>
                </div>
                <div className="relative">
                  <div className="bg-white text-black text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg animate-bounce whitespace-nowrap">
                    고객센터 이용고객 대상
                    <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="pt-1 relative">
                <div className="pr-24">
                  <h3 className="text-white text-2xl font-black tracking-tight leading-tight">24시간 한정</h3>
                  <h3 className="text-[#FFEA00] text-2xl font-black tracking-tight leading-tight [text-shadow:0_0_15px_rgba(255,234,0,0.6)]">최저가 보장</h3>
                </div>
                <div className="absolute top-1 right-0 flex items-center gap-1.5 bg-red-500/10 px-2 py-1.5 rounded-lg border border-red-500/30">
                  <Clock size={12} className="text-[#FFEA00]" />
                  <span className="text-[13px] font-black font-mono text-[#FFEA00] tracking-tighter">{formatTime(secondsRemaining)}</span>
                </div>
              </div>
            </div>
            <div className="text-[13px] text-gray-400 mt-4 leading-relaxed font-medium relative z-10 space-y-0.5">
              <p>🎁 상담 고객 한정 특별가를 드립니다.</p>
              <p>📣 타 예약사이트 대비 <span className="text-[#FF4F4F] font-black">최저가 보장</span></p>
              <p>🏸 최저가를 발견하시면 차액을 보상해드립니다.</p>
            </div>
          </div>
        </div>
        <section className="bg-white p-5 mb-2">
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded mb-2">타사이트 대비 최저가보장</div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">태안 엘플레이트풀빌라<br />{room.name}</h3>
          <div className="flex justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-bold mb-1">체크인</span>
              <span className="text-lg font-bold text-gray-900 leading-tight">{formatDateWithDay(startDate)}</span>
              <span className="text-sm font-bold text-gray-900">15:00</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[11px] text-gray-400 font-bold mb-1">체크아웃</span>
              <span className="text-lg font-bold text-gray-900 leading-tight">{formatDateWithDay(endDate)}</span>
              <span className="text-sm font-bold text-gray-900">11:00</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-gray-50">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
              <Users size={14} />
              <span>기준 {room.minGuests}명 / 최대 {room.maxGuests}명</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 text-xs font-bold">숙박 / {diffDays}박</span>
              <span className="text-xl font-bold text-gray-900">{totalPriceRaw.toLocaleString()}원</span>
            </div>
          </div>
        </section>
        <section className="bg-white p-5 mb-2">
          <h4 className="text-[15px] font-bold text-gray-900 mb-6">이용정보</h4>
          <div className="space-y-6">
            <div ref={nameRef}>
              <p className="text-[11px] text-gray-400 font-bold mb-1">성명 <span className="text-red-500">*</span></p>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="방문자의 성함을 입력해주세요"
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-600 font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium bg-transparent"
              />
            </div>
            <div className="space-y-4">
              <div ref={phoneRef}>
                <p className="text-[11px] text-gray-400 font-bold mb-1">휴대폰번호(010-0000-0000) <span className="text-red-500">*</span></p>
                <div className="flex items-center gap-2 border-b border-gray-200 focus-within:border-blue-600 transition-colors">
                  <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={handlePhoneChange}
                    placeholder="방문자의 휴대폰번호를 입력해주세요."
                    className="flex-1 py-2 focus:outline-none font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium bg-transparent min-w-0"
                  />
                  <button 
                    type="button"
                    onClick={handleRequestVerification}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md whitespace-nowrap transition-colors mb-1 flex-shrink-0 ${isVerified ? 'bg-gray-100 text-gray-400' : (isPhoneValid ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400')}`}
                  >
                    인증하기
                  </button>
                </div>
              </div>
              {showVerification && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300" ref={verifyRef}>
                  <p className="text-[11px] text-gray-400 font-bold mb-1">인증번호 입력 <span className="text-red-500">*</span></p>
                  <div className="flex items-center gap-2 border-b border-gray-200 focus-within:border-blue-600 transition-colors">
                    <input 
                      ref={verifyInputRef}
                      type="text" 
                      value={verificationCode}
                      onChange={handleVerificationChange}
                      placeholder="인증번호를 입력해주세요"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      className="flex-1 py-2 focus:outline-none font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium bg-transparent min-w-0"
                    />
                    <button 
                      type="button"
                      onClick={() => isCodeValid && setIsVerified(true)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-md whitespace-nowrap transition-colors mb-1 flex-shrink-0 ${isVerified ? 'bg-gray-100 text-gray-400' : (isCodeValid ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400')}`}
                    >
                      {isVerified ? '인증완료' : '인증번호 확인'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-bold mb-1">요청사항</p>
              <input 
                type="text" 
                placeholder="요청사항을 입력해주세요."
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-600 font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium bg-transparent"
              />
            </div>
          </div>
        </section>
        <section className="bg-white p-5 mb-2">
          <h4 className="text-[15px] font-bold text-gray-900 mb-4">할인</h4>
          <div className="w-full flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
              <div className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl-lg">BEST</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-blue-900 text-[14px]">최저가 보장 할인</span>
                <span className="text-[10px] text-blue-500 font-bold">지금만 가능한 특가 혜택</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-black text-blue-600 text-lg">-{discountAmount.toLocaleString()}원</span>
            </div>
          </div>
        </section>
        <section className="bg-white p-5 mb-2">
          <h4 className="text-[15px] font-bold text-gray-900 mb-6">결제 금액</h4>
          <div className="space-y-3.5 mb-5">
            <div className="flex justify-between text-sm text-gray-600 font-medium">
              <span>상품 금액</span>
              <span className="text-gray-900">{totalPriceRaw.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 font-medium items-center">
              <div className="flex items-center gap-2">
                <span>할인 금액</span>
                <span className="bg-gray-100 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200">2% 할인</span>
              </div>
              <span className="text-gray-900">-{discountAmount.toLocaleString()}원</span>
            </div>
          </div>
          <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900 text-lg">총 결제 금액</span>
            <span className="text-xl font-black text-blue-600">{finalPrice.toLocaleString()}원</span>
          </div>
        </section>
        <section className="bg-white p-5 mb-2" ref={paymentRef}>
          <h4 className="text-[15px] font-bold text-gray-900 mb-6">결제 수단 <span className="text-red-500">*</span></h4>
          <div className="border border-gray-100 rounded-xl divide-y divide-gray-50">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setSelectedPayment(method.id)}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === method.id ? 'border-gray-900' : 'border-gray-200'}`}>
                    {selectedPayment === method.id && <div className="w-2 h-2 bg-gray-900 rounded-full" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <PaymentIcon id={method.id} name={method.name} icon={method.icon} />
                    <span className="font-bold text-sm text-gray-800">{method.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-orange-50/40 p-5 mb-2 border-y border-orange-100/50 space-y-4">
          <div className="flex gap-3">
            <Info size={18} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-orange-900 mb-1">현장결제</p>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">추가인원 비용등의 현장결제 발생 상품을 확인하세요.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Info size={18} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-orange-900 mb-1">취소불가 및 수수료</p>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">취소 및 환불규정에 따라 취소불가, 수수료가 발생할 수 있습니다.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Info size={18} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-black text-orange-900 mb-1">미성년자 및 법정대리인 필수</p>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">미성년자는 법정대리인 동행 없이 투숙이 불가능합니다.</p>
            </div>
          </div>
        </section>
        <section className="bg-white p-5 space-y-6 mb-32" ref={agreementRef}>
          <div className="flex items-center gap-3 py-4 border-b border-gray-100 cursor-pointer" onClick={handleAgreedAll}>
            <div className={`p-1 rounded-md transition-colors ${isAgreedAll ? 'bg-blue-600' : 'bg-gray-100'}`}>
              <Check size={20} className="text-white" />
            </div>
            <span className="text-lg font-black text-gray-900">전체 동의</span>
          </div>
          <div className="space-y-6 px-1">
            {[
              { id: 'rules', label: '[필수] 이용규칙' },
              { id: 'refund', label: '[필수] 취소 및 환불 규칙' },
              { id: 'privacy', label: '[필수] 개인정보 제3자 제공 안내' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleAgreement(item.id as any)}>
                  <Check size={18} className={agreements[item.id as keyof typeof agreements] ? 'text-blue-600' : 'text-gray-200'} />
                  <span className="text-[13px] text-gray-500 font-medium">{item.label}</span>
                </div>
                <button 
                  onClick={() => setActiveAgreementModal(item.label)}
                  className="text-[11px] text-blue-600 font-bold"
                >
                  보기
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleAgreement('age')}>
                <Check size={18} className={agreements.age ? 'text-blue-600' : 'text-gray-200'} />
                <span className="text-[13px] text-gray-500 font-medium">[필수] 본인은 만 19세 이상입니다.</span>
              </div>
            </div>
          </div>
        </section>
        <SharedFooter />
      </div>

      {/* FIXED BOTTOM ACTION BAR - Corrected Position */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-[610] shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handlePayment}
          className={`w-full font-bold py-4 rounded-xl shadow-lg text-lg transition-all ${
            (userName && isPhoneValid && selectedPayment && isAgreedAll) ? 'bg-blue-600 text-white active:scale-95' : 'bg-gray-300 text-white'
          }`}
        >
          {finalPrice.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const d = new Date(Date.now() + 86400000);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isRoomInfoModalOpen, setIsRoomInfoModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  const [activeShortId, setActiveShortId] = useState<string | null>(null);
  const [isReviewFrameModalOpen, setIsReviewFrameModalOpen] = useState(false);
  const [reviewFrameUrl, setReviewFrameUrl] = useState('');
  const [isReservationViewOpen, setIsReservationViewOpen] = useState(false);
  const [isFacilitiesModalOpen, setIsFacilitiesModalOpen] = useState(false);
  const [isAttractionsModalOpen, setIsAttractionsModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(24 * 60 * 60);

  const isAnyModalOpen = isBookingModalOpen || isRoomInfoModalOpen || isGalleryOpen || activeShortId !== null || isReviewFrameModalOpen || isReservationViewOpen || isFacilitiesModalOpen || isAttractionsModalOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const startTimeKey = 'villa_promo_start_time';
    let startTime = localStorage.getItem(startTimeKey);
    if (!startTime) {
      startTime = Date.now().toString();
      localStorage.setItem(startTimeKey, startTime);
    }
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - parseInt(startTime!)) / 1000);
      const remaining = Math.max(0, (24 * 60 * 60) - elapsed);
      setSecondsRemaining(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const mainImages = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=800&auto=format&fit=crop"
  ];

  const roomD = {
    name: "D",
    images: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f715?q=80&w=800&auto=format&fit=crop"
    ],
    minGuests: 2,
    maxGuests: 4,
    description: "태안 엘플레이트풀빌라의 시그니처 객실인 D룸은 넓은 개별 온수풀과 프라이빗한 바베큐 공간을 제공합니다.\n\n최고급 킹 사이즈 매트리스와 구스 침구로 편안한 휴식을 보장하며, 통창을 통해 들어오는 채광이 아름다운 객실입니다."
  };

  const allFacilities = [
    { icon: Layers, name: "복층" },
    { icon: Home, name: "독채" },
    { icon: PawPrint, name: "애견" },
    { icon: Utensils, name: "개별바베큐" },
    { icon: Waves, name: "온수풀" },
    { icon: Camera, name: "오션뷰" },
    { icon: Zap, name: "무료와이파이" },
    { icon: Clock, name: "24시간보안" },
    { icon: Users2, name: "공용시설" },
    { icon: Gift, name: "어메니티제공" }
  ];

  const attractions = [
    { name: "속초문화원", distance: "1.18km" },
    { name: "속초문화예술회관 소강당", distance: "1.21km" },
    { name: "속초문화예술회관", distance: "1.22km" },
    { name: "스페이스 동원냉동", distance: "2.48km" },
    { name: "아트플랫폼갯배", distance: "2.58km" },
    { name: "석봉도자기미술관", distance: "2.90km" },
    { name: "소극장&음악창작소 초속", distance: "3.03km" },
    { name: "강원국제관광 엑스포기념관", distance: "3.59km" },
    { name: "피노디아 다빈치뮤지엄", distance: "3.66km" },
    { name: "피노디아 미켈란젤로뮤지엄", distance: "3.68km" },
    { name: "피노디아 테마파크", distance: "3.69km" },
    { name: "메가박스 속초", distance: "3.84km" },
    { name: "풀묶음미술관", distance: "3.95km" },
    { name: "국립산악박물관", distance: "4.85km" },
    { name: "뮤지엄엑스", distance: "0.58km" }
  ];

  const openGallery = (imgs: string[], index: number) => {
    setCurrentGalleryImages(imgs);
    setGalleryActiveIndex(index);
    setIsGalleryOpen(true);
  };

  const openReviewFrame = (url: string) => {
    setReviewFrameUrl(url);
    setIsReviewFrameModalOpen(true);
  };

  return (
    <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-lg pb-0 overflow-x-hidden relative text-gray-900">
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[100] transition-transform duration-300 ${isAnyModalOpen ? '-translate-y-full' : 'translate-y-0 shadow-xl'}`}>
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 px-4 flex items-center justify-between border-b border-blue-400/30">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-200" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-100 leading-none mb-0.5">단 24시간! 최저가 보장제</span>
              <span className="text-xs font-black tracking-tighter">예약 유효시간 남음</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/20">
            <Clock size={14} className="text-yellow-400 animate-pulse" />
            <span className="text-[15px] font-black font-mono tracking-tight text-white">{formatTime(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      <div className="pt-[52px]">
        <ShortsPlayerModal videoId={activeShortId} onClose={() => setActiveShortId(null)} />
        <ReviewFrameModal isOpen={isReviewFrameModalOpen} onClose={() => setIsReviewFrameModalOpen(false)} url={reviewFrameUrl} />
        
        <RoomInfoModal 
          isOpen={isRoomInfoModalOpen} 
          onClose={() => setIsRoomInfoModalOpen(false)} 
          room={roomD} 
          onOpenGallery={openGallery} 
          onReserve={() => { 
            setIsRoomInfoModalOpen(false); 
            setIsReservationViewOpen(true); 
          }} 
        />

        <FacilitiesModal isOpen={isFacilitiesModalOpen} onClose={() => setIsFacilitiesModalOpen(false)} facilities={allFacilities} />
        <AttractionsModal isOpen={isAttractionsModalOpen} onClose={() => setIsAttractionsModalOpen(false)} attractions={attractions} />
        
        <UnifiedBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} startDate={startDate} endDate={endDate} adults={adults} children={children} infants={infants} onDateSelect={(s, e) => { setStartDate(s); setEndDate(e); }} onGuestSelect={(a, c, i) => { setAdults(a); setChildren(c); setInfants(i); }} />
        <ReservationView isOpen={isReservationViewOpen} onClose={() => setIsReservationViewOpen(false)} room={roomD} startDate={startDate} endDate={endDate} adults={adults} children={children} infants={infants} secondsRemaining={secondsRemaining} />
        <ImageGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} images={currentGalleryImages} activeIndex={galleryActiveIndex} setActiveIndex={setGalleryActiveIndex} />

        <section className="w-full">
          <MosaicGallery images={mainImages} totalCount={mainImages.length} id="main" onOpenGallery={(idx) => openGallery(mainImages, idx)} />
        </section>

        <section className="p-5 pb-3 border-b border-gray-50">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['#개별바베큐', '#사계절온수풀', '#오션뷰', '#프라이빗'].map(theme => (
              <span key={theme} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">{theme}</span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">태안 엘플레이트풀빌라</h1>
          <div className="flex items-start text-gray-600 text-sm leading-relaxed mb-4">
            <MapPin size={16} className="mr-1 mt-0.5 shrink-0 text-blue-500" />
            <p>충청남도 태안군 남면 몽대로 359-3</p>
          </div>
          <div className="bg-[#121212] p-5 rounded-2xl border border-gray-800 mb-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 p-10 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#FF4F4F] rounded-full shadow-[0_0_8px_rgba(255,79,79,0.8)]"></div>
                  <h2 className="text-[12px] font-black text-[#FF4F4F] uppercase tracking-tighter leading-none">LOWEST PRICE <br /> GUARANTEE</h2>
                </div>
                <div className="relative">
                  <div className="bg-white text-black text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-lg animate-bounce whitespace-nowrap">
                    고객센터 이용고객 대상
                    <div className="absolute -bottom-1 right-3 w-2 h-2 bg-white rotate-45"></div>
                  </div>
                </div>
              </div>
              <div className="pt-1 relative">
                <div className="pr-24">
                  <h3 className="text-white text-2xl font-black tracking-tight leading-tight">24시간 한정</h3>
                  <h3 className="text-[#FFEA00] text-2xl font-black tracking-tight leading-tight [text-shadow:0_0_15px_rgba(255,234,0,0.6)]">최저가 보장</h3>
                </div>
                <div className="absolute top-1 right-0 flex items-center gap-1.5 bg-red-500/10 px-2 py-1.5 rounded-lg border border-red-500/30">
                  <Clock size={12} className="text-[#FFEA00]" />
                  <span className="text-[13px] font-black font-mono text-[#FFEA00] tracking-tighter">{formatTime(secondsRemaining)}</span>
                </div>
              </div>
            </div>
            <div className="text-[13px] text-gray-400 mt-4 leading-relaxed font-medium relative z-10 space-y-0.5">
              <p>🎁 상담 고객 한정 특별가를 드립니다.</p>
              <p>📣 타 예약사이트 대비 <span className="text-[#FF4F4F] font-black">최저가 보장</span></p>
              <p>🏸 최저가를 발견하시면 차액을 보상해드립니다.</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
            <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5"><Zap size={14} className="text-blue-600" /> 숙소 소개</h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">태안의 푸른 바다를 품은 엘플레이트 풀빌라는 전 객실 환상적인 오션뷰와 개별 온수풀을 갖춘 최고급 휴양 공간입니다.</p>
          </div>
        </section>

        {/* Accommodation Theme and Facilities Section */}
        <section className="px-5 py-8 border-b border-gray-50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
            숙소 테마 및 시설
          </h2>
          <div className="grid grid-cols-2 gap-y-6 mb-8">
            {allFacilities.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-gray-400">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <span className="text-[15px] font-bold text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsFacilitiesModalOpen(true)}
            className="w-full border border-gray-300 py-3.5 rounded-xl text-[14px] font-bold text-gray-700 active:bg-gray-50 transition-colors shadow-sm"
          >
            편의시설 {allFacilities.length}개 모두보기
          </button>
        </section>

        {/* Visitor Reviews Section */}
        <section className="px-5 mb-8 mt-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
              방문객 리뷰
            </h2>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => openReviewFrame('https://m.place.naver.com/accommodation/1729836495/review/visitor')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon type="Naver" />
                <span className="text-[14px] font-bold text-gray-800">네이버 리뷰 보러가기</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button 
              onClick={() => openReviewFrame('https://nol.yanolja.com/reviews/domestic/10044747')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon type="Yanolja" />
                <span className="text-[14px] font-bold text-gray-800">야놀자 리뷰 보러가기</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>

            <button 
              onClick={() => openReviewFrame('https://www.yeogi.com/domestic-accommodations/69714?checkIn=2026-01-26&checkOut=2026-01-27&personal=2')}
              className="w-full flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon type="Yeogiyeottae" />
                <span className="text-[14px] font-bold text-gray-800">여기어때 리뷰 보러가기</span>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
        </section>

        <section className="px-5 mb-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full"></span>객실 선택</h2>
          <div className="mb-6">
            <button 
              onClick={() => setIsBookingModalOpen(true)} 
              className="w-full flex items-center justify-between border border-gray-200 bg-white rounded-xl py-3.5 px-4 text-sm font-bold text-gray-800 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded-lg"><Calendar size={18} /></div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">일정 및 인원</span>
                  <span className="text-[13px]">{formatDate(startDate)} ~ {formatDate(endDate)} ({diffDays}박) / {adults + children + infants}명</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          </div>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-lg bg-white mb-8">
            <MosaicGallery images={roomD.images} totalCount={roomD.images.length} id="roomD" onOpenGallery={(idx) => openGallery(roomD.images, idx)} />
            <div className="p-5 pt-4">
              <div className="flex justify-between items-center mb-1"><h3 className="text-2xl font-black text-gray-900 tracking-tight">{roomD.name}</h3><button onClick={() => setIsRoomInfoModalOpen(true)} className="flex items-center text-gray-400 text-[11px] font-bold hover:text-blue-600">상세보기 <ChevronRight size={12} className="ml-0.5" /></button></div>
              <div className="flex items-center text-gray-500 text-xs mb-1 font-medium"><Users size={14} className="mr-1 text-blue-500" /><span>기준 {roomD.minGuests}인 / 최대 {roomD.maxGuests}인</span></div>
              <div className="text-[11px] text-gray-400 mb-2 font-medium">체크인 15:00 ~ 체크아웃 11:00</div>
              <div className="mb-2"><span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-100 inline-block shadow-sm">타사이트 대비 최저가보장</span></div>
              <div className="flex flex-col items-end -mt-8">
                <div className="flex items-center gap-1.5"><span className="text-red-500 font-extrabold text-xl">73%</span><span className="text-gray-300 line-through text-xs font-medium">550,000</span></div>
                <div className="flex flex-col items-end -mt-0.5">
                  <span className="text-blue-600 text-[11px] font-black">최대할인가</span>
                  <div className="flex items-center"><span className="text-3xl font-black text-gray-900 tracking-tighter">145,000원</span></div>
                </div>
              </div>
              <button onClick={() => setIsReservationViewOpen(true)} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-5 shadow-lg active:bg-blue-700 active:scale-98 transition-all text-lg">예약하기</button>
            </div>
          </div>
        </section>

        <section className="px-5 mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full"></span>위치/교통</h2>
          <div className="w-full aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-4 relative border border-gray-200 shadow-sm">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Map Placeholder" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="bg-white p-2.5 rounded-full shadow-2xl border-2 border-red-500"><MapPin size={28} className="text-red-500 fill-current animate-bounce" /></div>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-white/95 border border-gray-200 px-4 py-1.5 rounded-lg shadow-xl text-[12px] font-black text-gray-800">엘 플레이트 풀빌라</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center overflow-hidden font-medium"><MapPin size={18} className="text-blue-500 mr-2 shrink-0" /><span className="truncate">충청남도 태안군 남면 몽대로 359-3</span></div>
            <button onClick={() => { navigator.clipboard.writeText("충청남도 태안군 남면 몽대로 359-3"); alert("주소 복사됨"); }} className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all shadow-sm active:scale-90 shrink-0"><Copy size={18} /></button>
          </div>
        </section>

        {/* Attractions Section */}
        <section className="px-5 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full"></span>주변 관광지</h2>
            <button onClick={() => setIsAttractionsModalOpen(true)} className="text-sm font-semibold text-gray-800 underline active:text-blue-600">전체보기</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-y-3.5">
            {attractions.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 bg-blue-50 rounded-md text-blue-500 shrink-0"><MapPin size={12} className="fill-current" /></div>
                  <span className="text-[13px] font-bold text-gray-800 truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded shrink-0 ml-2">{item.distance}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Accommodation Information Section */}
        <section className="px-6 py-12 bg-white border-t border-gray-100">
          <div className="max-w-[420px] mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-8 tracking-tight flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
              상세 숙소 정보
            </h2>
            
            <div className="space-y-10">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-3 tracking-tight">공간의 가치</h3>
                <p className="text-[14.5px] text-gray-600 leading-relaxed font-medium">
                  태안 엘플레이트 풀빌라는 단순한 숙박을 넘어 '머무름의 미학'을 지향합니다. 
                  객실의 통창 너머로 펼쳐지는 서해안의 낙조는 일상에 지친 마음을 달래주며, 
                  현대적인 건축 미학과 자연이 조화를 이루는 인테리어는 방문하시는 모든 분들께 
                  갤러리에 온 듯한 영감을 제공합니다.
                </p>
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-3 tracking-tight">주요 시설 및 서비스</h3>
                <p className="text-[14.5px] text-gray-600 leading-relaxed font-medium">
                  사계절 내내 적정 온도가 유지되는 독채형 온수풀을 무료로 마음껏 이용하실 수 있습니다. 
                  또한 프라이빗 개별 테라스에는 최고급 웨버 가스 그릴이 구비되어 있어, 
                  고품격 야외 다이닝과 바베큐 파티를 오롯이 즐기실 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-3 tracking-tight">이용 안내 및 유의사항</h3>
                <p className="text-[14.5px] text-gray-600 leading-relaxed font-medium">
                  체크인은 오후 3시부터이며, 체크아웃은 오전 11시까지입니다. 
                  쾌적한 환경 유지를 위해 객실 내 육류 및 생선류 등 냄새가 심한 조리는 금지하고 있습니다. 
                  또한 전 객실 반려동물 동반이 불가하며, 미성년자의 경우 법정대리인의 동행 없이 투숙이 불가능한 점 양해 부탁드립니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SharedFooter />
        {!isAnyModalOpen && (
          <div className="fixed bottom-6 right-6 z-[120] animate-in slide-in-from-bottom duration-500">
            <button className="bg-blue-600 text-white flex items-center gap-2 px-5 py-3.5 rounded-full shadow-2xl hover:bg-blue-700 active:scale-95 transition-all group">
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-[15px] tracking-tight">상담하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;