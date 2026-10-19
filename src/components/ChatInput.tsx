import React, { useRef, useState, useEffect } from 'react';
import { Send, Mic, MicOff, X, Paperclip, Loader2, Check } from 'lucide-react';
import { ResponseMode } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, image?: { data: string; mimeType: string; name: string }) => void;
  isLoading: boolean;
  mode: ResponseMode;
  onModeChange: (mode: ResponseMode) => void;
  onOpenMenu?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  mode,
  onModeChange,
  onOpenMenu,
}) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<{
    data: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const liveTranscriptRef = useRef<string>('');
  const isRecordingRef = useRef<boolean>(false);
  const baseTextRef = useRef<string>('');

  // Keep liveTranscriptRef in sync
  useEffect(() => {
    liveTranscriptRef.current = liveTranscript;
  }, [liveTranscript]);

  // Clean up recording resources on unmount
  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, []);

  const cleanupAudioResources = () => {
    isRecordingRef.current = false;
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setAudioVolume(0);
  };

  // Start voice recording session
  const startRecording = async () => {
    setMicError(null);
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    audioChunksRef.current = [];
    setRecordingSeconds(0);
    baseTextRef.current = text.trim();

    // 1. Check support and request microphone access directly
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('متصفحك الحالي لا يدعم الوصول المباشر إلى الميكروفون. يرجى تجربة متصفح حديث مثل Chrome أو Edge.');
      cleanupAudioResources();
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
    } catch (err: any) {
      console.warn('Microphone access denied:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicError('تم حظر صلاحية الميكروفون. يرجى السماح بالوصول من إعدادات المتصفح أو أيقونة القفل 🔒 بجوار الرابط.');
      } else {
        setMicError('تعذر فتح الميكروفون. يرجى التأكد من توصيل المايك وإعطاء الإذن بالمتصفح.');
      }
      cleanupAudioResources();
      return;
    }

    setIsRecording(true);
    isRecordingRef.current = true;

    // 2. Real AudioContext frequency analyser (waveform bounciness confirms audio input)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!mediaStreamRef.current || !isRecordingRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }
    } catch (e) {
      console.warn('AudioContext visualizer not supported', e);
    }

    // 3. Start second counter timer
    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // 4. Setup MediaRecorder with cross-browser MIME type
    let chosenMimeType = '';
    if (window.MediaRecorder) {
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/wav',
      ];
      for (const t of candidates) {
        if (MediaRecorder.isTypeSupported(t)) {
          chosenMimeType = t;
          break;
        }
      }

      try {
        const options = chosenMimeType ? { mimeType: chosenMimeType } : undefined;
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Release media stream tracks
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
          }
          if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            try { audioContextRef.current.close(); } catch (e) {}
            audioContextRef.current = null;
          }

          // If browser speech recognition already captured a full sentence, keep it
          const currentWords = liveTranscriptRef.current?.trim() || '';
          if (currentWords.length > 5 && currentWords.split(/\s+/).length >= 2) {
            setText((prev) => {
              if (!prev || prev.includes(currentWords)) return prev || currentWords;
              return `${prev} ${currentWords}`.trim();
            });
            setLiveTranscript('');
            return;
          }

          // Otherwise, audioChunksRef has the real recorded microphone audio! Send to Gemini
          if (audioChunksRef.current.length > 0) {
            setIsTranscribing(true);
            try {
              const audioBlob = new Blob(audioChunksRef.current, {
                type: chosenMimeType || 'audio/webm',
              });

              if (audioBlob.size > 400) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const base64Data = (reader.result as string)?.split(',')[1];
                  if (base64Data) {
                    try {
                      const res = await fetch('/api/transcribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          audioData: base64Data,
                          mimeType: chosenMimeType || 'audio/webm',
                        }),
                      });

                      if (res.ok) {
                        const data = await res.json();
                        if (data.transcript && data.transcript.trim()) {
                          const tr = data.transcript.trim();
                          setText((prev) => {
                            const base = baseTextRef.current ? `${baseTextRef.current} ` : '';
                            return `${base}${tr}`.trim();
                          });
                          setLiveTranscript('');
                          if (textareaRef.current) {
                            textareaRef.current.style.height = 'auto';
                            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
                          }
                        }
                      }
                    } catch (fetchErr) {
                      console.error('Failed to transcribe audio:', fetchErr);
                    }
                  }
                  setIsTranscribing(false);
                };
                reader.readAsDataURL(audioBlob);
              } else {
                setIsTranscribing(false);
              }
            } catch (err) {
              console.error('Error preparing audio blob:', err);
              setIsTranscribing(false);
            }
          }
        };

        // Record small time slices continuously (100ms)
        mediaRecorder.start(100);
        mediaRecorderRef.current = mediaRecorder;
      } catch (mrErr) {
        console.warn('Failed to start MediaRecorder:', mrErr);
      }
    }

    // 5. Run Web Speech API concurrently for real-time live preview (if supported)
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'ar-EG';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const spoken = (finalTranscript + interimTranscript).trim();
          if (spoken) {
            setLiveTranscript(spoken);
            liveTranscriptRef.current = spoken;
            const fullText = baseTextRef.current ? `${baseTextRef.current} ${spoken}` : spoken;
            setText(fullText);

            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition live preview warning:', event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Web Speech API preview not initialized:', err);
      }
    }
  };

  const stopRecording = () => {
    isRecordingRef.current = false;
    setIsRecording(false);
    setAudioVolume(0);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (typeof mediaRecorderRef.current.requestData === 'function') {
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  };

  const cancelRecording = () => {
    isRecordingRef.current = false;
    cleanupAudioResources();
    setText(baseTextRef.current);
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    audioChunksRef.current = [];
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم الملف كبير جداً. يرجى اختيار صورة أو مستند أقل من 15 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setImagePreview({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (isRecording) {
      stopRecording();
    }
    if ((!text.trim() && !imagePreview) || isLoading || isTranscribing) return;
    onSendMessage(text.trim(), imagePreview || undefined);
    setText('');
    setLiveTranscript('');
    liveTranscriptRef.current = '';
    setImagePreview(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border-t border-slate-200 p-2 sm:p-3 shadow-lg sticky bottom-0 z-20">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Active Audio Recording Bar with Waveform & Timer */}
        {isRecording && (
          <div className="flex items-center justify-between bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 border-2 border-rose-300 text-rose-950 rounded-2xl px-3.5 py-2.5 text-xs shadow-md animate-fadeIn">
            <div className="flex items-center gap-3 truncate">
              {/* Pulsing indicator */}
              <span className="relative flex h-3.5 w-3.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
              </span>

              {/* Timer */}
              <span className="font-mono font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-lg border border-rose-200 flex-shrink-0 text-xs">
                {formatTime(recordingSeconds)}
              </span>

              {/* Dynamic Equalizer / Waveform Bars */}
              <div className="flex items-end gap-1 h-5 flex-shrink-0 px-1">
                {[0.4, 0.8, 1.2, 0.7, 0.5].map((factor, i) => {
                  const barHeight = Math.max(4, Math.min(20, (audioVolume * factor * 0.3) + 4));
                  return (
                    <span
                      key={i}
                      className="w-1 bg-rose-600 rounded-full transition-all duration-75"
                      style={{ height: `${barHeight}px` }}
                    />
                  );
                })}
              </div>

              {/* Speech hint / live transcript */}
              <div className="truncate">
                {liveTranscript ? (
                  <span className="text-slate-800 font-semibold truncate block">
                    "{liveTranscript}"
                  </span>
                ) : (
                  <span className="text-rose-900 font-medium">
                    تحدث الآن.. نستمع إلى استفسارك بالعامية المصرية
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="إنهاء التسجيل وتحويل الصوت لنص"
              >
                <Check className="w-4 h-4" />
                <span>تم</span>
              </button>
              <button
                type="button"
                onClick={cancelRecording}
                className="p-1.5 text-slate-500 hover:text-slate-700 rounded-xl hover:bg-rose-100/80 transition-colors cursor-pointer"
                title="إلغاء التسجيل"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Transcribing indicator */}
        {isTranscribing && (
          <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl px-3.5 py-2 text-xs shadow-xs animate-fadeIn">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span className="font-semibold">جارٍ تحويل صوتك بدقة إلى استفسار مكتوب...</span>
          </div>
        )}

        {/* Microphone Error Message if permission denied */}
        {micError && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-300 text-amber-950 rounded-xl px-3.5 py-2 text-xs shadow-xs">
            <span className="leading-relaxed">⚠️ {micError}</span>
            <button
              type="button"
              onClick={() => setMicError(null)}
              className="text-amber-800 hover:text-amber-950 font-bold p-1 rounded-lg hover:bg-amber-100 cursor-pointer"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Image / Document preview tag if selected */}
        {imagePreview && (
          <div className="relative inline-flex items-center gap-2 bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-xl p-1.5 pr-2.5 text-xs shadow-xs">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-emerald-200 bg-white flex items-center justify-center flex-shrink-0">
              <img
                src={`data:${imagePreview.mimeType};base64,${imagePreview.data}`}
                alt="معاينة"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold truncate max-w-[180px] sm:max-w-xs">{imagePreview.name}</span>
              <span className="text-[10px] text-emerald-700">مستند جاهز للفحص والتحليل</span>
            </div>
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors mr-1 cursor-pointer"
              title="إزالة المرفق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input box row */}
        <div className="relative flex items-end gap-1.5 sm:gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-1.5 sm:p-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
          {/* File attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-200/70 transition-colors flex-shrink-0 cursor-pointer"
            title="ارفع صورة مستند، بطاقة، برنت تأميني، أو شهادة"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />

          {/* Voice Input Mic Button - Prominent & Active */}
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`p-2 sm:p-2.5 rounded-xl transition-all flex-shrink-0 cursor-pointer ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400 scale-105'
                : 'text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/80 shadow-xs active:scale-95'
            }`}
            title={isRecording ? 'اضغط لإنهاء التسجيل' : 'تحدث بصوتك بالعامية المصرية مباشرة'}
            aria-label="تسجيل صوتي"
          >
            {isRecording ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
            )}
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? 'جارٍ الاستماع إليك.. تحدث براحتك'
                : 'اكتب سؤالك أو اضغط على المايك 🎙️ للتحدث...'
            }
            rows={1}
            className="flex-1 bg-transparent border-0 outline-hidden resize-none py-1.5 sm:py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 max-h-32 min-h-[38px] leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!text.trim() && !imagePreview) || isLoading || isTranscribing}
            className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
              (!text.trim() && !imagePreview) || isLoading || isTranscribing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md active:scale-95'
            }`}
            title="إرسال الاستفسار"
          >
            {isLoading || isTranscribing ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
