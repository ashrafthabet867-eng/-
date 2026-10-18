import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, ShieldCheck, User, Sparkles, Sliders, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { ChatMessageItem } from '../types';
import { AdvisorLogo } from './AdvisorLogo';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onRetry?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format message text with markdown-like highlights for legal articles, bullet points, and headers
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Main section headings (e.g. ### or 1. **الرأي القانوني**)
      if (line.startsWith('###') || line.startsWith('##') || /^(\d+[\.\)]|\*)\s*\*\*/.test(line)) {
        const cleanHeader = line.replace(/^[#*0-9\.\)\s]+/, '').replace(/\*\*/g, '');
        return (
          <div key={idx} className="font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-2 border-r-2 border-emerald-600 pr-2 bg-emerald-50/50 py-1 rounded">
            <span className="text-sm sm:text-base text-emerald-950">{cleanHeader}</span>
          </div>
        );
      }

      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-•*]\s*/, '');
        // Highlight bold text inside bullet
        const parts = bulletText.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pr-1 text-slate-800 leading-relaxed text-sm sm:text-base">
            <span className="text-emerald-600 font-bold mt-1 text-sm">•</span>
            <div className="flex-1">
              {parts.map((p, pIdx) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-semibold text-slate-950 bg-amber-50/80 px-1 rounded">
                      {p.slice(2, -2)}
                    </strong>
                  );
                }
                return p;
              })}
            </div>
          </div>
        );
      }

      // General paragraph with bold support and legal article badges
      const parts = line.split(/(\*\*.*?\*\*|المادة\s*\(\d+\)|القانون\s*148\s*لسنة\s*2019)/g);
      return (
        <p key={idx} className="my-1.5 leading-relaxed text-slate-800 text-sm sm:text-base">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-950">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (/المادة\s*\(\d+\)|القانون\s*148/.test(part)) {
              return (
                <span
                  key={pIdx}
                  className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded text-xs mx-0.5 border border-emerald-300"
                >
                  <ShieldCheck className="w-3 h-3 inline" />
                  {part}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 sm:gap-4 my-4 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      {/* Avatar */}
      {isBot ? (
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shadow-md border-2 border-slate-200/90 flex items-center justify-center p-0.5">
            <AdvisorLogo className="w-full h-full object-contain" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
          </span>
        </div>
      ) : (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border bg-slate-800 border-slate-700 text-emerald-300">
          <User className="w-5 h-5" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[88%] sm:max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Sender meta */}
        <div className="flex items-center gap-2 mb-1 px-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">
            {isBot ? 'المستشار التأميني' : 'أنت'}
          </span>
          <span>•</span>
          <span>{message.timestamp}</span>
          {isBot && message.mode && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                message.mode === 'brief'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}
            >
              {message.mode === 'brief' ? (
                <>
                  <Sparkles className="w-3 h-3" /> رد مختصر
                </>
              ) : (
                <>
                  <Sliders className="w-3 h-3" /> رد مفصل
                </>
              )}
            </span>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl p-4 sm:p-5 shadow-sm border transition-all ${
            isBot
              ? 'bg-white border-slate-200 text-slate-800 rounded-tr-sm'
              : 'bg-emerald-700 text-white border-emerald-800 rounded-tl-sm'
          }`}
        >
          {/* Uploaded image if attached */}
          {message.image && (
            <div className="mb-3.5 rounded-xl overflow-hidden border border-slate-300/60 bg-slate-100 max-w-sm">
              <img
                src={`data:${message.image.mimeType};base64,${message.image.data}`}
                alt={message.image.name || 'مستند مرفق'}
                className="w-full max-h-60 object-contain bg-slate-900/5 p-1"
              />
              <div className="p-2 bg-slate-50 border-t border-slate-200 text-xs flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1.5 truncate">
                  <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{message.image.name || 'مستند تأميني مرفق'}</span>
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">مرفق</span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="space-y-1">
            {message.hasError || (message.content && (message.content.includes('503') || message.content.includes('UNAVAILABLE') || message.content.includes('high demand'))) ? (
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 text-amber-950 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>ضغط مؤقت على خوادم الذكاء الاصطناعي (503 Service Unavailable)</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-xs">
                  هذا أمر تقني طبيعي ومؤقت يحدث أثناء فترات الذروة اللحظية في حركة المرور. يمكنك الضغط على زر <strong>إعادة المحاولة</strong> أدناه وسيقوم النظام بتوجيه استفسارك مباشرة للنموذج البديل السريع للإجابة فوراً.
                </p>
                {onRetry && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onRetry}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>إعادة المحاولة الآن</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isBot ? (
              renderFormattedContent(message.content)
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
            )}

            {/* Live streaming indicator */}
            {message.isStreaming && (
              <div className="flex items-center gap-2 text-emerald-600 font-medium text-xs mt-3 bg-emerald-50 p-2 rounded-lg border border-emerald-200/60 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span>جاري صياغة الفتوى التأمينية وتحديث الرد لحظياً...</span>
              </div>
            )}
          </div>
        </div>

        {/* Action bar for Bot messages */}
        {isBot && !message.isStreaming && message.content && (
          <div className="flex items-center gap-1.5 mt-2 px-1 text-xs text-slate-500">
            <button
              onClick={() => (isSpeaking ? onStopSpeaking() : onSpeak(message.content))}
              type="button"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={isSpeaking ? 'إيقاف القراءة الصوتية' : 'استمع للرد صوتياً'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>إيقاف الصوت</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>استماع صوتي</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              title="نسخ نص الإجابة"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              مستند للقانون 148
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
