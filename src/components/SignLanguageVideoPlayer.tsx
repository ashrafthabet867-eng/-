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
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sparkles
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
  const [motionPulse, setMotionPulse] = useState(0);

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

  // Visual motion heartbeat pulse for hand guide
  useEffect(() => {
    if (!isPlaying) return;
    const pulseInterval = setInterval(() => {
      setMotionPulse((p) => (p + 1) % 4);
    }, 600);
    return () => clearInterval(pulseInterval);
  }, [isPlaying]);

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

  // Helper to render gesture motion directional arrows in pure Arabic
  const renderGestureMotionCue = (type: string) => {
    switch (type) {
      case 'cross_chest':
        return (
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold animate-pulse">
              <span>اليد اليمنى</span>
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>إلى الصدر الأيسر</span>
            </div>
            <span className="text-emerald-400 font-black text-lg">✕</span>
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-400 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold animate-pulse">
              <span>إلى الصدر الأيمن</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>اليد اليسرى</span>
            </div>
          </div>
        );
      case 'push_forward':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-400 px-4 py-1.5 rounded-xl text-emerald-300 text-xs font-bold animate-bounce">
              <ArrowUp className="w-4 h-4 text-emerald-400 rotate-45" />
              <span>دفع الكفين للأمام في خط مستقيم (إنهاء وتوقف)</span>
              <ArrowUp className="w-4 h-4 text-emerald-400 -rotate-45" />
            </div>
          </div>
        );
      case 'count_years':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-amber-950/80 border border-amber-400 px-4 py-1.5 rounded-xl text-amber-300 text-xs font-extrabold flex items-center gap-2">
              <span className="text-base">٢٥</span>
              <span>سنة كاملة (٣٠٠ شهر اشتراك فعلي)</span>
              <span>⏱️</span>
            </div>
          </div>
        );
      case 'draw_rect':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="border-2 border-dashed border-emerald-400 px-5 py-2 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-pulse bg-emerald-950/60">
              <span>📄</span>
              <span>رسم مستطيل الاستمارة بالسبابتين في الهواء</span>
            </div>
          </div>
        );
      case 'ring_finger':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-amber-950/80 border border-amber-400 px-4 py-1.5 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2">
              <span>💍</span>
              <span>لمس موضع خاتم الزواج (الدبلة) في إصبع البنصر</span>
            </div>
          </div>
        );
      case 'stamp_eagle':
      case 'seal_stamp':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-rose-950/80 border border-rose-400 px-4 py-1.5 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse">
              <span>🦅</span>
              <span>ضرب باطن الكف بالقبضة (ختم النسر المعتمد)</span>
            </div>
          </div>
        );
      case 'comfort_heart':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-teal-950/80 border border-teal-400 px-4 py-1.5 rounded-xl text-teal-300 text-xs font-bold flex items-center gap-2">
              <span>🤍</span>
              <span>لمس الصدر برفق وخفض الرأس مواساة ورحمة</span>
            </div>
          </div>
        );
      case 'chin_touch':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-emerald-950/80 border border-emerald-400 px-4 py-1.5 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span>🧓</span>
              <span>لمس الذقن بالسبابة بحركة دائرية (السن والوقار)</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="bg-slate-900/80 border border-emerald-500/50 px-4 py-1 rounded-xl text-emerald-300 text-xs font-bold">
              <span>حركة إشارية معتمدة وفقاً للقانون ١٤٨</span>
            </div>
          </div>
        );
    }
  };

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

        {/* Video Visual Stage in PiP */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          <img
            src="/assets/sign_video_stage.jpg"
            alt="استوديو لغة الإشارة"
            className="w-full h-full object-cover opacity-80"
          />

          <div 
            className="absolute bottom-0 right-1/2 translate-x-1/2 w-48 h-full flex items-end justify-center pointer-events-none transition-transform duration-500"
            style={{
              transform: `translateX(50%) scale(${1 + (motionPulse % 2) * 0.02})`,
            }}
          >
            <img
              src="/assets/sign_language_interpreter.jpg"
              alt="مترجمة لغة الإشارة"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>

          {/* Pure Arabic Badge */}
          <div className="absolute top-2 right-2 bg-emerald-950/90 text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40">
            المقطع {currentItem.stepNumber} من {currentItem.totalSteps}
          </div>

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

        {/* Subtitle in PiP */}
        <div className="p-2.5 bg-slate-950 text-xs">
          <p className="font-extrabold text-amber-300 leading-snug line-clamp-2">
            👈 {currentItem.motionInstruction}
          </p>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
            <span>مقطع {currentIndex + 1} من {sequence.length}</span>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="شرح لغة الإشارة المصرية"
    >
      <div className="w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
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
                الهيئة القومية للتأمين الاجتماعي • شرح حركي عربي مبسط وفقاً للقانون ١٤٨
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

        {/* Central Dedicated Video Stage */}
        <div className="p-4 sm:p-5 flex flex-col space-y-3.5">
          
          {/* Visual Screen with Official Interpreter & Arabic Motion Cues */}
          <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-emerald-500/60 flex items-center justify-center group">
            
            {/* TV Broadcast Studio Stage Background */}
            <img
              src="/assets/sign_video_stage.jpg"
              alt="استوديو لغة الإشارة الرسمي"
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />

            {/* Official Interpreter Presenter with subtle motion */}
            <div 
              className="relative z-10 w-64 sm:w-72 md:w-80 h-full flex items-end justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `scale(${1 + (motionPulse % 2) * 0.02}) translateY(${motionPulse % 2 === 0 ? '-3px' : '0px'})`,
              }}
            >
              <img
                src="/assets/sign_language_interpreter.jpg"
                alt="المترجمة المعتمدة"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
            </div>

            {/* Top Right Live Badge in Arabic */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>بث إشاري حي</span>
              </span>
              <span className="bg-slate-900/90 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40">
                المقطع {currentItem.stepNumber} من {currentItem.totalSteps}
              </span>
            </div>

            {/* Top Left Title Badge */}
            <div className="absolute top-3 left-3 z-20 bg-slate-900/90 text-slate-200 text-xs px-3 py-1 rounded-full font-bold border border-slate-700">
              {currentItem.badgeText}
            </div>

            {/* In-Frame Motion Guidance Overlay in Pure Arabic */}
            <div className="absolute inset-x-3 bottom-14 z-20 pointer-events-none">
              {renderGestureMotionCue(currentItem.gestureType)}
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

          {/* Pure Arabic Step Explanation Card (Very Simplified) */}
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
                  👉 اليد اليمنى:
                </span>
                <p className="text-slate-300 font-medium">
                  {currentItem.rightHandGuide}
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 block mb-0.5">
                  👈 اليد اليسرى:
                </span>
                <p className="text-slate-300 font-medium">
                  {currentItem.leftHandGuide}
                </p>
              </div>
            </div>

            {/* 3. Legal & Social Meaning */}
            <div className="pt-2 border-t border-slate-850 text-xs flex items-start gap-2">
              <span className="font-bold text-amber-400 flex-shrink-0">💡 المعنى:</span>
              <p className="text-amber-200 font-bold leading-relaxed">
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

        {/* Simple Arabic Footer */}
        <div className="bg-slate-950 px-5 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{currentItem.legalArticle || 'الهيئة القومية للتأمين الاجتماعي • القانون ١٤٨'}</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white font-bold cursor-pointer"
          >
            إغلاق المترجم
          </button>
        </div>
      </div>
    </div>
  );
};
