import React, { useState, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  FilePlus, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  FileText, 
  Loader2, 
  AlertCircle,
  TableProperties
} from 'lucide-react';
import { LegalDocument } from '../types';

interface LegalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  standardDocs: LegalDocument[];
  customDocs: LegalDocument[];
  onAddDocument: (doc: Partial<LegalDocument>) => Promise<void>;
  onDeleteCustomDoc: (id: string) => Promise<void>;
  onUploadPdf: (pdfBase64: string, fileName: string, defaultCategory: string) => Promise<any>;
}

export const LegalDocsModal: React.FC<LegalDocsModalProps> = ({
  isOpen,
  onClose,
  standardDocs,
  customDocs,
  onAddDocument,
  onDeleteCustomDoc,
  onUploadPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload-pdf' | 'add'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Manual Document Form State
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [category, setCategory] = useState<any>('pensions');
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [docsText, setDocsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // PDF Upload State
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfCategory, setPdfCategory] = useState<string>('pensions');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const allDocs = [...standardDocs, ...customDocs];

  const filteredDocs = allDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fullText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setPdfUploadError('يرجى اختيار ملف PDF حصراً.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setPdfUploadError('حجم ملف الـ PDF يتجاوز 50 ميجابايت.');
      return;
    }

    setSelectedPdfFile(file);
    setPdfUploadError(null);
  };

  const handleProcessPdf = async () => {
    if (!selectedPdfFile) return;

    setIsUploadingPdf(true);
    setPdfUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];

          await onUploadPdf(base64Data, selectedPdfFile.name, pdfCategory);

          setSuccessMsg(`تمت قراءة وفهرسة ملف "${selectedPdfFile.name}" بنجاح وتضمينه في ذاكرة المستشار!`);
          setSelectedPdfFile(null);
          if (pdfInputRef.current) pdfInputRef.current.value = '';

          setTimeout(() => {
            setSuccessMsg('');
            setActiveTab('browse');
          }, 1500);
        } catch (err: any) {
          console.error(err);
          setPdfUploadError(err.message || 'فشل في تحليل وفهرسة ملف الـ PDF');
        } finally {
          setIsUploadingPdf(false);
        }
      };

      reader.onerror = () => {
        setPdfUploadError('حدث خطأ أثناء قراءة الملف من جهازك.');
        setIsUploadingPdf(false);
      };

      reader.readAsDataURL(selectedPdfFile);
    } catch (err: any) {
      setPdfUploadError(err.message || 'حدث خطأ غير متوقع');
      setIsUploadingPdf(false);
    }
  };

  const handleSubmitNewDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fullText) return;
    setIsSubmitting(true);
    try {
      const conditions = conditionsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const requiredDocs = docsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await onAddDocument({
        title,
        number: number || 'مستند إداري / كتاب دوري',
        category,
        summary: summary || title,
        fullText,
        conditions,
        requiredDocs,
      });

      setSuccessMsg('تمت إضافة المستند بنجاح! تم تضمينه فوراً في قاعدة المعرفة القانونية للبوت.');
      setTitle('');
      setNumber('');
      setSummary('');
      setFullText('');
      setConditionsText('');
      setDocsText('');
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('browse');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'pensions':
        return 'المعاشات وبلوغ السن';
      case 'early_retirement':
        return 'المعاش المبكر';
      case 'survivors':
        return 'المستحقون وتوزيع المعاش';
      case 'contributions':
        return 'نسب الاشتراكات والعمالة';
      case 'grants':
        return 'المنح والتعويضات';
      case 'work_injury':
        return 'إصابات العمل والمرض';
      case 'forms':
        return 'النماذج والاستمارات الرسمية';
      case 'tables':
        return 'الجداول التأمينية الرسمية';
      default:
        return 'لوائح وقرارات';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                مكتبة نصوص القانون 148 ولائحته 2437 والجداول والـ PDF
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                الهيئة القومية للتأمين الاجتماعي - المرجعية التشريعية الإلزامية للمستشار
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 px-3 sm:px-4 pt-3 bg-slate-50 flex-wrap">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'browse'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>نصوص القانون والجداول المعتمدة ({allDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload-pdf')}
            className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload-pdf'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-800">📄 رفع نسخة PDF من القانون أو اللائحة</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'add'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إضافة نص أو كتاب دوري يدوياً</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="m-4 mb-0 bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: BROWSE DOCUMENTS & TABLES */}
          {activeTab === 'browse' && (
            <>
              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث برقم المادة أو بالكلمة (مثلاً: اللائحة 2437، جدول 5، جدول 7، استمارة 6، معاش مبكر)..."
                    className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                >
                  <option value="all">كافة المواد والتصنيفات ({allDocs.length})</option>
                  <option value="tables">الجداول التأمينية الرسمية (1، 2، 5، 7)</option>
                  <option value="forms">النماذج والاستمارات الرسمية (1، 2، 6...)</option>
                  <option value="pensions">المعاشات وتدرج سن المعاش</option>
                  <option value="early_retirement">المعاش المبكر وضوابط 2025</option>
                  <option value="survivors">المستحقون وتوزيع المعاش والجمع</option>
                  <option value="grants">المنح والتعويضات (زواج، وفاة، جنازة)</option>
                  <option value="contributions">نسب الاشتراكات والعمالة</option>
                  <option value="work_injury">إصابات العمل والمرض</option>
                </select>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {filteredDocs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">لا توجد مواد أو مستندات تطابق بحثك.</p>
                  </div>
                ) : (
                  filteredDocs.map((doc) => {
                    const isExpanded = expandedDocId === doc.id;
                    const isCustom = doc.id.startsWith('custom-');

                    return (
                      <div
                        key={doc.id}
                        className="border border-slate-200 rounded-xl p-4 bg-white hover:border-emerald-300 transition-all shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <span className="font-bold text-emerald-800 text-xs sm:text-sm bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                {doc.number}
                              </span>
                              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                {getCategoryLabel(doc.category)}
                              </span>
                              {isCustom && (
                                <span className="text-[11px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200 font-bold">
                                  📄 مستند PDF / مخصص
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{doc.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {doc.summary}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isCustom && (
                              <button
                                onClick={() => onDeleteCustomDoc(doc.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="حذف هذا المستند"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer font-medium"
                            >
                              <span>{isExpanded ? 'طي النص' : 'عرض النص الكامل'}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Full Text */}
                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 text-xs sm:text-sm animate-fadeIn">
                            <div>
                              <span className="font-bold text-slate-700 block mb-1">
                                النص القانوني والتشريعي الكامل:
                              </span>
                              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-line leading-relaxed font-mono text-[11px] sm:text-xs">
                                {doc.fullText}
                              </div>
                            </div>

                            {doc.conditions && doc.conditions.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-700 block mb-1">الشروط الواجبة:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                                  {doc.conditions.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {doc.requiredDocs && doc.requiredDocs.length > 0 && (
                              <div>
                                <span className="font-bold text-slate-700 block mb-1">المستندات والأوراق المطلوبة:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60">
                                  {doc.requiredDocs.map((d, i) => (
                                    <li key={i}>{d}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {/* TAB 2: UPLOAD & PROCESS PDF OF LAW 148 / REG 2437 / CIRCULARS */}
          {activeTab === 'upload-pdf' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-950 text-xs sm:text-sm shadow-xs">
                <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <span className="text-sm">قانون 148 ولائحته 2437 وجداوله مدمجة بالفعل وجاهزة 100%!</span>
                </div>
                <p className="text-emerald-800 leading-relaxed text-xs">
                  نصوص <strong>قانون التأمينات رقم 148 لسنة 2019</strong> واللائحة التنفيذية رقم <strong>2437 لسنة 2021</strong> وكافة الجداول الرسمية (1، 2، 5، 7) 
                  <strong> مدمجة ومفهرسة مسبقاً بالكامل</strong> في ذاكرة المستشار في تبويب <strong>«نصوص القانون والجداول المعتمدة»</strong>.
                  لست بحاجة لرفع ملف القانون مرة أخرى؛ يمكنك سؤاله مباشرة في الشات وسيجيبك بدقة المواد الرسمية.
                </p>
                <div className="mt-2.5 text-[11px] text-emerald-900 font-semibold bg-emerald-100/80 border border-emerald-200 rounded-xl px-3 py-1.5 inline-block">
                  💡 هذا القسم مخصص للكتب الدورية الجديدة أو القرارات الوزارية الخاصة الملحقة (ملفات PDF حتى 20-30 صفحة).
                </div>
              </div>

              {pdfUploadError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-950 p-3.5 rounded-2xl flex flex-col gap-2 text-xs sm:text-sm shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <span>تنبيه بشأن فحص الملف:</span>
                  </div>
                  <p className="text-rose-800 leading-relaxed text-xs font-medium">
                    {pdfUploadError}
                  </p>
                  <p className="text-[11px] text-slate-700 bg-white/90 p-2 rounded-xl border border-rose-200">
                    ℹ️ إذا كان الملف الذي تحاول رفعه هو ملف القانون 148 أو اللائحة 2437، فهو مدمج بالفعل في النظام ومتاح في التبويب الأول، ويمكنك الاستفسار عن أي مادة أو جدول فوراً في المحادثة.
                  </p>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onClick={() => pdfInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base block">
                    {selectedPdfFile ? selectedPdfFile.name : 'اضغط لاختيار ملف PDF من جهازك'}
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {selectedPdfFile
                      ? `الحجم: ${(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} ميجابايت (جاهز للتحليل)`
                      : 'يدعم ملفات PDF للقانون، اللائحة التنفيذية 2437، الجداول التأمينية، والقرارات حتى 50 ميجابايت'}
                  </span>
                </div>
                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={handlePdfFileSelect}
                  accept="application/pdf"
                  className="hidden"
                />
              </div>

              {/* Options & Process Button */}
              {selectedPdfFile && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      التصنيف المقترح لمحتوى الـ PDF:
                    </label>
                    <select
                      value={pdfCategory}
                      onChange={(e) => setPdfCategory(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                    >
                      <option value="pensions">نصوص القانون واللائحة التنفيذية 2437 لسنة 2021</option>
                      <option value="tables">الجداول التأمينية الرسمية (الجداول 1، 2، 5، 7، 9)</option>
                      <option value="early_retirement">المعاش المبكر وضوابط 2025</option>
                      <option value="survivors">المستحقون وتوزيع المعاش والجمع</option>
                      <option value="contributions">نسب الاشتراكات والعمالة غير المنتظمة والأجور</option>
                      <option value="forms">النماذج والاستمارات الرسمية</option>
                      <option value="grants">المنح والتعويضات</option>
                      <option value="work_injury">إصابات العمل والمرض</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessPdf}
                    disabled={isUploadingPdf}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isUploadingPdf ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جارٍ قراءة وفحص ملف الـ PDF واستخراج المواد القانونية والجداول...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                        <span>بدء فحص وتضمين الـ PDF في ذاكرة المستشار بالذكاء الاصطناعي</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD TEXT / CIRCULAR MANUALLY */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmitNewDoc} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    عنوان الوثيقة أو المادة:
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: قرار وزاري بشأن زيادة الحدود التأمينية"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم المادة أو القرار:
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="مثلاً: مادة 21 مكرر أو قرار 2437 لسنة 2021"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="pensions">المعاشات وبلوغ السن</option>
                  <option value="early_retirement">المعاش المبكر</option>
                  <option value="survivors">المستحقون والأنصبة</option>
                  <option value="contributions">نسب الاشتراكات والعمالة</option>
                  <option value="tables">الجداول التأمينية</option>
                  <option value="forms">النماذج والاستمارات</option>
                  <option value="grants">المنح والتعويضات</option>
                  <option value="work_injury">إصابات العمل والمرض</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الموجز التنفيذي:</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="ملخص في سطرين عن أهم ما ورد بالقرار"
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  النص القانوني والتشريعي الكامل:
                </label>
                <textarea
                  required
                  rows={4}
                  value={fullText}
                  onChange={(e) => setFullText(e.target.value)}
                  placeholder="اكتب النص القانوني الكامل ببنوده وفقراته..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 bg-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الشروط الواجبة (شرط في كل سطر):
                  </label>
                  <textarea
                    rows={3}
                    value={conditionsText}
                    onChange={(e) => setConditionsText(e.target.value)}
                    placeholder="شرط 1&#10;شرط 2"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المستندات والأوراق المطلوبة (مستند في كل سطر):
                  </label>
                  <textarea
                    rows={3}
                    value={docsText}
                    onChange={(e) => setDocsText(e.target.value)}
                    placeholder="صورة بطاقة الرقم القومي&#10;شهادة ميلاد كمبيوتر"
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارٍ الحفظ والتضمين في الذاكرة...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>حفظ وتضمين في قاعدة المعرفة القانونية</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
