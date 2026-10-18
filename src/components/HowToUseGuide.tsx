import React from 'react';
import { X, HelpCircle, MessageSquareText, Sliders, Image, Volume2, Calculator, BookOpen, ShieldCheck, Check } from 'lucide-react';

interface HowToUseGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseGuide: React.FC<HowToUseGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <MessageSquareText className="w-5 h-5 text-emerald-600" />,
      title: "1. اكتب سؤالك بالعامية المصرية أو الفصحى",
      desc: "البوت مدرب على فهم كل المفردات والمصطلحات الدارجة في التأمينات (معاش مبكر، برنت تأميني، منحة جواز، س6، صاحب الشغل مش مأمن عليا). يمكنك أيضاً الضغط على زر الميكروفون للتحدث بصوتك مباشرة."
    },
    {
      icon: <Sliders className="w-5 h-5 text-teal-600" />,
      title: "2. اختر نوع الرد الذي يناسبك (مختصر أو مفصل)",
      desc: "يمكنك التبديل في أي وقت من الشريط العلوي أو أعلى مربع الكتابة بين: 'رد مختصر' (نقاط سريعة وخلاصة حاسمة توفر وقتك) أو 'رد مفصل' (شرح قانوني مستفيض، أرقام المواد، الشروط الكاملة، والأوراق الرسمية المطلوبة)."
    },
    {
      icon: <Image className="w-5 h-5 text-indigo-600" />,
      title: "3. ارفع صورة مستند أو ورقة تأمينية للتعرف عليها",
      desc: "اضغط على زر الدبوس 📎 وارفع صورة بطاقة رقم قومي، برنت تأميني، استمارة 6، شهادة وفاة، أو قسيمة زواج. سيقوم البوت باستخراج البيانات منها وفحص مدى استيفائها لشروط القانون 148 لسنة 2019."
    },
    {
      icon: <Volume2 className="w-5 h-5 text-amber-600" />,
      title: "4. التحديث اللحظي والاستماع الصوتي",
      desc: "أثناء كتابة البوت للرد، ستشاهد الكلمات تتحدث وتتدفق لحظياً أمامك. وبعد اكتمال الرد، يمكنك الضغط على زر 'استماع صوتي' 🔊 لسماع الفتوى التأمينية بصوت عربي واضح."
    },
    {
      icon: <Calculator className="w-5 h-5 text-rose-600" />,
      title: "5. استخدام حاسبة المعاش التقديري",
      desc: "اضغط على زر 'حاسبة المعاش التقديري' بالأعلى لإدخال مدة خدمتك وأجر اشتراكك، وستحسب لك المعاش المتوقع، وتفحص موقفك من شروط المعاش المبكر لعام 2025، وتحدد قيمة منحة الزواج ونفقات الجنازة."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      title: "6. استعراض أو إضافة مستندات قانونية جديدة",
      desc: "يمكنك استعراض نصوص مواد القانون رقم 148 لسنة 2019 التي يعتمد عليها البوت حصرياً، كما يمكنك إضافة أي كتب دورية أو قرارات وزارية جديدة ليدمجها البوت فوراً في إجاباته."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">دليل استخدام المستشار التأميني</h2>
              <p className="text-xs text-slate-400">
                كيفية الاستفادة القصوى من كافة ميزات المساعد الذكي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>
              تم تصميم هذا المساعد لخدمة كافة المواطنين وأصحاب المعاشات والمستحقين والعاملين بجمهورية مصر العربية بسهولة وسرعة ودقة قانونية تامة.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {st.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{st.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            لأي استفسار طارئ يمكنك الاتصال بالخط الساخن: <strong>16217</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            فهمت، ابدأ الاستخدام الآن
          </button>
        </div>
      </div>
    </div>
  );
};
