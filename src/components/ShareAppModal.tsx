import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Monitor, Smartphone, Printer, Globe, Code2, Users, Building2 } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'print' | 'embed'>('link');

  if (!isOpen) return null;

  const effectiveUrl = sharedUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    effectiveUrl
  )}&margin=10`;

  const embedCode = `<iframe 
  src="${effectiveUrl}" 
  width="100%" 
  height="700" 
  style="border:none; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.1);" 
  title="مستشار التأمينات والمعاشات المصري"
></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const handlePrintSign = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>لافتة إرشادية - مستشار التأمينات والمعاشات</title>
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800;900&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Cairo', sans-serif;
              text-align: center;
              padding: 40px;
              color: #0f172a;
              background: #ffffff;
            }
            .card {
              border: 3px solid #047857;
              border-radius: 24px;
              padding: 40px;
              max-width: 600px;
              margin: 0 auto;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            }
            .header-title {
              font-size: 26px;
              font-weight: 900;
              color: #064e3b;
              margin-bottom: 8px;
            }
            .subtitle {
              font-size: 16px;
              color: #475569;
              margin-bottom: 24px;
            }
            .qr-box {
              padding: 16px;
              background: #f8fafc;
              display: inline-block;
              border-radius: 16px;
              border: 2px dashed #cbd5e1;
              margin-bottom: 24px;
            }
            .qr-box img {
              width: 220px;
              height: 220px;
              display: block;
            }
            .instructions {
              font-size: 16px;
              font-weight: bold;
              color: #047857;
              margin-bottom: 12px;
            }
            .features {
              text-align: right;
              font-size: 14px;
              color: #334155;
              line-height: 1.8;
              margin-bottom: 24px;
              padding: 0 20px;
            }
            .footer {
              font-size: 13px;
              color: #64748b;
              border-top: 1px solid #e2e8f0;
              padding-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header-title">الهيئة القومية للتأمين الاجتماعي</div>
            <div class="subtitle">المستشار التأميني الذكي | جمهورية مصر العربية</div>
            
            <div class="instructions">امسح الكود بكاميرا هاتفك لبدء الاستشارة فوراً:</div>
            
            <div class="qr-box">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>

            <div class="features">
              • ردود فورية ومقيدة بأحكام القانون 148 لسنة 2019 ولائحته التنفيذية.<br>
              • فحص شروط المعاش المبكر وحساب المعاش التقديري.<br>
              • استعراض الأوراق والمستندات المطلوبة لكل خدمة تأمينية.<br>
              • يفهم اللهجة العامية المصرية ويتيح الاستماع الصوتي لكبار السن.
            </div>

            <div class="footer">
              متاح للجميع مجاناً على مدار 24 ساعة | الخط الساخن: 16217
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">مشاركة وإتاحة المساعد للجميع</h2>
              <p className="text-xs text-slate-400">
                طرق استخدام المساعد في العمل ونشره للزملاء والمواطنين
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

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-slate-200 px-4 pt-3 bg-slate-50 flex-wrap">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>الرابط المباشر</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>رمز الاستجابة السريعة (QR)</span>
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'print'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>طباعة لافتة للمكتب</span>
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>تضمين في موقع أو بوابة</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed">
                <span className="font-bold block mb-1">🔗 الرابط العام المشترك (Public URL):</span>
                هذا الرابط يعمل على أي متصفح (كمبيوتر مكتبي، هاتف محمول، تابلت) دون الحاجة لتثبيت أي برامج، ويمكنك إرساله عبر واتساب، أو الإيميل، أو إضافته للمفضلة لدى جميع الموظفين في مكتبك.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط التطبيق المباشر للمواطنين والزملاء:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={effectiveUrl}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-slate-700 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>

              {/* Best workplace usages */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>أفضل طرق الاستخدام في العمل:</span>
                </h4>
                <ul className="space-y-1.5 pr-2 text-slate-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>شباك خدمة المواطنين:</strong> يستخدمه الموظف للرد السريع على الحالات المعقدة وتزويد المواطن برقم المادة والأوراق بدقة.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>شاشة لمس في صالة الانتظار (Kiosk):</strong> تتيح للمواطنين كتابة استفساراتهم أو التحدث صوتاً أثناء انتظار دورهم.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>مجموعة العمل (واتساب / تيليجرام):</strong> إرسال الرابط لجميع الزملاء للاستعانة به كمرجع قانوني موحد وموثوق.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                يمكن للمواطنين والزملاء مسح هذا الرمز بكاميرا هاتفهم المحمول للدخول إلى المساعد في ثوانٍ:
              </p>

              <div className="inline-block p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl shadow-xs">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain bg-white p-2 rounded-xl border border-slate-200"
                />
                <span className="block text-[11px] text-slate-500 mt-2 font-mono truncate max-w-xs mx-auto">
                  {effectiveUrl}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={qrCodeUrl}
                  download="social_insurance_qr.png"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>تحميل صورة الـ QR</span>
                </a>
                <button
                  type="button"
                  onClick={handlePrintSign}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة لافتة فورية</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-950 p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2">
                <Printer className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  يمكنك بنقرة واحدة طباعة <strong>لافتة مكتبية رسمية أنيقة</strong> تحتوي على شعار الهيئة ورمز الـ QR وشرح مبسط، لتضعها على مكتبك أو في صالة الاستقبال أو بجوار شباك خدمة المواطنين!
                </p>
              </div>

              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 text-center space-y-3">
                <div className="text-sm font-bold text-slate-800">
                  معاينة اللافتة المجهزة للطباعة (مقاس A4 أو لافتة طاولة)
                </div>
                <div className="border border-emerald-600 bg-white p-4 rounded-xl max-w-md mx-auto shadow-sm text-right space-y-2 text-xs">
                  <div className="text-center font-bold text-emerald-900 border-b border-slate-100 pb-1.5">
                    🏛️ الهيئة القومية للتأمين الاجتماعي - المستشار الذكي
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <img src={qrCodeUrl} alt="QR" className="w-24 h-24 object-contain border p-1 rounded" />
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <p className="font-bold text-emerald-800">امسح الكود بهاتفك واسأل عن:</p>
                      <p>• شروط المعاش المبكر لعام 2025</p>
                      <p>• حساب المعاش والأنصبة ومنحة الزواج</p>
                      <p>• الأوراق والمستندات الرسمية المطلوبة</p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrintSign}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>فتح أمر الطباعة الآن (Print Desk Sign)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                إذا كان لديكم موقع إلكتروني، أو بوابة إنترانت داخلية (Intranet) في العمل، يمكنك نسخ كود التضمين (iFrame) أدناه لوضع المساعد كجزء من صفحتكم:
              </p>

              <div className="relative">
                <textarea
                  readOnly
                  rows={4}
                  value={embedCode}
                  className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-hidden select-all"
                />
                <button
                  onClick={handleCopyEmbed}
                  className="absolute left-2 top-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmbed ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            الرابط سحابي دائم ويعمل من أي جهاز دون الحاجة لتحميل تطبيقات
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
