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
  ShieldCheck, 
  Layers,
  CheckCircle2,
  Tv,
  Image as ImageIcon
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
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [handAnimationPhase, setHandAnimationPhase] = useState(0);
  const [viewMode, setViewMode] = useState<'diagram' | 'studio'>('diagram');
  const [stepProgress, setStepProgress] = useState(0);

  // Generate sequence when content changes
  useEffect(() => {
    if (content) {
      const seq = generateSignSequenceFromText(content);
      setSequence(seq);
      setCurrentIndex(0);
      setIsPlaying(true);
      setStepProgress(0);
      // If sequence has a specific gesture diagram (not intro), prefer diagram view
      if (seq.length > 1 && seq[1]?.diagramImage && !seq[1]?.diagramImage.includes('interpreter')) {
        setViewMode('diagram');
      }
    }
  }, [content]);

  const currentItem = sequence[currentIndex] || sequence[0];

  // Playback timer & progress ticker
  useEffect(() => {
    if (!isPlaying || sequence.length === 0) return;

    const baseDuration = (currentItem?.durationSeconds || 5) * 1000;
    const adjustedDuration = baseDuration / playbackSpeed;
    const intervalTime = 100;
    let elapsed = 0;

    const ticker = setInterval(() => {
      elapsed += intervalTime;
      setStepProgress(Math.min(100, Math.round((elapsed / adjustedDuration) * 100)));

      if (elapsed >= adjustedDuration) {
        clearInterval(ticker);
        setStepProgress(0);
        setCurrentIndex((prev) => {
          if (prev < sequence.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }
    }, intervalTime);

    return () => clearInterval(ticker);
  }, [isPlaying, currentIndex, sequence, playbackSpeed, currentItem]);

  // Subtle hand animation ticker for the visual avatar
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setHandAnimationPhase((p) => (p + 1) % 4);
    }, 600 / playbackSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!isOpen || sequence.length === 0) return null;

  const handleNext = () => {
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex((p) => p + 1);
      setStepProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
      setStepProgress(0);
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setStepProgress(0);
    setIsPlaying(true);
  };

  const currentDiagram = currentItem.diagramImage || '/assets/sign_early_retire.jpg';

  // PiP (Picture-in-Picture) Mini-Player Floating Window
  if (mode === 'pip') {
    return (
      <div 
        className="fixed bottom-20 left-4 z-40 w-80 sm:w-88 bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-slideUp"
        dir="rtl"
        aria-label="مشغل فيديو لغة الإشارة المصغر"
      >
        {/* PiP Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 px-3 py-2 flex items-center justify-between border-b border-emerald-800/40 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="truncate">مترجم الإشارة: {currentItem.badgeText}</span>
          </div>
          <div className="flex items-center gap-1">
            {onTogglePipMode && (
              <button
                onClick={onTogglePipMode}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer"
                title="تكبير لنافذة كاملة"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="إغلاق"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Stage Simulation in PiP with Active Dynamic Gesture Diagram */}
        <div className="relative aspect-video bg-black overflow-hidden group">
          {/* Dynamic Diagram for this specific step */}
          <img
            src={currentDiagram}
            alt={currentItem.title}
            className="w-full h-full object-cover transition-opacity duration-300"
          />

          {/* Broadcast live overlay */}
          <div className="absolute top-2 right-2 bg-rose-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>بث إشاري مباشر</span>
          </div>

          {/* Inset mini interpreter avatar */}
          <div 
            className="absolute bottom-2 left-2 w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-400 bg-slate-950/80 shadow-lg pointer-events-none transition-transform duration-300"
            style={{
              transform: `scale(${1 + (handAnimationPhase % 2) * 0.04})`,
            }}
          >
            <img
              src="/assets/sign_language_interpreter.jpg"
              alt="المترجمة"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gesture Step Indicator */}
          <div className="absolute top-2 left-2 bg-slate-900/85 backdrop-blur-xs text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
            <span>{currentItem.visualIcon}</span> {currentItem.badgeText}
          </div>

          {/* Play/Pause overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            <div className="w-10 h-10 rounded-full bg-slate-900/90 flex items-center justify-center text-white shadow-lg">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </div>
          </button>

          {/* Progress bar line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
            <div 
              className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Active Caption for Deaf Citizens */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-xs">
          <p className="font-bold text-amber-300 leading-snug line-clamp-2">
            {currentItem.keyNotice}
          </p>
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-850 text-[11px] text-slate-400">
            <span className="truncate">خطوة {currentIndex + 1} من {sequence.length}</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-750 disabled:opacity-30 cursor-pointer"
              >
                السابق
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentIndex === sequence.length - 1}
                className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold disabled:opacity-30 cursor-pointer"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Expanded Modal View
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-2 sm:p-4 animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="شرح لغة الإشارة المصرية"
    >
      <div className="w-full max-w-5xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[94vh] animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
              🤟
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-base text-white">
                  المترجم المرئي الذكي للغة الإشارة المصرية (ESL)
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                  شرح حركي تفاعلي للصم وضعاف السمع
                </span>
              </div>
              <p className="text-xs text-slate-400">
                الهيئة القومية للتأمين الاجتماعي • ترجمة بصرية متغيرة ومتحركة وفقاً للقانون 148 لسنة 2019
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onOpenDictionary && (
              <button
                type="button"
                onClick={onOpenDictionary}
                className="hidden sm:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
                title="فتح القاموس الإشاري التأميني الكامل"
              >
                <BookOpen className="w-4 h-4" />
                <span>القاموس الإشاري</span>
              </button>
            )}

            {onTogglePipMode && (
              <button
                type="button"
                onClick={onTogglePipMode}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition cursor-pointer"
                title="تصغير كنافذة طافية لمتابعة المحادثة"
              >
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">نافذة مصغرة</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-300 flex items-center justify-center transition cursor-pointer"
              title="إغلاق الشاشة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Video Stage & Interactive Sign Cards */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Active Video Player Stage Simulation (7 Cols on LG) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>شاشة العرض المرئي الحركي:</span>
              </span>
              
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-750">
                <button
                  type="button"
                  onClick={() => setViewMode('diagram')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    viewMode === 'diagram'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="عرض المخطط الحركي للأصابع واليدين الخاص بالسؤال"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>حركات الإشارة التوضيحية 👐</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('studio')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    viewMode === 'studio'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="عرض استوديو المترجمة المعتمدة"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>استوديو البث 🎥</span>
                </button>
              </div>
            </div>

            {/* Stage Screen Frame */}
            <div className="relative aspect-video sm:aspect-16/10 rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-emerald-500/60 flex items-center justify-center group">
              
              {/* VIEW MODE 1: DYNAMIC GESTURE DIAGRAM (Changes per topic and step) */}
              {viewMode === 'diagram' ? (
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  {/* Step Diagram Image */}
                  <img
                    key={currentDiagram + currentIndex}
                    src={currentDiagram}
                    alt={currentItem.title}
                    className="w-full h-full object-contain filter contrast-105 animate-fadeIn"
                  />

                  {/* Dynamic Motion Indicator Circles overlay on gesture */}
                  <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-24 h-24 rounded-full border-2 border-emerald-400/60 animate-ping opacity-60" />
                  </div>

                  {/* Inset Live Interpreter Avatar Corner Box */}
                  <div 
                    className="absolute bottom-14 left-3 w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-950 shadow-2xl z-20 transition-transform duration-500"
                    style={{
                      transform: `scale(${1 + (handAnimationPhase % 2) * 0.03}) translateY(${handAnimationPhase % 2 === 0 ? '-2px' : '0px'})`,
                    }}
                  >
                    <img
                      src="/assets/sign_language_interpreter.jpg"
                      alt="مترجمة لغة الإشارة"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-center text-emerald-300 font-bold py-0.5">
                      مترجمة معتمدة
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW MODE 2: BROADCAST STUDIO STAGE WITH INTERPRETER */
                <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/sign_video_stage.jpg"
                    alt="استوديو لغة الإشارة"
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                  />
                  
                  {/* Interpreter with subtle motion */}
                  <div 
                    className="relative z-10 w-64 sm:w-72 md:w-80 h-full flex items-end justify-center transition-transform duration-700 ease-out"
                    style={{
                      transform: `scale(${1 + (handAnimationPhase % 2) * 0.02}) translateY(${handAnimationPhase % 2 === 0 ? '-3px' : '0px'})`,
                    }}
                  >
                    <img
                      src="/assets/sign_language_interpreter.jpg"
                      alt="مترجمة لغة الإشارة"
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  </div>

                  {/* Inset gesture diagram corner box */}
                  <div className="absolute bottom-14 left-3 w-24 sm:w-28 h-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-950 shadow-2xl z-20">
                    <img
                      src={currentDiagram}
                      alt={currentItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-center text-emerald-300 font-bold py-0.5">
                      الحركة المطلوبة
                    </div>
                  </div>
                </div>
              )}

              {/* Broadcast Live Overlays */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>بث إشاري حي</span>
                </span>
                <span className="bg-slate-900/85 backdrop-blur-md text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/40">
                  {currentItem.badgeText}
                </span>
              </div>

              {/* Legal Reference Tag */}
              {currentItem.legalArticle && (
                <div className="absolute top-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md text-slate-300 text-[11px] px-2.5 py-1 rounded-full font-semibold border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentItem.legalArticle}</span>
                </div>
              )}

              {/* Hand Motion Visual Guide overlay at bottom of screen */}
              <div className="absolute bottom-2 left-2 right-2 z-20 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/40 text-white">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{currentItem.visualIcon}</span>
                    <p className="font-black text-xs sm:text-sm text-emerald-300 truncate">
                      {currentItem.title}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-md">
                    خطوة {currentIndex + 1} من {sequence.length}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-200 leading-snug line-clamp-1 font-medium">
                  {currentItem.handMovement}
                </p>
              </div>

              {/* Step Progress Line */}
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800/80 z-30">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-linear"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>

              {/* Play/Pause Center Overlay on hover */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </div>
              </button>
            </div>

            {/* Video Controls & Timeline Bar */}
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
              {/* Segmented Timeline Steps */}
              <div className="flex items-center gap-1.5 w-full">
                {sequence.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setStepProgress(0);
                      setIsPlaying(true);
                    }}
                    className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'bg-emerald-500 ring-2 ring-emerald-400/50 scale-y-125'
                        : idx < currentIndex
                        ? 'bg-emerald-800'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    title={item.title}
                  />
                ))}
              </div>

              {/* Control Buttons & Speed */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                {/* Play / Next / Prev */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReplay}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                    title="إعادة من البداية"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 mr-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-xl transition cursor-pointer"
                      title="الإشارة السابقة"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-slate-400 text-[11px] px-1 font-semibold">
                      {currentIndex + 1} / {sequence.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentIndex === sequence.length - 1}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-xl transition cursor-pointer"
                      title="الإشارة التالية"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Speed selector (0.5x, 0.75x, 1x, 1.25x) */}
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-slate-400 ml-1">سرعة الإشارة:</span>
                  {[0.5, 0.75, 1, 1.25].map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                        playbackSpeed === spd
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-850 hover:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Step Carousel with Visual Diagram Thumbnails */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                اختر خطوة الشرح لعرض حركتها فوراً ({sequence.length} خطوات مصورة):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {sequence.map((step, idx) => (
                  <button
                    key={step.id + idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setStepProgress(0);
                      setIsPlaying(true);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-right transition-all flex-shrink-0 cursor-pointer ${
                      idx === currentIndex
                        ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-500/50 shadow-md'
                        : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-slate-700">
                      <img
                        src={step.diagramImage || '/assets/sign_early_retire.jpg'}
                        alt={step.badgeText}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pr-1 max-w-[130px]">
                      <span className="text-[10px] font-bold text-emerald-400 block truncate">
                        خطوة {idx + 1}: {step.badgeText}
                      </span>
                      <span className="text-[10px] text-slate-300 block truncate">
                        {step.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Deaf Accessibility Text Cards & Steps (5 Cols on LG) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {/* Current Active Sign Card (High Contrast) */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-850 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/60 shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentItem.visualIcon}</span>
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-white">
                        {currentItem.title}
                      </h4>
                      <span className="text-[11px] text-emerald-400 font-bold">
                        تفسير حركة الإشارة المعتمدة
                      </span>
                    </div>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] px-2.5 py-1 rounded-full font-bold">
                    خطوة {currentIndex + 1} من {sequence.length}
                  </span>
                </div>

                {/* Core Statement for Deaf Citizens */}
                <div className="my-3 bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/40 text-amber-100">
                  <span className="text-[11px] text-amber-400 font-bold block mb-1">
                    💡 الخلاصة التأمينية للمواطن:
                  </span>
                  <p className="font-extrabold text-xs sm:text-sm leading-relaxed">
                    {currentItem.keyNotice}
                  </p>
                </div>

                {/* Detailed Physical Gesture Guide */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                    <span className="font-bold text-emerald-400 block mb-1">
                      👐 تفاصيل حركة اليدين والأصابع:
                    </span>
                    <p className="leading-relaxed text-slate-200">
                      {currentItem.signDescription}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                    <span className="font-bold text-teal-400 block mb-1">
                      😊 تعبيرات الوجه وحركة الشفاه:
                    </span>
                    <p className="leading-relaxed text-slate-200">
                      {currentItem.facialExpression}
                    </p>
                  </div>

                  {/* Highlight Keywords */}
                  {currentItem.highlightWords && currentItem.highlightWords.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[11px] text-slate-400 block mb-1.5 font-bold">
                        المفاهيم القانونية في هذه الإشارة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentItem.highlightWords.map((word, wIdx) => (
                          <span
                            key={wIdx}
                            className="bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[11px] font-bold"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Sign Button */}
              {currentIndex < sequence.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-3 w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-98 text-white font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-md"
                >
                  <span className="truncate">الانتقال للإشارة التالية: {sequence[currentIndex + 1]?.title}</span>
                  <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleReplay}
                  className="mt-3 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:scale-98 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة تشغيل العرض من البداية</span>
                </button>
              )}
            </div>

            {/* Quick Helper for Deaf Users */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>مصممة طبقاً لقاموس الإشارات الاجتماعية المصري المعتمد</span>
              </span>
              {onOpenDictionary && (
                <button
                  type="button"
                  onClick={onOpenDictionary}
                  className="text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  استعراض القاموس
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>نظام الإتاحة البصرية الشامل لذوي الإعاقة السمعية • الهيئة القومية للتأمين الاجتماعي</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            إغلاق المترجم
          </button>
        </div>
      </div>
    </div>
  );
};
