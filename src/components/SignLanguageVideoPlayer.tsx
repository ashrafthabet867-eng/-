import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  X, 
  BookOpen
} from 'lucide-react';
import { VisualSignSequenceItem, generateSignSequenceFromText } from '../data/signLanguageData';

interface SignLanguageVideoPlayerProps {
  content: string; // The assistant response being translated
  isOpen: boolean;
  onClose: () => void;
  onOpenDictionary?: () => void;
  mode?: 'modal' | 'pip';
  onTogglePipMode?: () => void;
}

export const SignLanguageVideoPlayer: React.FC<SignLanguageVideoPlayerProps> = ({
  content,
  isOpen,
  onClose,
  onOpenDictionary,
  mode = 'modal',
  onTogglePipMode,
}) => {
  const [sequence, setSequence] = useState<VisualSignSequenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Generate sequence when content changes
  useEffect(() => {
    if (content) {
      const seq = generateSignSequenceFromText(content);
      setSequence(seq);
      setCurrentIndex(0);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [content]);

  // Reliable escape key listener to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentItem = sequence[currentIndex] || sequence[0];

  // Playback timer & progress ticker for current clip
  useEffect(() => {
    if (!isPlaying || sequence.length === 0) return;

    const duration = (currentItem?.durationSeconds || 5) * 1000;
    const intervalMs = 100;
    let elapsed = 0;

    const ticker = setInterval(() => {
      elapsed += intervalMs;
      setProgress(Math.min(100, Math.round((elapsed / duration) * 100)));

      if (elapsed >= duration) {
        clearInterval(ticker);
        setProgress(0);
        setCurrentIndex((prev) => {
          if (prev < sequence.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }
    }, intervalMs);

    return () => clearInterval(ticker);
  }, [isPlaying, currentIndex, sequence, currentItem]);

  if (!isOpen || sequence.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex((p) => p + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setProgress(0);
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const currentDiagram = currentItem?.diagramImage || '/assets/sign_early_retire.jpg';

  // PiP (Picture-in-Picture) Mini-Player Floating Window
  if (mode === 'pip') {
    return (
      <div 
        className="fixed bottom-20 left-4 z-40 w-76 sm:w-84 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-slideUp"
        dir="rtl"
        aria-label="مشغل لغة الإشارة المصغر"
      >
        {/* Header */}
        <div className="bg-slate-950 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="truncate">{currentItem.clipTitle}</span>
          </div>
          <div className="flex items-center gap-1">
            {onTogglePipMode && (
              <button
                type="button"
                onClick={onTogglePipMode}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="تكبير"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-rose-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Visual in PiP with Dynamic Clip Zooming */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <img
            key={currentDiagram + currentIndex}
            src={currentDiagram}
            alt={currentItem.title}
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              objectPosition: currentItem.imagePosition || 'center',
              transform: `scale(${currentItem.imageScale || 1.3})`,
            }}
          />

          {/* Arabic Step Tag */}
          <div className="absolute top-2 right-2 bg-slate-950/90 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40">
            المقطع {currentItem.stepNumber} من {currentItem.totalSteps}
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </div>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div 
              className="h-full bg-emerald-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Subtitle in PiP */}
        <div className="p-2.5 bg-slate-950 text-xs">
          <p className="font-extrabold text-amber-300 leading-snug line-clamp-2">
            👈 {currentItem.motionInstruction}
          </p>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
            <span>مقطع {currentIndex + 1} من {sequence.length}</span>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="px-2 py-0.5 rounded bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                السابق
              </button>
              <button 
                type="button"
                onClick={handleNext} 
                disabled={currentIndex === sequence.length - 1}
                className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold disabled:opacity-30 cursor-pointer"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Clean Modal View
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="شرح لغة الإشارة المصرية"
      onClick={(e) => {
        // Close on clicking backdrop outside dialog
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header Bar - Always Accessible */}
        <div className="sticky top-0 z-30 bg-slate-950 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
              🤟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white">
                  شرح لغة الإشارة: {currentItem.badgeText}
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                  مقطع مبسط
                </span>
              </div>
              <p className="text-xs text-slate-400">
                الهيئة القومية للتأمين الاجتماعي • إيضاحات حركية باللغة العربية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onOpenDictionary && (
              <button
                type="button"
                onClick={onOpenDictionary}
                className="hidden sm:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
                title="فتح القاموس الإشاري"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>القاموس الإشاري</span>
              </button>
            )}

            {onTogglePipMode && (
              <button
                type="button"
                onClick={onTogglePipMode}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                title="تصغير كنافذة جانبية"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            )}

            {/* Clear, Prominent Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-200 rounded-xl transition cursor-pointer shadow-md"
              title="إغلاق الشاشة"
              aria-label="إغلاق الشاشة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clip Segment Pills Selector */}
        <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold whitespace-nowrap ml-1">
            مقاطع الشرح ({sequence.length}):
          </span>
          {sequence.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
                setIsPlaying(true);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                idx === currentIndex
                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>المقطع {idx + 1}</span>
              {idx === currentIndex && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5">
          
          {/* Dynamic Gesture Video Screen */}
          <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border-2 border-emerald-500/60 flex items-center justify-center group">
            
            {/* Dynamic Gesture Image that changes with every clip */}
            <img
              key={currentDiagram + currentIndex}
              src={currentDiagram}
              alt={currentItem.title}
              className="w-full h-full object-cover transition-all duration-500 filter contrast-105"
              style={{
                objectPosition: currentItem.imagePosition || 'center',
                transform: `scale(${currentItem.imageScale || 1.3})`,
              }}
            />

            {/* Pure Arabic Top Cover Banner - Hides any top English text baked in image */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-950 via-slate-950/85 to-transparent pt-3 pb-6 px-4 z-20 flex items-center justify-between">
              <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>عرض إشاري حي</span>
              </span>
              <span className="bg-slate-900/95 backdrop-blur-md text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/40">
                المقطع {currentItem.stepNumber} من {currentItem.totalSteps}: {currentItem.title}
              </span>
            </div>

            {/* In-Frame Pure Arabic Hand Guidance Banner at Bottom of Screen */}
            <div className="absolute bottom-2 inset-x-3 z-20 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/50 text-white text-xs text-right">
              <div className="flex items-center justify-between gap-2">
                <span className="font-black text-emerald-300">
                  👉 {currentItem.rightHandGuide}
                </span>
                <span className="font-black text-teal-300">
                  👈 {currentItem.leftHandGuide}
                </span>
              </div>
            </div>

            {/* Play/Pause Center Overlay on hover */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>

            {/* Step Progress Line */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800 z-30">
              <div 
                className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Pure Arabic Step Explanation Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-right">
            
            {/* Title & Step Number */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentItem.visualIcon}</span>
                <h4 className="font-black text-sm sm:text-base text-emerald-300">
                  {currentItem.clipTitle}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-bold bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                مقطع {currentIndex + 1} من {sequence.length}
              </span>
            </div>

            {/* 1. Simplified Direct Step Instruction */}
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/40 text-emerald-100">
              <span className="font-black text-xs text-emerald-400 block mb-1">
                👈 توجيه الخطوة الحالية:
              </span>
              <p className="font-extrabold text-sm sm:text-base leading-relaxed text-white">
                {currentItem.motionInstruction}
              </p>
            </div>

            {/* 2. Hand Position Details in Pure Arabic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">
                  👉 وضع اليد اليمنى:
                </span>
                <p className="text-slate-300 font-medium">
                  {currentItem.rightHandGuide}
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 block mb-0.5">
                  👈 وضع اليد اليسرى:
                </span>
                <p className="text-slate-300 font-medium">
                  {currentItem.leftHandGuide}
                </p>
              </div>
            </div>

            {/* 3. Legal & Social Meaning */}
            <div className="pt-2 border-t border-slate-850 text-xs flex items-start gap-2">
              <span className="font-bold text-amber-400 flex-shrink-0">💡 المعنى التأميني:</span>
              <p className="text-amber-200 font-bold leading-relaxed">
                {currentItem.keyNotice}
              </p>
            </div>
          </div>

          {/* Simple Clean Playback Controls Bar */}
          <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
            
            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              {sequence.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-emerald-400 ring-4 ring-emerald-500/30 scale-110'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`المقطع ${idx + 1}`}
                />
              ))}
              <span className="text-xs text-slate-400 mr-2 font-semibold">
                المقطع {currentIndex + 1} من {sequence.length}
              </span>
            </div>

            {/* Media Navigation Buttons in Arabic */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                title="المقطع السابق"
              >
                <ChevronRight className="w-4 h-4" />
                <span>المقطع السابق</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === sequence.length - 1}
                className="flex items-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-30 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                title="المقطع التالي"
              >
                <span>المقطع التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                title="إعادة تشغيل المقطع"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Guaranteed Close Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{currentItem.legalArticle || 'الهيئة القومية للتأمين الاجتماعي • القانون ١٤٨'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-rose-700 text-white font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>إغلاق الشاشة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
