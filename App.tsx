
import React, { useState, useEffect } from 'react';
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
  MessageCircle
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
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold backdrop-blur-[1px]">
            +{totalCount - 5}
          </div>
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
    <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
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

const ReviewFrameModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  const reviewUrl = "https://m.place.naver.com/accommodation/1729836495/review/visitor?businessCategory=pension";

  return (
    <div className="fixed inset-0 z-[500] flex items-end justify-center bg-black/60 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[480px] h-[92vh] rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex-1 w-full bg-gray-50 relative">
          <iframe 
            src={reviewUrl}
            className="w-full h-full border-none"
            title="Naver Map Review Frame"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          ></iframe>
          <div className="absolute inset-0 flex items-center justify-center p-10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl text-center shadow-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-bold mb-2">프레임 내 로딩이 제한될 수 있습니다.</p>
              <button className="text-xs font-black text-blue-600 underline pointer-events-auto" onClick={() => window.open(reviewUrl, '_blank')}>새 창에서 보기</button>
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

const ReviewsModal = ({ isOpen, onClose, reviews, onReviewClick }: { isOpen: boolean, onClose: () => void, reviews: any[], onReviewClick: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-[480px] h-[85vh] rounded-t-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h3 className="text-xl font-bold">전체 리뷰</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 hide-scrollbar">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="border-b border-gray-100 pb-6 last:border-0 cursor-pointer active:bg-gray-50 transition-colors"
              onClick={onReviewClick}
            >
              <div className="flex items-center gap-2 mb-2">
                <PlatformIcon type={review.platform} />
                <span className="text-[11px] font-bold text-gray-700">{maskId(review.userId)}</span>
                <div className="flex items-center ml-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-400 text-xs ml-auto">{review.date}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RoomInfoModal = ({ isOpen, onClose, room, onOpenGallery }: { isOpen: boolean, onClose: () => void, room: any, onOpenGallery: (imgs: string[], idx: number) => void }) => {
  if (!isOpen || !room) return null;
  return (
    <div className="fixed inset-0 z-[110] flex justify-center bg-white animate-in slide-in-from-right duration-300">
      <div className="w-full max-w-[480px] h-full flex flex-col bg-white relative">
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pointer-events-none">
          <button onClick={onClose} className="p-2 bg-black/30 text-white rounded-full backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform"><ChevronLeft size={24} /></button>
          <button onClick={onClose} className="p-2 bg-black/30 text-white rounded-full backdrop-blur-md pointer-events-auto shadow-sm active:scale-90 transition-transform"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
          <section className="w-full">
            <MosaicGallery images={room.images} totalCount={room.images.length + 14} id="room-detail-mosaic" onOpenGallery={(idx) => onOpenGallery(room.images, idx)} />
          </section>
          <div className="p-6 space-y-8">
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
              <p className="text-[15px] text-gray-600 leading-relaxed whitespace-pre-wrap font-normal bg-gray-50/50 p-4 rounded-xl border border-gray-100">{room.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100">
          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all text-lg">이 객실 예약하기</button>
        </div>
      </div>
    </div>
  );
};

const DateRangeModal = ({ isOpen, onClose, startDate, endDate, onSelect }: { isOpen: boolean, onClose: () => void, startDate: Date, endDate: Date, onSelect: (start: Date, end: Date) => void }) => {
  if (!isOpen) return null;
  const [viewDate, setViewDate] = useState(new Date(startDate));
  const [localStart, setLocalStart] = useState<Date | null>(startDate);
  const [localEnd, setLocalEnd] = useState<Date | null>(endDate);

  const formatDate = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
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
    if (localStart && d.getTime() === localStart.getTime()) return true;
    if (localEnd && d.getTime() === localEnd.getTime()) return true;
    return false;
  };

  const isInRange = (day: number) => {
    if (!day || !localStart || !localEnd) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d > localStart && d < localEnd;
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-[480px] h-[75vh] rounded-t-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 shrink-0"><h3 className="text-xl font-bold">일정 선택</h3><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button></div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 font-bold">체크인</p><p className="text-xs font-bold text-gray-800">{localStart ? formatDate(localStart) : '-'}</p></div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 font-bold">체크아웃</p><p className="text-xs font-bold text-gray-800">{localEnd ? formatDate(localEnd) : '-'}</p></div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1"><ChevronLeft size={20} /></button>
              <h4 className="font-bold text-gray-900">{viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월</h4>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1"><ChevronRightIcon size={20} /></button>
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-bold text-gray-400 mb-2">
              {['일','월','화','수','목','금','토'].map(d => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {days.map((day, i) => (
                <div 
                  key={i} 
                  onClick={() => day && handleDateClick(day)}
                  className={`
                    relative h-11 flex items-center justify-center text-sm font-medium cursor-pointer rounded-lg transition-all
                    ${!day ? 'pointer-events-none' : ''}
                    ${isSelected(day!) ? 'bg-blue-600 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'}
                    ${isInRange(day!) ? 'bg-blue-50 text-blue-600 rounded-none' : ''}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (localStart && localEnd) {
              onSelect(localStart, localEnd);
              onClose();
            }
          }} 
          disabled={!localStart || !localEnd}
          className={`w-full font-bold py-4 rounded-2xl mt-4 shadow-lg transition-all ${localStart && localEnd ? 'bg-blue-600 text-white active:scale-[0.98]' : 'bg-gray-200 text-gray-400'}`}
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

const GuestModal = ({ isOpen, onClose, adults, children, infants, onSelect }: { isOpen: boolean, onClose: () => void, adults: number, children: number, infants: number, onSelect: (a: number, c: number, i: number) => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-[480px] h-[60vh] rounded-t-3xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8 shrink-0"><h3 className="text-xl font-bold">인원 선택</h3><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button></div>
        <div className="space-y-8 flex-1">
          <div className="flex justify-between items-center"><div><p className="font-bold text-gray-900">성인</p><p className="text-xs text-gray-400 font-medium">만 13세 이상</p></div><div className="flex items-center gap-5"><button onClick={() => onSelect(Math.max(1, adults - 1), children, infants)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={18} /></button><span className="font-bold text-lg w-4 text-center">{adults}</span><button onClick={() => onSelect(adults + 1, children, infants)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={18} /></button></div></div>
          <div className="flex justify-between items-center"><div><p className="font-bold text-gray-900">아동</p><p className="text-xs text-gray-400 font-medium">만 2세 ~ 12세</p></div><div className="flex items-center gap-5"><button onClick={() => onSelect(adults, Math.max(0, children - 1), infants)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={18} /></button><span className="font-bold text-lg w-4 text-center">{children}</span><button onClick={() => onSelect(adults, children + 1, infants)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={18} /></button></div></div>
          <div className="flex justify-between items-center"><div><p className="font-bold text-gray-900">유아</p><p className="text-xs text-gray-400 font-medium">만 2세 미만</p></div><div className="flex items-center gap-5"><button onClick={() => onSelect(adults, children, Math.max(0, infants - 1))} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 active:bg-gray-50"><Minus size={18} /></button><span className="font-bold text-lg w-4 text-center">{infants}</span><button onClick={() => onSelect(adults, children, infants + 1)} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full text-gray-900 active:bg-gray-50"><Plus size={18} /></button></div></div>
        </div>
        <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-auto shadow-lg active:scale-[0.98] transition-all">확인</button>
      </div>
    </div>
  );
};

const ImageGalleryModal = ({ isOpen, onClose, images, activeIndex, setActiveIndex }: { isOpen: boolean, onClose: () => void, images: string[], activeIndex: number, setActiveIndex: (i: number) => void }) => {
  if (!isOpen || !images.length) return null;
  return (
    <div className="fixed inset-0 z-[400] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/50 to-transparent"><span className="font-bold tracking-widest">{activeIndex + 1} / {images.length}</span><button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button></div>
      <div className="flex-1 relative flex items-center justify-center"><button onClick={() => setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)} className="absolute left-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-md z-10"><ChevronLeft size={28} /></button><img src={images[activeIndex]} alt={`gallery-${activeIndex}`} className="max-w-full max-h-[80vh] object-contain select-none" /><button onClick={() => setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)} className="absolute right-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-md z-10"><ChevronRightIcon size={28} /></button></div>
      <div className="h-24 px-4 flex items-center gap-2 overflow-x-auto hide-scrollbar bg-black/50 backdrop-blur-md border-t border-white/10">{images.map((img, idx) => (<img key={idx} src={img} onClick={() => setActiveIndex(idx)} className={`h-16 w-16 object-cover rounded-lg cursor-pointer transition-all ${idx === activeIndex ? 'ring-2 ring-blue-500 scale-105 opacity-100' : 'opacity-40'}`} />))}</div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 86400000));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isRoomInfoModalOpen, setIsRoomInfoModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryActiveIndex, setGalleryActiveIndex] = useState(0);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  const [activeShortId, setActiveShortId] = useState<string | null>(null);
  const [isReviewFrameModalOpen, setIsReviewFrameModalOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(24 * 60 * 60);
  const [showAllAttractions, setShowAllAttractions] = useState(false);

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

  const isAnyModalOpen = isDateModalOpen || isGuestModalOpen || isReviewsModalOpen || isRoomInfoModalOpen || isGalleryOpen || activeShortId !== null || isReviewFrameModalOpen;
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

  const reviews = [
    { id: 1, platform: 'Naver', userId: 'kimsky12', rating: 5, date: '2025.05.21', text: '가족과 함께 방문했습니다. 결론부터 말씀드리자면, 시설이 정말 훌륭했습니다. 특히 수영장이 너무 깨끗해서 아이들이 정말 좋아했어요.' },
    { id: 2, platform: 'Yanolja', userId: 'sunnyday99', rating: 5, date: '2025.05.15', text: '사장님이 너무 친절하시고 숙소가 정말 깨끗해요! 온수풀도 밤늦게까지 따뜻하게 유지되어서 좋았습니다.' },
    { id: 3, platform: 'Yeogiyeottae', userId: 'traveler_jeon', rating: 5, date: '2025.05.02', text: '태안 여행 중 최고의 선택이었습니다. 개별 바베큐장도 잘 되어 있고 프라이빗하게 쉴 수 있어서 좋았습니다.' }
  ];

  const shorts = [
    { id: 1, videoId: "IpJytv79TzI", thumb: "https://img.youtube.com/vi/IpJytv79TzI/hqdefault.jpg" },
    { id: 2, videoId: "IpJytv79TzI", thumb: "https://img.youtube.com/vi/IpJytv79TzI/hqdefault.jpg" },
    { id: 3, videoId: "IpJytv79TzI", thumb: "https://img.youtube.com/vi/IpJytv79TzI/hqdefault.jpg" }
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

  const handleReviewClick = () => {
    setIsReviewFrameModalOpen(true);
  };

  return (
    <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-lg pb-0 overflow-x-hidden relative">
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
        <ReviewFrameModal isOpen={isReviewFrameModalOpen} onClose={() => setIsReviewFrameModalOpen(false)} />
        <ReviewsModal 
          isOpen={isReviewsModalOpen} 
          onClose={() => setIsReviewsModalOpen(false)} 
          reviews={reviews} 
          onReviewClick={handleReviewClick}
        />
        <RoomInfoModal isOpen={isRoomInfoModalOpen} onClose={() => setIsRoomInfoModalOpen(false)} room={roomD} onOpenGallery={openGallery} />
        <DateRangeModal 
          isOpen={isDateModalOpen} 
          onClose={() => setIsDateModalOpen(false)} 
          startDate={startDate} 
          endDate={endDate} 
          onSelect={(s, e) => { setStartDate(s); setEndDate(e); }}
        />
        <GuestModal 
          isOpen={isGuestModalOpen} 
          onClose={() => setIsGuestModalOpen(false)} 
          adults={adults} 
          children={children} 
          infants={infants}
          onSelect={(a, c, i) => { setAdults(a); setChildren(c); setInfants(i); }} 
        />
        <ImageGalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} images={currentGalleryImages} activeIndex={galleryActiveIndex} setActiveIndex={setGalleryActiveIndex} />

        <section className="w-full">
          <MosaicGallery images={mainImages} totalCount={98} id="main" onOpenGallery={(idx) => openGallery(mainImages, idx)} />
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

          {/* --- 최저가 보장 카드 디자인 --- */}
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
                {/* 문구가 타이머와 겹치지 않도록 충분한 우측 패딩 부여 */}
                <div className="pr-24">
                  <h3 className="text-white text-2xl font-black tracking-tight leading-tight">24시간 한정</h3>
                  <h3 className="text-[#FFEA00] text-2xl font-black tracking-tight leading-tight [text-shadow:0_0_15px_rgba(255,234,0,0.6)]">최저가 보장</h3>
                </div>
                
                {/* 타이머 위치 상향 조정 및 절대 위치(absolute)로 고정하여 텍스트 래핑 방지 */}
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
            <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <Zap size={14} className="text-blue-600" /> 숙소 소개
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              태안의 푸른 바다를 품은 엘플레이트 풀빌라는 전 객실 환상적인 오션뷰와 개별 온수풀을 갖춘 최고급 휴양 공간입니다. 
              프라이빗한 휴식과 낭만적인 바베큐 파티를 통해 잊지 못할 추억을 만들어보세요.
            </p>
          </div>
        </section>

        <section className="px-5 my-6">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
               <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
               실제 방문객의 생생 기록
             </h2>
             <button className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">더보기</button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {shorts.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveShortId(item.videoId)}
                className="relative w-36 aspect-[9/16] rounded-2xl overflow-hidden shadow-lg bg-gray-900 shrink-0 ring-2 ring-gray-50 active:scale-95 transition-all group cursor-pointer"
              >
                <img src={item.thumb} alt="Shorts thumb" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 p-2.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={20} className="text-white fill-current" />
                  </div>
                </div>
              </div>
            ))}
            <div className="w-36 aspect-[9/16] rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center shrink-0">
               <Plus size={24} className="text-gray-300 mb-1" />
               <span className="text-[10px] text-gray-400 font-bold">리뷰 올리기</span>
            </div>
          </div>
        </section>

        <section className="px-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Star size={20} className="text-yellow-400 fill-current mr-1" />
              <span className="text-lg font-bold text-gray-900">5.0</span>
              <span className="text-gray-400 text-sm ml-1 font-medium">(72)</span>
            </div>
            <button onClick={() => setIsReviewsModalOpen(true)} className="text-sm font-semibold text-gray-800 underline active:text-blue-600">전체보기</button>
          </div>
          
          <div className="flex flex-col space-y-3 pb-2">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:bg-gray-50 cursor-pointer transition-colors" onClick={handleReviewClick}>
                <div className="flex items-center gap-2 mb-2">
                  <PlatformIcon type={review.platform as any} />
                  <span className="text-[11px] font-bold text-gray-700">{maskId(review.userId)}</span>
                  <div className="flex items-center ml-1">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-current" />)}
                  </div>
                  <span className="text-gray-400 text-[10px] ml-auto font-medium">{review.date}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{review.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 mb-4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full"></span>객실 선택</h2>
          <div className="flex gap-2 mb-6">
            <button onClick={() => setIsDateModalOpen(true)} className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-lg py-3 px-3 text-sm font-bold text-gray-800 shadow-sm active:scale-95 transition-all"><Calendar size={16} className="mr-2 text-blue-600" />{formatDate(startDate)}~{formatDate(endDate)}, {diffDays}박</button>
            <button onClick={() => setIsGuestModalOpen(true)} className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-lg py-3 px-3 text-sm font-bold text-gray-800 shadow-sm active:scale-95 transition-all"><Users size={16} className="mr-2 text-blue-600" />인원 {adults+children+infants}명</button>
          </div>
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-lg bg-white mb-8">
            <MosaicGallery images={roomD.images} totalCount={20} id="roomD" onOpenGallery={(idx) => openGallery(roomD.images, idx)} />
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
              <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl mt-5 shadow-lg active:bg-blue-700 active:scale-98 transition-all text-lg">예약하기</button>
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

        <section className="px-5 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
              주변 관광지({attractions.length})
            </h2>
            <button 
              onClick={() => setShowAllAttractions(!showAllAttractions)} 
              className="text-sm font-semibold text-gray-800 underline active:text-blue-600"
            >
              {showAllAttractions ? '접기' : '전체보기'}
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 transition-all duration-300">
            {(showAllAttractions ? attractions : attractions.slice(0, 3)).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 sm:border-b sm:border-gray-50/50">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 bg-blue-50 rounded-md text-blue-500 shrink-0">
                    <MapPin size={12} className="fill-current" />
                  </div>
                  <span className="text-[13px] font-bold text-gray-800 truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded shrink-0 ml-2">
                  {item.distance}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-12 bg-white border-t border-gray-100">
          <div className="max-w-[420px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight flex items-center gap-3">
              <Info size={22} className="text-blue-600" /> 상세 숙소 정보
            </h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-3.5 flex items-center gap-2">
                  <Camera size={18} className="text-blue-500/70" /> 공간의 가치
                </h3>
                <p className="text-[14.5px] text-gray-600 leading-relaxed font-medium">
                  태안 엘플레이트 풀빌라는 단순한 숙박을 넘어 '머무름의 미학'을 지향합니다. 
                  객실의 통창 너머로 펼쳐지는 서해안의 낙조는 일상에 지친 마음을 달래주며, 
                  현대적인 건축 미학과 자연이 조화를 이루는 인테리어는 방문하시는 모든 분들께 
                  갤러리에 온 듯한 영감을 제공합니다.
                </p>
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Waves size={18} className="text-blue-500/70" /> 주요 시설 및 서비스
                </h3>
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-600 rounded-lg text-white shadow-sm"><Waves size={18} /></div>
                      <h4 className="text-[15px] font-bold text-gray-900">프라이빗 개별 온수풀</h4>
                    </div>
                    <p className="text-[13.5px] text-gray-600 leading-relaxed">사계절 내내 적정 온도가 유지되는 독채형 온수풀을 무료로 마음껏 이용하실 수 있습니다.</p>
                  </div>
                  <div className="p-5 bg-amber-50/40 rounded-2xl border border-amber-100/40">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-500 rounded-lg text-white shadow-sm"><Utensils size={18} /></div>
                      <h4 className="text-[15px] font-bold text-gray-900">웨버 가스 그릴 바베큐</h4>
                    </div>
                    <p className="text-[13.5px] text-gray-600 leading-relaxed">프라이빗 개별 테라스에서 최고급 웨버 그릴을 이용해 고품격 야외 다이닝을 즐겨보세요.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200/60">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4 px-1">유의사항 및 안내</h3>
                <ul className="space-y-3.5">
                  {[
                    '입실 오후 3시 / 퇴실 오전 11시',
                    '객실 내 육류/생선류 등 냄새가 심한 조리 금지',
                    '전 객실 반려동물 동반 불가 (알러지 예방)',
                    '미성년자는 보호자 동반 없이 입실 불가'
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12.5px] text-gray-500 leading-relaxed font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#f2f2f2] border-t border-gray-200 px-6 py-10">
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
              <span className="text-gray-300">|</span>
              <span className="cursor-pointer hover:underline">사업자정보확인</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300/40">
            <p className="text-[12px] text-[#999] leading-[1.6]">
              트립일레븐은 통신판매 중개자로서 예약시스템만 제공하며, 예약 관련 서비스는 숙박업체의 책임하에 운영되고 있습니다.
            </p>
            <p className="mt-5 text-[11px] text-[#aaa] font-bold tracking-wider uppercase">
              COPYRIGHT©(주)트립일레븐. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>

        {/* --- 우측 하단 상담하기 플로팅 버튼 --- */}
        <div className="fixed bottom-6 right-6 z-[120] animate-in slide-in-from-bottom duration-500">
          <button className="bg-blue-600 text-white flex items-center gap-2 px-5 py-3.5 rounded-full shadow-2xl hover:bg-blue-700 active:scale-95 transition-all group">
            <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-[15px] tracking-tight">상담하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
