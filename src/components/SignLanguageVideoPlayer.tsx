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

  const currentItem = sequence[currentIndex] || sequence[0];

  // Playback timer & progress ticker
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
        className="fixed bottom-20 left-4 z-40 w-76 sm:w-80 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-slideUp"
        dir="rtl"
        aria-label="مشغل لغة الإشارة المصغر"
      >
        {/* Header */}
        <div className="bg-slate-950 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="truncate">{currentItem.title}</span>
          </div>
          <div className="flex items-center gap-1">
            {onTogglePipMode && (
              <button
                onClick={onTogglePipMode}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="تكبير"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Visual */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <img
            src={currentDiagram}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />

          <button
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

        {/* Subtitle */}
        <div className="p-2.5 bg-slate-950 text-xs">
          <p className="font-bold text-amber-300 line-clamp-2 leading-relaxed">
            {currentItem.keyNotice}
          </p>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
            <span>خطوة {currentIndex + 1} من {sequence.length}</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="px-2 py-0.5 rounded bg-slate-800 disabled:opacity-30 cursor-pointer"
              >
                السابق
              </button>
              <button 
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="شرح لغة الإشارة المصرية"
    >
      <div className="w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Simple Top Header Bar */}
        <div className="bg-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🤟</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white">
                شرح لغة الإشارة: {currentItem.badgeText}
              </h3>
              <p className="text-xs text-slate-400">
                حركة توضيحية معتمدة للصم وضعاف السمع وفقاً للقانون 148
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

            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 rounded-xl transition cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Central Video Stage */}
        <div className="p-4 sm:p-5 flex flex-col space-y-3.5">
          
          {/* Visual Sign Display */}
          <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-black shadow-xl border-2 border-emerald-500/50 flex items-center justify-center group">
            <img
              src={currentDiagram}
              alt={currentItem.title}
              className="w-full h-full object-contain filter contrast-105"
            />

            {/* Live Indicator */}
            <div className="absolute top-3 right-3 bg-rose-600/90 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>عرض إشاري حي</span>
            </div>

            {/* Step Tag */}
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-xs text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
              خطوة {currentIndex + 1} من {sequence.length}
            </div>

            {/* Play/Pause Center Overlay on hover */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </div>
            </button>

            {/* Step Progress Line */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
              <div 
                className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Simple, Clear Subtitle & Motion Instruction Box */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-right">
            {/* Gesture description */}
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <span className="font-bold text-emerald-400 flex-shrink-0">👐 حركة اليد:</span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {currentItem.handMovement}
              </p>
            </div>

            {/* Legal meaning */}
            <div className="flex items-start gap-2 text-xs sm:text-sm pt-2 border-t border-slate-850">
              <span className="font-bold text-amber-400 flex-shrink-0">💡 المعنى:</span>
              <p className="text-amber-200 leading-relaxed font-bold">
                {currentItem.keyNotice}
              </p>
            </div>
          </div>

          {/* Simple Clean Playback Controls Bar */}
          <div className="flex items-center justify-between pt-1">
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
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'bg-emerald-400 ring-4 ring-emerald-500/30 scale-110'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`خطوة ${idx + 1}`}
                />
              ))}
              <span className="text-xs text-slate-400 mr-2 font-semibold">
                خطوة {currentIndex + 1} من {sequence.length}
              </span>
            </div>

            {/* Media Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl transition cursor-pointer"
                title="السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                <span className="text-xs">{isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === sequence.length - 1}
                className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl transition cursor-pointer"
                title="التالي"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                title="إعادة التشغيل"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{currentItem.legalArticle || 'الهيئة القومية للتأمين الاجتماعي'}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
