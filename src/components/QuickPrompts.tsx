import React, { useState } from 'react';
import { HelpCircle, Users, Briefcase, Heart, FileText, ChevronDown, Sparkles } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  onOpenHowToUse: () => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, onOpenHowToUse }) => {
  const [isOpen, setIsOpen] = useState(false);

  const prompts = [
    {
      icon: <Briefcase className="w-4 h-4 text-amber-500" />,
      tag: "معاش مبكر",
      title: "عايز اطلع معاش مبكر وسني 52 ومعايا 22 سنة خدمة ينفع؟",
      prompt: "عايز اعرف هل ينفع اطلع معاش مبكر انا سني 52 سنة ومعايا مدة خدمة فعلية 22 سنة، ومرتبي في حدود 6000 جنيه؟"
    },
    {
      icon: <Users className="w-4 h-4 text-teal-600" />,
      tag: "توزيع المعاش",
      title: "والدي توفى وماما عايشة وانا خريجة مش متجوزة واختي متجوزة",
      prompt: "والدي الله يرحمه توفى، وماما عايشة، وانا لسه مخلصة كلية ومش متجوزة، وليا اخت تانية متجوزة واخ في ثانوية عامة. المعاش هيتوزع علينا ازاي بالظبط؟"
    },
    {
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      tag: "منحة الزواج",
      title: "بنتي بتاخد معاش عن والدها وهتتجوز، إيه حقوقها والأوراق؟",
      prompt: "بنتي بتاخد معاش عن والدها المتوفى وهتتجوز الشهر الجاي، إيه حقوقها المالية ومنحة الزواج دي بتتحسب ازاي وإيه الأوراق المطلوبة لتقديمها؟"
    },
    {
      icon: <HelpCircle className="w-4 h-4 text-indigo-500" />,
      tag: "التهرب التأميني",
      title: "صاحب الشغل رافض يأمن عليا وعايز اثبت حقي",
      prompt: "انا شغال في شركة خاصة بقالي سنتين وصاحب الشغل رافض يأمن عليا ومش كاتب عقد، اعمل ايه قانونياً واشتكيه فين في التأمينات؟"
    },
    {
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      tag: "البرنت التأميني",
      title: "البرنت التأميني ده اجيبه منين ولازم اروح المكتب؟",
      prompt: "البرنت التأميني ده بيطلع منين بالظبط؟ وهل ينفع اطلعه بالرقم القومي من البيت اونلاين ولا لازم اروح مكتب التأمينات وايه المستندات؟"
    }
  ];

  return (
    <div className="py-2">
      {/* Modern Collapsible Dropdown Toggle */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-right cursor-pointer"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                أسئلة شائعة بالعامية المصرية
              </span>
              <span className="text-[11px] text-slate-500">
                {isOpen ? 'اضغط للإخفاء' : 'اضغط لاختيار استفسار وتجربته فوراً'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {prompts.length} أسئلة
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-emerald-600' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectPrompt(p.prompt);
                    setIsOpen(false);
                  }}
                  className="text-right p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all text-xs group shadow-2xs flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1 w-full">
                    <span className="font-bold text-slate-900 group-hover:text-emerald-900 flex items-center gap-1.5">
                      {p.icon}
                      <span>{p.tag}</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                      تجربة سريعة
                    </span>
                  </div>
                  <p className="text-slate-600 group-hover:text-slate-800 text-[11px] leading-relaxed font-normal">
                    {p.title}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={onOpenHowToUse}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
              >
                دليل الاستخدام الكامل وكيفية فحص المستندات 💡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
