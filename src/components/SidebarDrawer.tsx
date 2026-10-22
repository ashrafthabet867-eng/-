import React from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  Calculator, 
  BookOpen, 
  HelpCircle, 
  Share2, 
  RotateCcw, 
  PhoneCall, 
  ExternalLink, 
  ShieldCheck, 
  ChevronLeft,
  CheckCircle2,
  FileCheck2,
  MessageSquarePlus,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ResponseMode } from '../types';
import { AdvisorLogo } from './AdvisorLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ResponseMode;
  onModeChange: (mode: ResponseMode) => void;
  onOpenCalculator: () => void;
  onOpenDocs: () => void;
  onOpenHowToUse: () => void;
  onOpenShare: () => void;
  onClearChat: () => void;
  docsCount: number;
  autoPlayVoice: boolean;
  onToggleAutoPlayVoice: () => void;
  autoSignLanguage: boolean;
  onToggleAutoSignLanguage: () => void;
  onOpenSignLanguageDictionary: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onOpenCalculator,
  onOpenDocs,
  onOpenHowToUse,
  onOpenShare,
  onClearChat,
  docsCount,
  autoPlayVoice,
  onToggleAutoPlayVoice,
  autoSignLanguage,
  onToggleAutoSignLanguage,
  onOpenSignLanguageDictionary,
}) => {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel (Sliding in from Right for RTL) */}
      <aside 
        className="relative w-full max-w-sm sm:max-w-md bg-white text-slate-800 h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slideInRight border-l border-slate-200"
        dir="rtl"
        aria-label="قائمة الخيارات والأدوات"
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md border-2 border-white/90 flex items-center justify-center p-0.5 flex-shrink-0">
              <AdvisorLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                خيارات وأدوات المستشار
              </h2>
              <p className="text-[11px] text-emerald-300">
                الهيئة القومية للتأمين الاجتماعي
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
            title="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          {/* Section 1: Response Mode (نوع الرد) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                <span>نوع الرد المطلوب</span>
                <span className="text-[10px] font-normal text-slate-500">(اختر طريقة الشرح)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* Brief mode button */}
              <button
                type="button"
                onClick={() => onModeChange('brief')}
                className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                  mode === 'brief'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                  mode === 'brief' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">رد مختصر وسريع</span>
                    {mode === 'brief' && (
                      <span className="text-emerald-700 flex items-center gap-1 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>المحدد حالياً</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    خلاصة سريعة ومباشرة بالعامية أو الفصحى، لتوفير الوقت ومعرفة الخلاصة فوراً.
                  </p>
                </div>
              </button>

              {/* Detailed mode button */}
              <button
                type="button"
                onClick={() => onModeChange('detailed')}
                className={`p-3 rounded-xl border text-right transition-all flex items-start gap-3 ${
                  mode === 'detailed'
                    ? 'border-teal-600 bg-teal-50/80 text-teal-950 shadow-xs ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 text-slate-700'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
                  mode === 'detailed' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">رد مفصل وقانوني</span>
                    {mode === 'detailed' && (
                      <span className="text-teal-700 flex items-center gap-1 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>المحدد حالياً</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    شرح مستفيض بمواد القانون والشروط والأوراق المطلوبة خطوة بخطوة.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section: Voice Autoplay (نطق المحادثة التلقائي) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                <span>الصوت والنطق</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleAutoPlayVoice}
              className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
                autoPlayVoice
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                  : 'border-slate-200 bg-slate-50/80 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 ${
                  autoPlayVoice ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {autoPlayVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">نطق الرد صوتياً تلقائياً</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      autoPlayVoice ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {autoPlayVoice ? 'مفعّل' : 'معطّل'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    تشغيل الإجابة صوتياً بالعامية بمجرد انتهاء المستشار من كتابتها
                  </p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                autoPlayVoice ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}>
                <div className="w-5 h-5 rounded-full bg-white shadow-xs"></div>
              </div>
            </button>
          </div>

          {/* Section: Sign Language Accessibility (إتاحة لغة الإشارة للصم وضعاف السمع) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5 text-slate-700">
                <span>الإتاحة ولغة الإشارة للصم والبكم</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">جديد</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleAutoSignLanguage}
              className={`w-full p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 ${
                autoSignLanguage
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-slate-50/80 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg flex-shrink-0 text-lg ${
                  autoSignLanguage ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  🤟
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">تشغيل فيديو لغة الإشارة تلقائياً</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      autoSignLanguage ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {autoSignLanguage ? 'مفعّل دائماً' : 'عند الطلب'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    فتح شاشة المترجم الإشاري المرئي تلقائياً مع كل استفسار لشرح الوصف بصرياً
                  </p>
                </div>
              </div>
              <div className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                autoSignLanguage ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}>
                <div className="w-5 h-5 rounded-full bg-white shadow-xs"></div>
              </div>
            </button>
          </div>

          {/* PWA Install Button (Prompt to install as App on Mobile/PC) */}
          <div className="pt-1">
            <PWAInstallButton variant="sidebar" />
          </div>

          <hr className="border-slate-200" />

          {/* Section 2: Interactive Tools (الأدوات الذكية) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-750 uppercase tracking-wider block text-slate-700">
              الأدوات والخدمات التأمينية
            </span>

            <div className="space-y-1.5">
              {/* Calculator */}
              <button
                type="button"
                onClick={() => handleAction(onOpenCalculator)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 transition-all text-right group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block group-hover:text-amber-900">
                      حاسبة المعاش والتقاعد التقديري
                    </span>
                    <span className="text-[11px] text-slate-500">
                      سن المعاش، المعاش المبكر، وحساب القيمة
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </button>

              {/* Legal Documents */}
              <button
                type="button"
                onClick={() => handleAction(onOpenDocs)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all text-right group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-emerald-950">
                        مستندات القانون 148 ولائحته 2437 ورفع الـ PDF
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {docsCount}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      اللائحة 2437 والجداول (1، 2، 5، 7) ورفع ملفات الـ PDF
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </button>

              {/* Sign Language Dictionary */}
              <button
                type="button"
                onClick={() => handleAction(onOpenSignLanguageDictionary)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all text-right group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-lg shadow-xs">
                    🤟
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 block group-hover:text-emerald-950">
                        قاموس لغة الإشارة التأمينية المصرية
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        مصوّر
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600">
                      شرح حركي وبصري لاستمارات ومصطلحات المعاشات للصم
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-emerald-800 transition-colors" />
              </button>

              {/* How to use */}
              <button
                type="button"
                onClick={() => handleAction(onOpenHowToUse)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/40 transition-all text-right group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block group-hover:text-teal-950">
                      ازاي استخدم المستشار؟ (دليل سريع)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      شرح الأوامر الصوتية وفحص المستندات
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={() => handleAction(onOpenShare)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 transition-all text-right group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block group-hover:text-blue-900">
                      مشاركة التطبيق وكود QR
                    </span>
                    <span className="text-[11px] text-slate-500">
                      رابط عام للمواطنين أو للتعليق في المكاتب
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 3: Conversation Management */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-750 uppercase tracking-wider block text-slate-700">
              إدارة المحادثة
            </span>

            <button
              type="button"
              onClick={() => handleAction(onClearChat)}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-800 transition-colors text-right shadow-2xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-rose-900 block">
                    بدء استشارة جديدة (مسح السجل)
                  </span>
                  <span className="text-[10px] text-rose-600">
                    إعادة ضبط شاشة المحادثة للبدء من جديد
                  </span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-rose-400 group-hover:text-rose-700 transition-colors" />
            </button>
          </div>

          <hr className="border-slate-200" />

          {/* Section 4: Official Hotline & Support */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              القنوات الرسمية للهيئة القومية للتأمين الاجتماعي
            </span>

            <a
              href="tel:16217"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>الخط الساخن المباشر:</span>
                <span className="font-mono text-sm tracking-wide bg-emerald-900/60 px-2 py-0.5 rounded-md">16217</span>
              </div>
              <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full font-normal">اتصال الآن</span>
            </a>

            <div className="flex flex-col gap-1.5 text-[11px] text-slate-600 pt-1">
              <a 
                href="https://www.nosi.gov.eg" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between hover:text-emerald-700 transition-colors py-1 px-1 rounded-md hover:bg-white"
              >
                <span>الموقع الرسمي: nosi.gov.eg</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a 
                href="https://digital.gov.eg" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between hover:text-emerald-700 transition-colors py-1 px-1 rounded-md hover:bg-white"
              >
                <span>بوابة مصر الرقمية (الخدمات التأمينية)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
          <span>قانون التأمينات والمعاشات رقم 148 لسنة 2019 ولائحته التنفيذية رقم 2437 لسنة 2021 والجداول الرسمية</span>
        </div>
      </aside>
    </div>
  );
};
