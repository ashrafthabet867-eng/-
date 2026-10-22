import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickPrompts } from './components/QuickPrompts';
import { LegalDocsModal } from './components/LegalDocsModal';
import { PensionCalculatorModal } from './components/PensionCalculatorModal';
import { HowToUseGuide } from './components/HowToUseGuide';
import { ShareAppModal } from './components/ShareAppModal';
import { SidebarDrawer } from './components/SidebarDrawer';
import { SignLanguageVideoPlayer } from './components/SignLanguageVideoPlayer';
import { SignLanguageDictionaryModal } from './components/SignLanguageDictionaryModal';
import { SignTerm } from './data/signLanguageData';
import { ChatMessageItem, LegalDocument, ResponseMode } from './types';
import { ShieldCheck, HelpCircle, RotateCcw, AlertCircle, Share2, Menu, Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'egyptian_pension_assistant_v3';

export default function App() {
  // Initialize state from localStorage so conversations survive locking/closing the device
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          return parsed.messages.map((m: ChatMessageItem) => ({ ...m, isStreaming: false }));
        }
      }
    } catch (err) {
      console.warn('Failed to load persisted messages from localStorage:', err);
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: 'أهلاً بحضرتك يا فندم في **المستشار التأميني الذكي** التابع للهيئة القومية للتأمين الاجتماعي. 🏛️\n\nأنا جاهز للإجابة على استفساراتك التأمينية وفقاً للقانون 148 لسنة 2019 ولائحته 2437، أو فحص مستنداتك وحساب معاشك.',
        mode: 'brief',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [mode, setMode] = useState<ResponseMode>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.mode === 'brief' || parsed.mode === 'detailed') return parsed.mode;
      }
    } catch {
      // ignore
    }
    return 'brief';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.autoPlayVoice === 'boolean') return parsed.autoPlayVoice;
      }
    } catch {
      // ignore
    }
    return false; // Default to muted to prevent latency and unexpected audio
  });

  const [autoSignLanguage, setAutoSignLanguage] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.autoSignLanguage === 'boolean') return parsed.autoSignLanguage;
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [isSignPlayerOpen, setIsSignPlayerOpen] = useState(false);
  const [isSignDictOpen, setIsSignDictOpen] = useState(false);
  const [signLanguageContent, setSignLanguageContent] = useState('');
  const [signPlayerMode, setSignPlayerMode] = useState<'modal' | 'pip'>('modal');

  const [standardDocs, setStandardDocs] = useState<LegalDocument[]>([]);
  const [customDocs, setCustomDocs] = useState<LegalDocument[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-save state to localStorage whenever messages, mode, autoPlayVoice, or autoSignLanguage change
  useEffect(() => {
    try {
      const cleanMessages = messages.map((m) => ({ ...m, isStreaming: false }));
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: cleanMessages,
          mode,
          autoPlayVoice,
          autoSignLanguage,
        })
      );
    } catch (err) {
      console.warn('Failed to save chat to localStorage:', err);
    }
  }, [messages, mode, autoPlayVoice, autoSignLanguage]);

  // Handle Device Sleep / Lock / Visibility change & Online/Offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleVisibilityChange = () => {
      // When user unlocks phone or opens laptop lid
      if (document.visibilityState === 'visible') {
        setMessages((prev) => {
          const hasStreaming = prev.some((m) => m.isStreaming);
          if (hasStreaming) {
            return prev.map((m) =>
              m.isStreaming
                ? {
                    ...m,
                    isStreaming: false,
                    content:
                      m.content.trim()
                        ? m.content + '\n\n*(توقف تدفق الإجابة مؤقتاً عند قفل الجهاز. اضغط على زر "إعادة المحاولة" بالأسفل لاستكمال الرد)*'
                        : '⚠️ توقف الاتصال مؤقتاً عند قفل شاشة الجهاز أو سكونه. اضغط على زر "إعادة المحاولة" لمتابعة الإجابة فوراً.',
                    hasError: true,
                  }
                : m
            );
          }
          return prev;
        });
        setIsLoading(false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch legal documents on load
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/documents');
        if (res.ok) {
          const data = await res.json();
          setStandardDocs(data.standard || []);
          setCustomDocs(data.custom || []);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };
    fetchDocs();
  }, []);

  // Handle Text-to-Speech playback
  const handleSpeak = async (text: string) => {
    // Stop any existing speech
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(true);

    try {
      // First attempt: Server Gemini TTS
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioBase64) {
          const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
          setCurrentAudio(audio);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Server TTS unavailable, falling back to browser synthesis', err);
    }

    // Fallback: Web Speech API synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      alert('القارئ الصوتي غير مدعوم في متصفحك.');
    }
  };

  const handleStopSpeaking = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Add custom document to server
  const handleAddDocument = async (doc: Partial<LegalDocument>) => {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (res.ok) {
      const data = await res.json();
      setCustomDocs((prev) => [...prev, data.document]);
    }
  };

  // Delete custom document from server
  const handleDeleteCustomDoc = async (id: string) => {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setCustomDocs((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Upload and parse full PDF document of the law or regulations into knowledge base
  const handleUploadPdf = async (pdfBase64: string, fileName: string, defaultCategory: string) => {
    const res = await fetch('/api/documents/upload-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, fileName, defaultCategory }),
    });
    if (!res.ok) {
      let errorMsg = 'فشل رفع ملف الـ PDF';
      try {
        const err = await res.json();
        if (err.error) errorMsg = err.error;
      } catch {
        if (res.status === 413) {
          errorMsg = 'حجم ملف الـ PDF كبير جداً ويتجاوز سعة النقل المباشر. علماً بأن القانون 148 ولائحته 2437 مدمجة بالكامل مسبقاً داخل النظام!';
        } else if (res.status === 504 || res.status === 408) {
          errorMsg = 'استغرقت معالجة الملف وقتاً طويلاً لكبر حجمه ومئات صفحاته. علماً بأن القانون 148 ولائحته 2437 مدمجة بالفعل.';
        } else {
          errorMsg = `فشل الخادم في معالجة الملف (${res.status})`;
        }
      }
      throw new Error(errorMsg);
    }
    const data = await res.json();
    setCustomDocs((prev) => [...prev, data.document]);
    return data.document;
  };

  const lastUserQueryRef = useRef<{ text: string; image?: any } | null>(null);

  // Handle sending a message with real-time stream updating
  const handleSendMessage = async (
    text: string,
    image?: { data: string; mimeType: string; name: string }
  ) => {
    lastUserQueryRef.current = { text, image };
    const nowTime = new Date().toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      image,
      timestamp: nowTime,
    };

    const botMsgId = `bot-${Date.now()}`;
    const botMsgPlaceholder: ChatMessageItem = {
      id: botMsgId,
      role: 'assistant',
      content: '',
      mode,
      timestamp: nowTime,
      isStreaming: true,
    };

    const newHistory = [...messages, userMsg];
    setMessages([...newHistory, botMsgPlaceholder]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Send last 6 messages to avoid compounding prompt token latency
          messages: newHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          image,
          customDocuments: customDocs,
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 404) {
          throw new Error('مسار الخادم غير متصل (404 Not Found) - يرجى الضغط على زر Export أو Push to GitHub في الشريط العلوي لتحديث ملفات Vercel تلقائياً.');
        }
        let serverErrMsg = '';
        try {
          const errData = await response.json();
          serverErrMsg = errData.error || '';
        } catch {
          // ignore
        }
        throw new Error(serverErrMsg || `فشل الاتصال بالخادم (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let isErrorChunk = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                // Live update streaming bot text
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? { ...m, content: accumulatedText, isStreaming: true, hasError: false }
                      : m
                  )
                );
              }
              if (parsed.error) {
                isErrorChunk = true;
                const errStr = typeof parsed.error === 'string' ? parsed.error : JSON.stringify(parsed.error);
                if (errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('high demand') || errStr.includes('Service Unavailable')) {
                  accumulatedText = '⚠️ ضغط مؤقت على خوادم الذكاء الاصطناعي (503 Service Unavailable). يرجى الضغط على زر "إعادة المحاولة" أدناه.';
                } else {
                  accumulatedText = errStr;
                }
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsgId
                      ? { ...m, content: accumulatedText, isStreaming: false, hasError: true }
                      : m
                  )
                );
              }
            } catch {
              // Ignore non-json or incomplete chunk
            }
          }
        }
      }

      // Mark streaming as completed if not an error
      if (!isErrorChunk) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, content: accumulatedText, isStreaming: false } : m
          )
        );

        // Auto-play response voice directly if enabled
        if (autoPlayVoice && accumulatedText.trim()) {
          setTimeout(() => {
            handleSpeak(accumulatedText);
          }, 100);
        }

        // Auto-open sign language video player if enabled for deaf citizens
        if (autoSignLanguage && accumulatedText.trim()) {
          setTimeout(() => {
            setSignLanguageContent(accumulatedText);
            setSignPlayerMode('pip'); // Open in PiP so user can read while watching sign video
            setIsSignPlayerOpen(true);
          }, 250);
        }
      }
    } catch (err: any) {
      console.error('Error generating response:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMsgId
            ? {
                ...m,
                content:
                  err?.message ||
                  'عذراً يا فندم، حدث ضغط لحظي مؤقت في الاتصال بالخدمة. يرجى الضغط على زر إعادة المحاولة أو المحاولة مرة أخرى.',
                isStreaming: false,
                hasError: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserQueryRef.current) {
      handleSendMessage(lastUserQueryRef.current.text, lastUserQueryRef.current.image);
    }
  };

  const handleOpenSignLanguage = (content: string, preferMode: 'modal' | 'pip' = 'modal') => {
    setSignLanguageContent(content);
    setSignPlayerMode(preferMode);
    setIsSignPlayerOpen(true);
  };

  const handleSelectTermForVideo = (term: SignTerm) => {
    setIsSignDictOpen(false);
    setSignLanguageContent(`${term.term}: ${term.summary}\n${term.signDescription}\n${term.handMovement}`);
    setSignPlayerMode('modal');
    setIsSignPlayerOpen(true);
  };

  const handleClearChat = () => {
    if (window.confirm('هل تريد مسح سجل المحادثة والبدء من جديد؟')) {
      handleStopSpeaking();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'أهلاً بك من جديد يا فندم. تفضل بطرح استفسارك التأميني وسأكون سعيداً بمساعدتك.',
          mode,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Official Government Portal Header with Official Logo & Menu Button */}
      <Header onOpenMenu={() => setIsSidebarOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-2.5 sm:p-5 flex flex-col">
        {/* Streamlined Sub-header (very clean on mobile) */}
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 px-1 gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="font-semibold text-slate-700 truncate">قانون 148 لسنة 2019</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-500">نصوص تشريعية معتمدة</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick Voice Autoplay Toggle Pill */}
            <button
              type="button"
              onClick={() => setAutoPlayVoice(!autoPlayVoice)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                autoPlayVoice
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
              }`}
              title="تفعيل أو كتم النطق الصوتي التلقائي للإجابة"
            >
              {autoPlayVoice ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{autoPlayVoice ? 'الصوت: تلقائي 🔊' : 'الصوت: مكتوم 🔇'}</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* Quick Sign Language Video Toggle Pill */}
            <button
              type="button"
              onClick={() => {
                const nextVal = !autoSignLanguage;
                setAutoSignLanguage(nextVal);
                if (nextVal) {
                  const lastBot = [...messages].reverse().find((m) => m.role === 'assistant' && m.content);
                  if (lastBot) {
                    handleOpenSignLanguage(lastBot.content, 'modal');
                  }
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${
                autoSignLanguage
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200 shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="تفعيل مترجم لغة الإشارة المرئي تلقائياً للصم وضعاف السمع"
            >
              <span className="text-xs">🤟</span>
              <span>{autoSignLanguage ? 'الإشارة: تلقائي' : 'لغة الإشارة'}</span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              title="فتح كافة الخيارات والأدوات"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>الخيارات</span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={handleClearChat}
              className="text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="بدء محادثة جديدة"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">محادثة جديدة</span>
            </button>
          </div>
        </div>

        {/* Live Audio Speaking Playing Banner */}
        {isSpeaking && (
          <div className="mb-2 bg-gradient-to-r from-emerald-900 to-teal-900 text-emerald-100 text-xs px-3.5 py-2 rounded-xl flex items-center justify-between shadow-md animate-fadeIn">
            <div className="flex items-center gap-2.5 truncate">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="font-bold flex-shrink-0">🔊 المستشار يتحدث الآن بالعامية المصرية...</span>
            </div>
            <button
              type="button"
              onClick={handleStopSpeaking}
              className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex-shrink-0"
            >
              إيقاف الصوت
            </button>
          </div>
        )}

        {/* Offline Connectivity Warning Banner */}
        {!isOnline && (
          <div className="mb-2 bg-amber-600 text-white text-xs px-3.5 py-2 rounded-xl flex items-center justify-between shadow-sm animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">
                أنت الآن غير متصل بالإنترنت. محادثاتك ومستنداتك محفوظة بأمان على جهازك وسيستأنف المستشار الرد فور عودة الشبكة.
              </span>
            </div>
          </div>
        )}

        {/* Chat Thread Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              onStopSpeaking={handleStopSpeaking}
              onRetry={handleRetry}
              onOpenSignLanguage={(text) => handleOpenSignLanguage(text, 'modal')}
            />
          ))}

          {/* Quick Prompts collapsible dropdown */}
          {messages.length <= 2 && (
            <QuickPrompts
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
              onOpenHowToUse={() => setIsHowToUseOpen(true)}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Fixed Sticky Chat Input with Attachments, Speech Recognition & Menu Trigger */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        mode={mode}
        onModeChange={setMode}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />

      {/* Slide-out Sidebar Drawer for Mobile & Desktop */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        mode={mode}
        onModeChange={setMode}
        onOpenCalculator={() => setIsCalcOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenHowToUse={() => setIsHowToUseOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onClearChat={handleClearChat}
        docsCount={standardDocs.length + customDocs.length}
        autoPlayVoice={autoPlayVoice}
        onToggleAutoPlayVoice={() => setAutoPlayVoice(!autoPlayVoice)}
        autoSignLanguage={autoSignLanguage}
        onToggleAutoSignLanguage={() => setAutoSignLanguage(!autoSignLanguage)}
        onOpenSignLanguageDictionary={() => setIsSignDictOpen(true)}
      />

      {/* Sign Language Video Interpreter Player (Supports Modal & Floating PiP Window) */}
      <SignLanguageVideoPlayer
        isOpen={isSignPlayerOpen}
        onClose={() => setIsSignPlayerOpen(false)}
        content={signLanguageContent}
        mode={signPlayerMode}
        onTogglePipMode={() => setSignPlayerMode(signPlayerMode === 'modal' ? 'pip' : 'modal')}
        onOpenDictionary={() => {
          setIsSignPlayerOpen(false);
          setIsSignDictOpen(true);
        }}
      />

      {/* Egyptian Sign Language Illustrated & Video Dictionary Modal */}
      <SignLanguageDictionaryModal
        isOpen={isSignDictOpen}
        onClose={() => setIsSignDictOpen(false)}
        onSelectTermForVideo={handleSelectTermForVideo}
      />

      {/* Legal Documents Knowledge Base Modal */}
      <LegalDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        standardDocs={standardDocs}
        customDocs={customDocs}
        onAddDocument={handleAddDocument}
        onDeleteCustomDoc={handleDeleteCustomDoc}
        onUploadPdf={handleUploadPdf}
      />

      {/* Pension & Early Retirement Calculator Modal */}
      <PensionCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
        onSendResultToChat={(summary) => handleSendMessage(summary)}
      />

      {/* "ازاي استخدمه ؟" How To Use Guide Modal */}
      <HowToUseGuide
        isOpen={isHowToUseOpen}
        onClose={() => setIsHowToUseOpen(false)}
      />

      {/* Share & Workplace Deployment Modal */}
      <ShareAppModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        sharedUrl={typeof window !== 'undefined' && window.location.href ? window.location.href : "https://ais-pre-jhd3zvpmqzqwwf2tpf2z2c-581583184321.europe-west3.run.app"}
      />
    </div>
  );
}
