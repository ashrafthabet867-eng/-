import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { OFFICIAL_LAW_DOCUMENTS, LegalArticle } from './src/data/law148Knowledge.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// In-memory user-added documents store
let customLawDocs: LegalArticle[] = [];

// Initialize Gemini client on server side only
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Builds the comprehensive system instruction ensuring strict legal grounding,
 * understanding Egyptian dialect, and handling brief vs detailed modes.
 */
/**
 * Builds the comprehensive system instruction ensuring strict legal grounding,
 * understanding Egyptian dialect, and handling brief vs detailed modes.
 */
function buildSystemInstruction(mode: 'brief' | 'detailed', activeDocs: LegalArticle[], userQuery: string = ''): string {
  // Normalize query words for intelligent keyword prioritization
  const queryLower = (userQuery || '').toLowerCase();
  const keywords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  // Score docs based on relevance to user's question
  const scoredDocs = activeDocs.map((doc) => {
    let score = 0;
    const textToMatch = `${doc.title} ${doc.number} ${doc.category} ${doc.summary} ${doc.fullText}`.toLowerCase();
    
    // Core always-critical topics
    if (queryLower.includes('مبكر') && (doc.id.includes('early') || doc.title.includes('المبكر'))) score += 10;
    if (queryLower.includes('وفاة') || queryLower.includes('ورثة') || queryLower.includes('مستحق')) {
      if (doc.category === 'survivors' || doc.id.includes('survivor')) score += 10;
    }
    if (queryLower.includes('اصابة') || queryLower.includes('إصابة') || queryLower.includes('عجز')) {
      if (doc.category === 'work_injury' || doc.category === 'sickness') score += 10;
    }
    if (queryLower.includes('زواج') || queryLower.includes('منحة') || queryLower.includes('جنازة')) {
      if (doc.category === 'grants') score += 10;
    }
    if (queryLower.includes('استمارة') || queryLower.includes('س6') || queryLower.includes('س1')) {
      if (doc.category === 'forms' || doc.id.includes('form')) score += 10;
    }

    for (const kw of keywords) {
      if (textToMatch.includes(kw)) score += 2;
    }
    return { doc, score };
  });

  // Sort by relevance score
  scoredDocs.sort((a, b) => b.score - a.score);

  // Top relevant docs get full text; remaining docs get concise summaries to avoid prompt bloat
  const topDocs = scoredDocs.slice(0, 6);
  const remainingDocs = scoredDocs.slice(6);

  const primaryContext = topDocs
    .map(
      ({ doc }) => `
[وثيقة معتمدة أولوية: ${doc.number} - ${doc.title}]
التصنيف: ${doc.category}
الموجز: ${doc.summary}
النص القانوني والضوابط:
${doc.fullText}
${doc.conditions && doc.conditions.length > 0 ? `الشروط: \n- ${doc.conditions.join('\n- ')}` : ''}
${doc.requiredDocs && doc.requiredDocs.length > 0 ? `الأوراق المطلوبة: \n- ${doc.requiredDocs.join('\n- ')}` : ''}
`
    )
    .join('\n----------------------------------------\n');

  const secondaryIndex = remainingDocs
    .map(({ doc }) => `- ${doc.number} (${doc.title}): ${doc.summary}`)
    .join('\n');

  return `
أنت "مستشار التأمينات والمعاشات المصري" - المساعد الرقمي الخبير للهيئة القومية للتأمين الاجتماعي بجمهورية مصر العربية.
مهمتك الأساسية: مساعدة المواطنين المتعاملين مع الهيئة والإجابة على تساؤلاتهم وتقديم الفتوى التأمينية الدقيقة بسرعة ووضوح تام.

القواعد الإلزامية:
1. **المرجعية التشريعية الحصرية**:
   - كافة إجاباتك محصورة بنصوص قانون التأمينات رقم 148 لسنة 2019، اللائحة التنفيذية 2437 لسنة 2021، وجداول ونماذج الهيئة الرسمية.
   - شرط المعاش المبكر لعام 2025/2026 فصاعداً: **25 سنة اشتراك فعلي كاملة (300 شهر)** + مدة تسفر عن 50% من أجر التسوية + 65% من الحد الأدنى لأجر الاشتراك.
   - سن المعاش يرتفع تدريجياً بدءاً من يوليو 2032 (61 سنة) ليصل إلى 65 سنة في يوليو 2040.
   - اذكر رقم المادة دائماً (مثلاً: المادة 21 بند 6، المادة 104، قرار 2437...).
   - ممنوع التخمين أو الاستناد لقوانين ملغاة (مثل قانون 79 لسنة 1975).

2. **اللهجة والأسلوب المصري**:
   - خاطب المواطن بالعامية المصرية الودودة والمهذبة ("يا فندم"، "تحت أمرك"، "ألف مبروك"، "البقاء لله").
   - بسّط المصطلحات الإدارية المعقدة (وضح ما هي "استمارة 6"، "البرنت التأميني"، "كود المنشأة").

3. **نمط الرد: [${mode === 'brief' ? 'خيار الرد المختصر' : 'خيار الرد المفصل'}]**:
${
  mode === 'brief'
    ? `   - **الرد المختصر**: قدّم الخلاصة المباشرة والقرار القانوني الحاسم في 3 إلى 5 أسطر مركزة مع رقم المادة القانونية، لتوفير وقت المواطن.`
    : `   - **الرد المفصل**: قدّم تفنيداً شاملاً (1. السند القانوني، 2. الشروط التفصيلية، 3. الأوراق المطلوبة، 4. الخطوات التنفيذية، 5. الحسابات إن وجدت).`
}

المستندات القانونية ذات الصلة المباشرة:
========================================
${primaryContext}

فهرس باقي المواد والقرارات:
${secondaryIndex}
========================================
`;
}

// Endpoint: Check server status and API key readiness
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    totalStandardDocs: OFFICIAL_LAW_DOCUMENTS.length,
    totalCustomDocs: customLawDocs.length,
  });
});

// Endpoint: Fetch active legal knowledge base
app.get('/api/documents', (req, res) => {
  res.json({
    standard: OFFICIAL_LAW_DOCUMENTS,
    custom: customLawDocs,
  });
});

// Endpoint: Add custom legal document/circular
app.post('/api/documents', (req, res) => {
  try {
    const { title, number, category, summary, fullText, conditions, requiredDocs } = req.body;
    if (!title || !fullText) {
      return res.status(400).json({ error: 'العنوان والنص القانوني مطلوبان' });
    }
    const newDoc: LegalArticle = {
      id: `custom-${Date.now()}`,
      title,
      number: number || 'مستند إداري / كتاب دوري',
      category: category || 'forms',
      summary: summary || title,
      fullText,
      conditions: conditions || [],
      requiredDocs: requiredDocs || [],
    };
    customLawDocs.push(newDoc);
    res.json({ success: true, document: newDoc });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: Delete custom document
app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  customLawDocs = customLawDocs.filter((d) => d.id !== id);
  res.json({ success: true });
});

// Helper to safely parse JSON or extract fields from truncated/malformed response
function safeParseJson(raw: string): any {
  if (!raw) return {};
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Fallback extraction with regex if model output was cut off
    const titleMatch = cleaned.match(/"title"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const numberMatch = cleaned.match(/"number"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const categoryMatch = cleaned.match(/"category"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const summaryMatch = cleaned.match(/"summary"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    const fullTextMatch = cleaned.match(/"fullText"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);

    return {
      title: titleMatch ? titleMatch[1].replace(/\\"/g, '"') : undefined,
      number: numberMatch ? numberMatch[1].replace(/\\"/g, '"') : undefined,
      category: categoryMatch ? categoryMatch[1] : undefined,
      summary: summaryMatch ? summaryMatch[1].replace(/\\"/g, '"') : undefined,
      fullText: fullTextMatch ? fullTextMatch[1].replace(/\\"/g, '"') : cleaned.slice(0, 4000),
    };
  }
}

// Endpoint: Upload and analyze PDF document (Law 148, Reg 2437, Tables, or Circulars)
app.post('/api/documents/upload-pdf', async (req, res) => {
  req.setTimeout(180000); // 3 minutes timeout for PDF processing
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'مفتاح Gemini API غير مهيأ بالخادم.' });
    }
    const { pdfBase64, fileName, defaultCategory = 'pensions' } = req.body;
    if (!pdfBase64) {
      return res.status(400).json({ error: 'يرجى اختيار ملف PDF صالح.' });
    }

    const prompt = `أنت مستشار توثيق وفهرسة تشريعات التأمينات الاجتماعية بالهيئة القومية للتأمين الاجتماعي بجمهورية مصر العربية.
المهمة: تحليل وقراءة ملف الـ PDF المرفق وفهرسته بدقة.
استخرج المحتوى في كائن JSON مختصر وقانوني دقيق مطابق للمخطط التالي:
{
  "title": "عنوان رسمي محدد للوثيقة (مثال: نصوص اللائحة التنفيذية رقم 2437 لسنة 2021 أو قرار وزاري)",
  "number": "رقم القرار أو المادة أو القانون أو الجدول",
  "category": "إحدى القيم التالية فقط: pensions أو early_retirement أو survivors أو contributions أو work_injury أو grants أو forms أو tables",
  "summary": "موجز قانوني تنفيذي للمحتوى يوضح أهم الحقوق والشروط والالتزامات",
  "fullText": "خلاصة المواد والأحكام والقرارات والنسب المستخرجة من الوثيقة (في حدود 2000 كلمة من أهم النصوص الحاكمة)",
  "conditions": ["شرط 1", "شرط 2"],
  "requiredDocs": ["مستند مطلوب 1", "مستند مطلوب 2"]
}
أعد فقط كائن JSON الصالح بدون أي نصوص أو markdown قبله أو بعده.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = safeParseJson(response.text || '{}');
    const newDoc: LegalArticle = {
      id: `custom-pdf-${Date.now()}`,
      title: parsed.title || fileName || 'مستند PDF قانوني معتمد',
      number: parsed.number || 'ملف PDF ملحق',
      category: parsed.category || defaultCategory || 'pensions',
      summary: parsed.summary || parsed.title || 'مستند صادر بملف PDF رسمي',
      fullText: parsed.fullText || 'نصوص ومواد الملف المرفق',
      conditions: Array.isArray(parsed.conditions) ? parsed.conditions : [],
      requiredDocs: Array.isArray(parsed.requiredDocs) ? parsed.requiredDocs : [],
    };

    customLawDocs.push(newDoc);
    res.json({ success: true, document: newDoc });
  } catch (err: any) {
    console.error('PDF ingestion error:', err);
    let userMsg = 'حدث خطأ أثناء فحص وتحليل ملف الـ PDF';
    if (err.message && (err.message.includes('503') || err.message.includes('high demand'))) {
      userMsg = 'الخدمة تشهد ضغطاً مؤقتاً في معالجة المستندات الكبيرة. يرجى إعادة المحاولة بعد لحظات، علماً بأن نصوص القانون 148 ولائحته 2437 مدمجة بالكامل مسبقاً.';
    } else if (err.message && err.message.includes('ResourceExhausted')) {
      userMsg = 'الملف يحتوي على عدد صفحات كبير جداً يتجاوز حد المعالجة اللحظية. علماً بأن القانون 148 ولائحته 2437 مدمجة بالكامل في التطبيق.';
    } else if (err.message) {
      userMsg += `: ${err.message}`;
    }
    res.status(500).json({ error: userMsg });
  }
});

// Endpoint: Ultra-fast Streaming Chat (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  try {
    if (!apiKey) {
      res.status(500).write(`data: ${JSON.stringify({ error: 'مفتاح Gemini API غير مهيأ بالخادم.' })}\n\n`);
      res.end();
      return;
    }

    const { messages, mode = 'brief', image, customDocuments = [] } = req.body;

    // Take only the most recent 6 messages to keep latency low and avoid token compounding
    const recentMessages = Array.isArray(messages) ? messages.slice(-6) : [];
    const lastUserQuery =
      recentMessages
        .filter((m: any) => m.role === 'user')
        .slice(-1)[0]?.content || '';

    const allActiveDocs = [...OFFICIAL_LAW_DOCUMENTS, ...customLawDocs, ...customDocuments];
    const systemInstruction = buildSystemInstruction(mode, allActiveDocs, lastUserQuery);

    // Format chat contents for Gemini SDK
    const contents: any[] = [];

    for (let i = 0; i < recentMessages.length; i++) {
      const msg = recentMessages[i];
      const isLastMessage = i === recentMessages.length - 1;
      const parts: any[] = [];

      // If last message and image is attached
      if (isLastMessage && image && image.data) {
        parts.push({
          inlineData: {
            mimeType: image.mimeType || 'image/jpeg',
            data: image.data,
          },
        });
      }

      if (msg.content) {
        parts.push({ text: msg.content });
      }

      if (parts.length > 0) {
        contents.push({
          role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
          parts,
        });
      }
    }

    if (contents.length === 0) {
      res.status(400).write(`data: ${JSON.stringify({ error: 'لا توجد رسائل للمعالجة' })}\n\n`);
      res.end();
      return;
    }

    // Set SSE headers with anti-buffering for Cloud Run / Nginx
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();
    // Immediate keepalive comment to flush intermediate proxy buffers
    res.write(': keepalive\n\n');

    let responseStream: any = null;
    let selectedModel = '';

    // Fast and reliable model hierarchy (verified sub-second TTFT)
    const modelsToTry = [
      'gemini-flash-lite-latest',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.6-flash',
    ];

    for (const modelName of modelsToTry) {
      try {
        responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.2,
          },
        });
        selectedModel = modelName;
        break; // Successfully started stream
      } catch (err: any) {
        console.warn(`Model ${modelName} stream failed (${err?.status || err?.message?.slice(0, 50)}), trying next fallback...`);
      }
    }

    if (!responseStream) {
      throw new Error('خوادم الذكاء الاصطناعي تشهد ضغطاً مؤقتاً. يرجى الضغط على زر إعادة المحاولة.');
    }

    try {
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (streamErr: any) {
      console.error('Error during streaming consumption:', streamErr);
      res.write(
        `data: ${JSON.stringify({
          error: 'انقطع الاتصال بالخادم أثناء تدفق الإجابة. يرجى الضغط على زر إعادة المحاولة.',
        })}\n\n`
      );
      res.end();
    }
  } catch (err: any) {
    console.error('Chat stream error:', err);
    let friendlyMessage = 'عذراً يا فندم، تشهد خوادم الذكاء الاصطناعي ضغطاً لحظياً مرتفعاً. يرجى الضغط على زر "إعادة المحاولة" بعد لحظات.';
    if (err.message && !err.message.includes('{')) {
      friendlyMessage = err.message;
    }
    res.write(`data: ${JSON.stringify({ error: friendlyMessage })}\n\n`);
    res.end();
  }
});

// Endpoint: Dedicated Document / Image Analysis
app.post('/api/analyze-document', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'مفتاح Gemini API غير مهيأ بالخادم.' });
    }

    const { image, userNote } = req.body;
    if (!image || !image.data) {
      return res.status(400).json({ error: 'يرجى إرفاق صورة المستند أولاً.' });
    }

    const allActiveDocs = [...OFFICIAL_LAW_DOCUMENTS, ...customLawDocs];
    const systemInstruction = `
أنت خبير فحص المستندات التأمينية بالهيئة القومية للتأمين الاجتماعي بجمهورية مصر العربية.
المهمة: فحص المستند أو الصورة المرفقة فحصاً قانونياً دقيقاً وفقاً لأحكام القانون 148 لسنة 2019 واللائحة التنفيذية.
أخرج تقريراً تحليلياً باللغة العربية يشمل:
1. نوع المستند (بطاقة رقم قومي، برنت تأميني، استمارة 6، شهادة وفاة، قسيمة زواج، خطاب بنكي...).
2. البيانات المستخرجة بدقة.
3. الموقف التأميني للمواطن بناءً على المستند.
4. مدى اكتمال المستند وما إذا كان ينقصه أختام (مثل ختم النسر) أو توقيعات.
5. الإجراء القانوني التالي المطلوب من المواطن خطوة بخطوة.
`;

    const parts: any[] = [
      {
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: image.data,
        },
      },
      {
        text: userNote
          ? `قم بفحص هذا المستند التأميني مع مراعاة ملاحظة المواطن: "${userNote}"`
          : 'قم بفحص هذا المستند التأميني وتحليله طبقاً لقانون التأمينات والمعاشات رقم 148 لسنة 2019.',
      },
    ];

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
    } catch (e) {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });
    }

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error('Analyze document error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: Text to Speech (TTS) using Gemini 3.8 Flash Lite TTS
app.post('/api/tts', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'مفتاح Gemini API غير متوفر' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'النص مطلوب' });
    }

    // Limit text length for TTS voice summary
    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 500);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Clear, reassuring Egyptian Arabic civil service advisor, dignified and polite',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'تعذر توليد المقطع الصوتي' });
    }

    res.json({ audioBase64: base64Audio });
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: Audio transcription using Gemini 3.8 Flash (Server-side Multimodal)
app.post('/api/transcribe', async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ error: 'مفتاح Gemini API غير مهيأ بالخادم.' });
    }
    const { audioData, mimeType = 'audio/webm' } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'ملف الصوت مطلوب' });
    }

    // Clean and normalize MIME type for Gemini (strip parameters like ;codecs=opus)
    let cleanMimeType = (mimeType || 'audio/webm').split(';')[0].trim().toLowerCase();
    if (cleanMimeType === 'audio/m4a' || cleanMimeType === 'audio/x-m4a') {
      cleanMimeType = 'audio/mp4';
    }
    if (!cleanMimeType.startsWith('audio/')) {
      cleanMimeType = 'audio/webm';
    }

    let responseText = '';

    // Fast models hierarchy for Egyptian Arabic voice transcription
    const transcribeModels = [
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
      'gemini-3.5-transcribe',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ];

    for (const model of transcribeModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: cleanMimeType,
                  data: audioData,
                },
              },
              {
                text: 'أنت خبير تفريغ صوتي متخصص في اللهجة العامية المصرية ومصطلحات التأمينات والمعاشات. استمع للمقطع الصوتي واكتب الكلام المنطوق فقط باللغة العربية بدون أي مقدمات أو علامات إضافية.',
              },
            ],
          },
          config: {
            temperature: 0.1,
          },
        });
        if (response.text && response.text.trim()) {
          responseText = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Transcribe model ${model} failed (${err?.status || err?.message?.slice(0, 40)}), trying next...`);
      }
    }

    let transcript = responseText.replace(/^["'«»]+|["'«»]+$/g, '') || '';
    if (/^(silence|صمت|لا يوجد صوت|بدون صوت)[\.\s]*$/i.test(transcript)) {
      transcript = '';
    }
    res.json({ transcript });
  } catch (err: any) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: Pension & Early Retirement Calculator
app.post('/api/calculate-pension', (req, res) => {
  try {
    const {
      averageWage, // أجر التسوية أو متوسط الأجر التأميني
      serviceYears, // مدة الخدمة بالسنوات
      serviceMonths = 0, // الشهور الإضافية
      age, // سن المتقدم
      reason = 'age', // 'age' (بلوغ السن) | 'early' (معاش مبكر) | 'disability' (عجز) | 'death' (وفاة)
    } = req.body;

    const wage = Number(averageWage) || 0;
    const totalMonths = (Number(serviceYears) || 0) * 12 + (Number(serviceMonths) || 0);
    const yearsFloat = totalMonths / 12;
    const applicantAge = Number(age) || 60;

    // Minimum & maximum insurance reference values in Egypt (2024-2026 indicative)
    const MIN_PENSION_LIMIT = 1495; // الحد الأدنى المعتمد للمعاش
    const MIN_CONTRIBUTION_WAGE = 2300; // الحد الأدنى لأجر الاشتراك

    // Standard formula: Pension = Wage * (Years) * (1/45)
    let coefficient = 1 / 45;

    // Early retirement actuarial reduction coefficient according to age table (approximate table 5)
    if (reason === 'early') {
      if (applicantAge < 50) coefficient = 1 / 90;
      else if (applicantAge < 55) coefficient = 1 / 75;
      else if (applicantAge < 58) coefficient = 1 / 60;
      else coefficient = 1 / 50;
    }

    let calculatedPension = wage * yearsFloat * coefficient;

    // Maximum pension cannot exceed 80% of wage
    const maxPension = wage * 0.8;
    if (calculatedPension > maxPension) {
      calculatedPension = maxPension;
    }

    // Minimum pension guarantee
    let finalPension = calculatedPension;
    let raisedToMinimum = false;
    if (reason !== 'early' && calculatedPension < MIN_PENSION_LIMIT) {
      finalPension = MIN_PENSION_LIMIT;
      raisedToMinimum = true;
    }

    // Check early retirement conditions
    let earlyRetirementEligible = false;
    const earlyReasons: string[] = [];

    if (reason === 'early') {
      // 1. Duration check: 240 months (20 yrs) or 300 months (25 yrs from 2025)
      const requiredMonths = 300; // 25 years in 2025/2026
      if (totalMonths >= requiredMonths) {
        earlyReasons.push(`استيفاء مدة الاشتراك الفعلي المطلوبة (${requiredMonths / 12} سنة).`);
      } else {
        earlyReasons.push(`لم تستوف مدة الاشتراك الفعلي المطلوبة (لديك ${yearsFloat.toFixed(1)} سنة والمطلوب 25 سنة اشتراك فعلي).`);
      }

      // 2. Pension >= 50% of settlement wage
      const fiftyPercentWage = wage * 0.5;
      if (calculatedPension >= fiftyPercentWage) {
        earlyReasons.push(`المعاش المحسوب (${Math.round(calculatedPension)} ج.م) يحقق نسبة 50% على الأقل من أجر التسوية (${Math.round(fiftyPercentWage)} ج.م).`);
      } else {
        earlyReasons.push(`المعاش المحسوب (${Math.round(calculatedPension)} ج.م) أقل من 50% من أجر التسوية (${Math.round(fiftyPercentWage)} ج.م).`);
      }

      // 3. Pension >= 65% of minimum wage limit
      const sixtyFivePercentMinWage = MIN_CONTRIBUTION_WAGE * 0.65;
      if (calculatedPension >= sixtyFivePercentMinWage) {
        earlyReasons.push(`المعاش يتجاوز 65% من الحد الأدنى لأجر الاشتراك (${Math.round(sixtyFivePercentMinWage)} ج.م).`);
      } else {
        earlyReasons.push(`المعاش يقل عن 65% من الحد الأدنى لأجر الاشتراك.`);
      }

      earlyRetirementEligible =
        totalMonths >= requiredMonths &&
        calculatedPension >= fiftyPercentWage &&
        calculatedPension >= sixtyFivePercentMinWage;
    }

    // Grants calculations
    const deathGrant = Math.round(finalPension * 3); // 3 months pension
    const funeralExpenses = Math.round(finalPension * 3); // 3 months pension
    const daughterMarriageGrant = Math.round(finalPension * 12); // 12 months pension

    res.json({
      wage,
      totalMonths,
      yearsFloat: Number(yearsFloat.toFixed(1)),
      calculatedPension: Math.round(calculatedPension),
      finalPension: Math.round(finalPension),
      maxPension: Math.round(maxPension),
      raisedToMinimum,
      minPensionLimit: MIN_PENSION_LIMIT,
      earlyRetirement: {
        eligible: earlyRetirementEligible,
        criteriaLogs: earlyReasons,
      },
      grants: {
        deathGrant,
        funeralExpenses,
        daughterMarriageGrant,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Setup Vite in Dev or Static files in Production
const isVercel = Boolean(process.env.VERCEL);
const isProd = process.env.NODE_ENV === 'production' || isVercel;

if (!isVercel) {
  const PORT = Number(process.env.PORT) || 3000;
  if (isProd) {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${PORT}`);
    });
  } else {
    // Dynamic import to avoid bundling Vite inside production serverless functions
    const vitePkg = 'vite';
    import(vitePkg).then(async ({ createServer }) => {
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server listening on http://0.0.0.0:${PORT}`);
      });
    }).catch((err) => {
      console.error('Failed to initialize Vite dev server:', err);
    });
  }
}

export default app;
