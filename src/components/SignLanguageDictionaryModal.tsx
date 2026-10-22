import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Play, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { EGYPTIAN_SIGN_TERMS, SignTerm } from '../data/signLanguageData';

interface SignLanguageDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTermForVideo?: (term: SignTerm) => void;
}

export const SignLanguageDictionaryModal: React.FC<SignLanguageDictionaryModalProps> = ({
  isOpen,
  onClose,
  onSelectTermForVideo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTerm, setActiveTerm] = useState<SignTerm>(EGYPTIAN_SIGN_TERMS[0]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'كافة الإشارات التأمينية' },
    { id: 'pensions', label: 'المعاشات والتقاعد' },
    { id: 'documents', label: 'الاستمارات والمستندات' },
    { id: 'grants', label: 'المنح وحقوق الورثة' },
    { id: 'conditions', label: 'الإصابات والعجز' },
    { id: 'procedures', label: 'العمالة والإجراءات' },
  ];

  const filteredTerms = EGYPTIAN_SIGN_TERMS.filter((term) => {
    const matchesCat = selectedCategory === 'all' || term.category === selectedCategory;
    const matchesQuery =
      term.term.includes(searchQuery) ||
      term.summary.includes(searchQuery) ||
      term.keywords.some((k) => k.includes(searchQuery));
    return matchesCat && matchesQuery;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-5 animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="قاموس لغة الإشارة التأمينية"
    >
      <div className="w-full max-w-5xl bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  قاموس لغة الإشارة التأمينية المصرية
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                  القانون 148 لسنة 2019
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مرجع مصور لإشارات مفاهيم واستمارات التأمين الاجتماعي للصم وضعاف السمع
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أي مصطلح أو إشارة تأمينية (مثل: معاش مبكر، استمارة 6، منحة زواج، برنت تأميني)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content: Terms List + Detail View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Terms Grid (5 cols on MD) */}
          <div className="md:col-span-5 space-y-2 overflow-y-auto max-h-[55vh]">
            <p className="text-xs font-bold text-slate-400 mb-2">
              الإشارات المتاحة ({filteredTerms.length}):
            </p>
            {filteredTerms.map((term) => (
              <div
                key={term.id}
                onClick={() => setActiveTerm(term)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${
                  activeTerm.id === term.id
                    ? 'bg-emerald-950/80 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{term.visualIcon}</span>
                  <div>
                    <h5 className="font-black text-sm text-white">
                      {term.term}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {term.summary}
                    </p>
                  </div>
                </div>
                {activeTerm.id === term.id && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-ping" />
                )}
              </div>
            ))}

            {filteredTerms.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-xs">
                لم يتم العثور على مصطلح يطابق بحثك.
              </div>
            )}
          </div>

          {/* Active Term Detailed Demonstration Card (7 cols on MD) */}
          <div className="md:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              {/* Card Title */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
                    {activeTerm.visualIcon}
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-white">
                      {activeTerm.term}
                    </h4>
                    <p className="text-xs text-emerald-400 font-bold">
                      شرح وتعبير لغة الإشارة المصرية (ESL)
                    </p>
                  </div>
                </div>
                {activeTerm.officialLawRef && (
                  <span className="bg-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-full font-bold border border-slate-700">
                    {activeTerm.officialLawRef}
                  </span>
                )}
              </div>

              {/* Summary Description */}
              <div className="my-3.5 bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-600/40 text-emerald-100 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-emerald-300 block mb-1">
                  المعنى القانوني والتأميني:
                </span>
                {activeTerm.summary}
              </div>

              {/* Hand and Face Physical Instructions */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">
                    👐 الوصف الحركي لليدين والأصابع:
                  </span>
                  <p className="leading-relaxed text-slate-200">
                    {activeTerm.signDescription}
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="font-bold text-teal-400 block mb-1">
                    😊 تعبيرات الوجه وحركة الشفاه:
                  </span>
                  <p className="leading-relaxed text-slate-200">
                    {activeTerm.facialExpression}
                  </p>
                </div>

                {/* Steps List */}
                {activeTerm.steps && activeTerm.steps.length > 0 && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="font-bold text-slate-200 block mb-2">
                      تسلسل الإشارة بالترتيب:
                    </span>
                    <ul className="space-y-1.5">
                      {activeTerm.steps.map((step, sIdx) => (
                        <li key={sIdx} className="text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Launch Demonstration Action */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                يمكنك عرض الفيديو التوضيحي المباشر لهذا المصطلح
              </span>
              {onSelectTermForVideo && (
                <button
                  type="button"
                  onClick={() => onSelectTermForVideo(activeTerm)}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-md active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>عرض في استوديو الإشارة</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>دليل الإتاحة البصرية الشاملة للصم وضعاف السمع وفقاً لقانون حقوق الأشخاص ذوي الإعاقة رقم 10 لسنة 2018</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
