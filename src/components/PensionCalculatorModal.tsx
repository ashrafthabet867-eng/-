import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, Coins, HeartHandshake, UserCheck } from 'lucide-react';
import { PensionCalculationResult } from '../types';

interface PensionCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendResultToChat: (summary: string) => void;
}

export const PensionCalculatorModal: React.FC<PensionCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSendResultToChat,
}) => {
  const [wage, setWage] = useState<string>('6000');
  const [years, setYears] = useState<string>('25');
  const [months, setMonths] = useState<string>('0');
  const [age, setAge] = useState<string>('55');
  const [reason, setReason] = useState<string>('early');
  const [result, setResult] = useState<PensionCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/calculate-pension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          averageWage: Number(wage),
          serviceYears: Number(years),
          serviceMonths: Number(months),
          age: Number(age),
          reason,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToChat = () => {
    if (!result) return;
    const summary = `يا فندم قمت بحساب المعاش التقديري ببيانات: أجر التسوية ${result.wage} ج.م، مدة الخدمة ${result.yearsFloat} سنة، السن ${age} سنة، نوع المعاش: ${
      reason === 'early' ? 'معاش مبكر' : reason === 'age' ? 'بلوغ سن التقاعد' : 'عجز/وفاة'
    }. النتيجة المقدرة للمعاش الشهري: ${result.finalPension} ج.م. وموقف المعاش المبكر: ${
      result.earlyRetirement?.eligible ? 'مستوفٍ للشروط' : 'غير مستوفٍ'
    }. ممكن تشرحلي التفاصيل والأوراق المطلوبة بالتحديد؟`;

    onSendResultToChat(summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">حاسبة المعاش التقديري وفاحص المعاش المبكر</h2>
              <p className="text-xs text-slate-400">
                طبقاً لمعادلات القانون رقم 148 لسنة 2019 وضوابط يناير 2025
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                متوسط أجر الاشتراك التأميني (أجر التسوية) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="2000"
                  max="100000"
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full px-3 py-2 pl-12 border border-slate-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">ج.م/شهرياً</span>
              </div>
              <span className="text-[10px] text-slate-500">متوسط الأجر المسجل بالبرنت التأميني</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سبب استحقاق المعاش *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden bg-white"
              >
                <option value="early">طلب الخروج على المعاش المبكر (استقالة)</option>
                <option value="age">بلوغ سن الشيخوخة القانوني (التقاعد)</option>
                <option value="disability">العجز المستديم المنهي للخدمة</option>
                <option value="death">الوفاة أثناء الخدمة (للمستحقين)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                مدة الاشتراك الفعلي بالسنوات *
              </label>
              <input
                type="number"
                required
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500">
                {reason === 'early' ? 'المعاش المبكر يشترط 25 سنة فعلي من 2025' : 'الحد الأدنى للتقاعد 15 سنة'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                سن المتقدم الحالي (بالسنوات)
              </label>
              <input
                type="number"
                min="20"
                max="75"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4 text-amber-300" />
                <span>{loading ? 'جارٍ الحساب والتحقق القانوني...' : 'احسب المعاش وافحص الاستحقاق'}</span>
              </button>
            </div>
          </form>

          {/* Results Box */}
          {result && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-500">تقرير النتيجة التقديرية</span>
                <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-medium">
                  معادلة المادة 24 من القانون 148
                </span>
              </div>

              {/* Main pension highlight */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs text-slate-500 block mb-0.5">قيمة المعاش الشهري التقديري:</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 flex items-baseline gap-1">
                    <span>{result.finalPension.toLocaleString('ar-EG')}</span>
                    <span className="text-sm font-normal text-slate-600">جنيه مصري / شهر</span>
                  </div>
                  {result.raisedToMinimum && (
                    <span className="text-[11px] text-amber-700 font-medium block mt-1">
                      ⚠️ تم رفع المعاش تلقائياً للحد الأدنى المعتمد بقوة القانون ({result.minPensionLimit} ج.م).
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-right space-y-1">
                  <div>مدة الاشتراك: <strong>{result.yearsFloat} سنة</strong></div>
                  <div>أجر التسوية: <strong>{result.wage} ج.م</strong></div>
                  <div>الحد الأقصى القانوني (80%): <strong>{result.maxPension} ج.م</strong></div>
                </div>
              </div>

              {/* Early Retirement Eligibility Details */}
              {reason === 'early' && (
                <div
                  className={`p-4 rounded-xl border ${
                    result.earlyRetirement.eligible
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                    {result.earlyRetirement.eligible ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>مستوفٍ لشروط المعاش المبكر وفقاً للمادة 21 بند 6!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span>غير مستوفٍ لجميع شروط المعاش المبكر الصارمة</span>
                      </>
                    )}
                  </div>
                  <ul className="text-xs space-y-1.5 pr-2">
                    {result.earlyRetirement.criteriaLogs.map((log, lIdx) => (
                      <li key={lIdx} className="leading-relaxed flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>{log}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grants Estimation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1 font-semibold">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span>نفقات الجنازة</span>
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {result.grants.funeralExpenses.toLocaleString('ar-EG')} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500">معاش 3 أشهر فور الوفاة</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1 font-semibold">
                    <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                    <span>منحة الوفاة</span>
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {result.grants.deathGrant.toLocaleString('ar-EG')} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500">معاش 3 أشهر للمستحقين</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1 font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                    <span>منحة زواج الابنة</span>
                  </div>
                  <div className="font-bold text-slate-900 text-base">
                    {result.grants.daughterMarriageGrant.toLocaleString('ar-EG')} ج.م
                  </div>
                  <span className="text-[10px] text-slate-500">معاش سنة كاملة (12 شهر)</span>
                </div>
              </div>

              {/* Action: Send to chat */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSendToChat}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <span>إرسال هذه النتيجة للمحادثة لاستشارة المستشار بالتفصيل</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
