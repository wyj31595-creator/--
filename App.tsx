
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronRight, Heart, Home, Share2, Check, ExternalLink, MapPin, Camera, RefreshCw, Download } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { CARD_CONTENTS, CONTACT_INFO, DONATION_LINK } from './constants';

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const [userImages, setUserImages] = useState<Record<number, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsEditMode(params.get('edit') === 'true');

    const savedImages = localStorage.getItem('gongjon_custom_images');
    if (savedImages) {
      try {
        setUserImages(JSON.parse(savedImages));
      } catch (e) {
        console.error("저장된 이미지를 불러오는데 실패했습니다.");
      }
    }
  }, []);

  const nextCard = useCallback(() => {
    if (currentIndex < CARD_CONTENTS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('label') || isCapturing) return;

    const width = window.innerWidth;
    if (e.clientX > width / 2) {
      nextCard();
    } else {
      prevCard();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, cardId: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = { ...userImages, [cardId]: base64String };
        setUserImages(newImages);
        localStorage.setItem('gongjon_custom_images', JSON.stringify(newImages));
        setImgError(prev => ({ ...prev, [currentIndex]: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const captureCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    
    setIsCapturing(true);
    // 애니메이션 및 버튼들이 숨겨질 시간을 줌
    setTimeout(async () => {
      try {
        const dataUrl = await htmlToImage.toPng(cardRef.current!, {
          cacheBust: true,
          quality: 1,
          pixelRatio: 2, // 고화질 저장
        });
        const link = document.createElement('a');
        link.download = `gongjon_card_${currentIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        alert("이미지 저장에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsCapturing(false);
      }
    }, 300);
  };

  const resetImages = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("모든 사진을 기본 이미지로 되돌릴까요?")) {
      setUserImages({});
      localStorage.removeItem('gongjon_custom_images');
      window.location.reload();
    }
  };

  const copyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      await navigator.clipboard.writeText(baseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("링크가 복사되었습니다.");
    }
  };

  const currentCard = CARD_CONTENTS[currentIndex];
  const displayImage = userImages[currentCard.id] || currentCard.image;
  const bgColors = ['bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-amber-50', 'bg-rose-50'];

  return (
    <div className={`flex justify-center items-center min-h-screen bg-slate-100 p-0 sm:p-4 overflow-hidden ${isCapturing ? 'is-capturing' : ''}`}>
      <div 
        ref={cardRef}
        onClick={handleContainerClick}
        className="relative w-full max-w-[450px] h-screen sm:h-[840px] bg-white shadow-2xl overflow-hidden cursor-pointer select-none sm:rounded-[40px] flex flex-col transition-all duration-500 border border-gray-100"
      >
        
        {/* 상단 이미지 영역 */}
        <div className={`relative h-[50%] w-full overflow-hidden ${bgColors[currentIndex]}`}>
          {!imgError[currentIndex] ? (
            <>
              <img 
                key={`img-${currentIndex}-${displayImage}`}
                src={displayImage}
                alt={currentCard.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ${isCapturing ? '' : 'animate-image-zoom'}`}
                onError={() => setImgError(prev => ({...prev, [currentIndex]: true}))}
              />
              <div className="absolute inset-0 bg-black/5" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-slate-50">
               <div className="flex flex-col items-center opacity-30">
                  <Camera className="w-16 h-16 mb-4 text-slate-400" />
                  <p className="text-sm font-medium text-slate-500">
                    {isEditMode ? "사진을 등록해주세요" : "이미지 없음"}
                  </p>
               </div>
            </div>
          )}
          
          {/* 상단 레이블 */}
          <div className="absolute top-8 left-6 right-6 z-30 flex justify-between items-start">
             <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
                <span className="text-slate-800 text-[12px] font-black tracking-tighter">
                  {CONTACT_INFO.name}
                </span>
             </div>

             {isEditMode && !isCapturing && (
               <div className="flex flex-col gap-2 items-end hide-on-capture">
                 <label className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform">
                   <Camera className="w-3.5 h-3.5" />
                   사진 변경
                   <input 
                     type="file" 
                     accept="image/*" 
                     className="hidden" 
                     onChange={(e) => handleImageUpload(e, currentCard.id)} 
                   />
                 </label>
                 <button 
                   onClick={captureCard}
                   className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform"
                 >
                   <Download className="w-3.5 h-3.5" />
                   이미지로 저장
                 </button>
                 {Object.keys(userImages).length > 0 && (
                   <button 
                     onClick={resetImages}
                     className="bg-white/80 text-slate-600 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm flex items-center gap-1.5"
                   >
                     <RefreshCw className="w-3.5 h-3.5" />
                     초기화
                   </button>
                 )}
               </div>
             )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10" />
        </div>

        {/* 하단 콘텐츠 영역 */}
        <div className="relative flex-1 bg-white px-8 pt-6 pb-12 flex flex-col z-20">
          
          {/* 진행바 */}
          <div className="absolute -top-3 left-0 right-0 flex gap-2 px-8 z-30">
            {CARD_CONTENTS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-blue-600 scale-y-110 shadow-sm' : 'bg-slate-100'}`}
              />
            ))}
          </div>

          {/* 키워드 */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[12px] font-bold rounded-lg tracking-tight">
              {currentCard.keyword}
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 key={`title-${currentIndex}`} className="text-[26px] font-black leading-[1.3] mb-4 text-slate-900 whitespace-pre-line tracking-[-0.05em] animate-text-slide-up">
            {currentCard.title}
          </h1>

          {/* 서브 설명 */}
          <p key={`sub-${currentIndex}`} className="text-[16px] font-medium text-slate-600 leading-[1.65] mb-6 tracking-tight animate-text-slide-up-delayed">
            {currentCard.subtitle}
          </p>

          {currentCard.body && (
            <p className="text-[14px] text-slate-400 leading-[1.6] mb-6 whitespace-pre-line tracking-tight animate-text-slide-up-delayed">
              {currentCard.body}
            </p>
          )}

          {/* 액션 버튼 */}
          <div className="mt-auto">
            {currentCard.buttonKeyword && (
              <a 
                href={DONATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3.5 bg-yellow-400 text-slate-900 font-extrabold text-[14px] rounded-full mb-2 shadow-lg shadow-yellow-100 transition-all active:scale-95 group"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" />
                {currentCard.buttonKeyword}
                <ExternalLink className="w-3 h-3 ml-2 opacity-40" />
              </a>
            )}

            {currentCard.showLinks && (
              <div className="space-y-4 animate-text-slide-up">
                <a 
                  href={DONATION_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-full py-5 bg-rose-500 text-white font-black text-[19px] rounded-2xl shadow-xl shadow-rose-100 transition-all active:scale-95 ${isCapturing ? '' : 'animate-pulse-subtle'}`}
                >
                  <Heart className="w-6 h-6 mr-2 fill-white" />
                  {currentCard.ctaText}
                </a>
                
                <div className="grid grid-cols-2 gap-3 hide-on-capture">
                  <button 
                    onClick={copyLink}
                    className="flex items-center justify-center py-3.5 bg-white text-blue-600 text-[14px] font-bold rounded-xl border-2 border-blue-100 shadow-sm transition-all active:scale-95"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                    {copied ? "복사완료" : "공유하기"}
                  </button>
                  <a 
                    href={CONTACT_INFO.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-3.5 bg-slate-50 text-slate-700 text-[14px] font-bold rounded-xl border-2 border-slate-100 transition-all active:scale-95"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    홈페이지
                  </a>
                </div>
                
                <div className="flex flex-col items-center gap-5 mt-6 pt-6 border-t border-slate-50">
                   <a href={CONTACT_INFO.taxInfo} target="_blank" rel="noopener noreferrer" className="flex items-center text-[13px] text-slate-700 font-black border-b-2 border-slate-300 pb-0.5 tracking-tighter">
                     세제 혜택 및 후원 상세 안내 보기
                     <ChevronRight className="w-4 h-4 ml-0.5" />
                   </a>

                  <div className="text-center text-slate-400 text-[11px] leading-relaxed tracking-tighter">
                    <p className="flex items-center justify-center gap-1 font-medium"><MapPin className="w-3 h-3" /> {CONTACT_INFO.name} | {CONTACT_INFO.address}</p>
                    <p className="font-bold text-slate-500 mt-1">Tel: {CONTACT_INFO.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 힌트 및 상태바 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-30 pointer-events-none z-30 hide-on-capture">
           <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Tap to Navigate</span>
        </div>

        {isEditMode && !isCapturing && (
          <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center py-1 font-bold z-50 hide-on-capture">
            편집 및 이미지 저장 모드 활성화
          </div>
        )}

        {isCapturing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 font-bold text-sm">이미지 생성 중...</p>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes imageZoom {
          from { transform: scale(1.15); }
          to { transform: scale(1); }
        }
        @keyframes textSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSubtle {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.2); }
          50% { transform: scale(1.02); box-shadow: 0 15px 30px -5px rgba(244, 63, 94, 0.3); }
        }
        .animate-image-zoom {
          animation: imageZoom 5s cubic-bezier(0.2, 0, 0.2, 1) forwards;
        }
        .animate-text-slide-up {
          animation: textSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-text-slide-up-delayed {
          animation: textSlideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
          opacity: 0;
        }
        .animate-pulse-subtle {
          animation: pulseSubtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
