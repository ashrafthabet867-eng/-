import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed and running standalone, do not show install prompt
  if (isInstalled) {
    if (variant === 'sidebar') {
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">التطبيق مثبت على جهازك وتعمل في الوضع المستقل</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers without beforeinstallprompt or desktop
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border border-emerald-400/40 cursor-pointer ${className}`}
          title="تثبيت التطبيق على جهازك للعمل دون انقطاع"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">تثبيت التطبيق</span>
          <span className="xs:hidden sm:hidden">تثبيت</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-l from-emerald-700 to-teal-800 text-white shadow-md hover:from-emerald-600 hover:to-teal-700 transition cursor-pointer text-right group ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">تثبيت التطبيق على الجهاز (PWA)</p>
              <p className="text-[11px] text-emerald-100">لتشغيل أسرع وحفظ المحادثات دون انقطاع</p>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold group-hover:bg-white group-hover:text-emerald-900 transition-colors">
            تثبيت
          </span>
        </button>
      )}

      {/* Instructions Modal for iOS Safari and Unsupported Browsers */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn" dir="rtl">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-slate-800 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isIOS ? 'تثبيت التطبيق على آيفون / آيباد' : 'تثبيت التطبيق على جهازك'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p className="font-medium text-slate-800">
                  لتشغيل المستشار كتطبيق مستقل على هاتفك والاحتفاظ بالمحادثات عند إغلاق الشاشة:
                </p>
                <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <li>
                    اضغط على زر <strong className="text-blue-600">المشاركة (Share ⎋)</strong> في أسفل متصفح Safari.
                  </li>
                  <li>مرّر لأسفل واختر <strong className="text-slate-900">إضافة إلى الشاشة الرئيسية (Add to Home Screen ➕)</strong>.</li>
                  <li>اضغط على <strong className="text-emerald-700">إضافة (Add)</strong> في أعلى الزاوية.</li>
                </ol>
                <p className="text-[11px] text-slate-500 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                  💡 سيظهر التطبيق بأيقونته الرسمية على شاشتك الرئيسية ويعمل بشكل فوري ومستقر.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p className="font-medium text-slate-800">
                  لتثبيت التطبيق من المتصفح (Chrome أو Edge):
                </p>
                <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <li>اضغط على قائمة المتصفح (الثلاث نقاط <strong>⋮</strong>).</li>
                  <li>اختر <strong className="text-slate-900">تثبيت التطبيق (Install App)</strong> أو <strong className="text-slate-900">إضافة للشاشة الرئيسية</strong>.</li>
                  <li>أكد التثبيت لفتح التطبيق كنافذة مستقلة بدون شريط المتصفح.</li>
                </ol>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 text-xs font-bold text-white transition cursor-pointer"
            >
              فهمت ذلك، إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};
