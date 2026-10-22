/**
 * قاعدة بيانات لغة الإشارة المصرية (ESL) لمصطلحات وإجراءات التأمينات والمعاشات
 * مخصصة لمساعدة المواطنين من الصم وضعاف السمع وفقاً للقانون 148 لسنة 2019
 */

export interface SignTerm {
  id: string;
  term: string;
  category: 'pensions' | 'conditions' | 'documents' | 'grants' | 'numbers' | 'procedures';
  keywords: string[];
  signDescription: string;
  handMovement: string;
  facialExpression: string;
  visualIcon: string; // Emoji or SVG hint
  videoThumbnail: string;
  summary: string;
  steps: string[];
  officialLawRef?: string;
}

export const EGYPTIAN_SIGN_TERMS: SignTerm[] = [
  {
    id: 'early_retirement',
    term: 'المعاش المبكر',
    category: 'pensions',
    keywords: ['مبكر', 'المعاش المبكر', 'تقاعد مبكر', 'خروج معاش', '25 سنة', '300 شهر'],
    signDescription: 'إشارة اليدين متقاطعتين على الصدر ثم دفعهما للأمام للإشارة إلى إنهاء العمل مبكراً قبل السن المحدد، مع إشارة الزمن (ساعة اليد).',
    handMovement: 'اليد اليمنى تُشير للزمن (معصم اليد اليسرى) ثم حركة قطع أفقية تعني التوقف عن العمل قبل الأوان.',
    facialExpression: 'ملامح تأكيد وهدوء مع إيماءة الرأس للأسفل.',
    visualIcon: '⏳',
    videoThumbnail: '/assets/sign_early_retire.jpg',
    summary: 'طلب الخروج على المعاش قبل بلوغ سن الستين بشرط 25 سنة اشتراك فعلي.',
    steps: [
      '1. إشارة "العمل": كفان متقابلان بحركة طرق متبادلة.',
      '2. إشارة "التوقف": فتح الكف اليمنى وحركة قطع أفقية.',
      '3. إشارة "25 سنة": فتح اليدين للإشارة للرقم 25 ثم لمس المعصم.',
      '4. إشارة "القبول المالي": فرك الإبهام والسبابة (50% من الأجر).'
    ],
    officialLawRef: 'المادة (21) بند 6 من القانون 148 لسنة 2019'
  },
  {
    id: 'pension_age',
    term: 'سن المعاش القانوني (الشيخوخة)',
    category: 'pensions',
    keywords: ['سن المعاش', 'بلوغ السن', 'سن الشيخوخة', '60 سنة', '65 سنة', 'سن التقاعد'],
    signDescription: 'إشارة لمس الذقن للدلالة على السن والوقار ثم الإشارة لجدول زمني يرتفع تدريجياً.',
    handMovement: 'اليد اليمنى تلمس الذقن ثم ترتفع لأعلى في خط مائل مع الإشارة إلى رقم 60 ثم 65.',
    facialExpression: 'ملامح وقار واحترام مع ابتسامة خفيفة.',
    visualIcon: '🧓',
    videoThumbnail: '/assets/sign_pension_age.jpg',
    summary: 'بلوغ السن النظامي للتقاعد والحصول على المعاش الكامل (60 سنة ترتفع حتى 65).',
    steps: [
      '1. إشارة "السن": السبابة تلمس الذقن بحركة دائرية.',
      '2. إشارة "الاستحقاق": قبض الكف نحو الصدر.',
      '3. إشارة "المعاش الشهري": حركة قبض وبسط للأصابع كالعد المالي المتكرر.'
    ],
    officialLawRef: 'المادتان (21) و (41) واللائحة 2437 لسنة 2021'
  },
  {
    id: 'form_6',
    term: 'استمارة (6) - إنهاء الخدمة',
    category: 'documents',
    keywords: ['استمارة 6', 'س6', 'استمارة ستة', 'إنهاء خدمة', 'استقالة', 'فصل', 'ترك العمل'],
    signDescription: 'رسم مستطيل في الهواء للدلالة على الورقة/الاستمارة ثم رفع 6 أصابع، تليها إشارة الخروج من المنشأة.',
    handMovement: 'رسم مستطيل بالسبابتين، ثم إشارة الرقم (6) باليد، ثم حركة كف اليد من الداخل للخارج (خروج).',
    facialExpression: 'ملامح جدية وحزم للتأكيد على أهمية المستند.',
    visualIcon: '📄',
    videoThumbnail: '/assets/sign_form6.jpg',
    summary: 'النموذج الرسمي المعتمد الذي يقدمه صاحب العمل لإثبات نهاية خدمة الموظف.',
    steps: [
      '1. إشارة "مستند رسمي": رسم مستطيل بالأصابع في الهواء.',
      '2. إشارة "رقم 6": كف مفتوح (5) + إصبع من اليد الأخرى (1).',
      '3. إشارة "الختم": ضرب باطن الكف بقبضة اليد الأخرى كختم النسر.',
      '4. إشارة "الخروج": حركة اليد من الصدر للخارج بحسم.'
    ],
    officialLawRef: 'النماذج التنفيذية الصادرة بقرار 2437 لسنة 2021'
  },
  {
    id: 'insurance_printout',
    term: 'البرنت التأميني والرقم التأميني',
    category: 'documents',
    keywords: ['برنت', 'برنت تأميني', 'رقم تأميني', 'بيان مدد', 'مدد الاشتراك', 'سجل تأميني'],
    signDescription: 'إشارة كتابة على لوحة مفاتيح ثم إخراج ورقة مطبوعة طويلة مع الإشارة للرقم القومي.',
    handMovement: 'حركة نقر بالأصابع كالكتابة على الحاسب ثم سحب اليدين رأسياً كإخراج شريط ورقي مطبوع.',
    facialExpression: 'تركيز ومتابعة بالعينين لحركة سحب الورقة.',
    visualIcon: '🪪',
    videoThumbnail: '/assets/sign_insurance_printout.jpg',
    summary: 'بيان معتمد بختم النسر يوضح الرقم التأميني وتاريخ بدء ونهاية كافة مدد العمل.',
    steps: [
      '1. إشارة "كمبيوتر": حركة نقر سريعة بأصابع اليدين.',
      '2. إشارة "طباعة ورقة": سحب اليدين متباعدتين من أعلى لأسفل.',
      '3. إشارة "ختم النسر": دمغ الكف بقبضة اليد بقوة.',
      '4. إشارة "الأرقام": عد الأصابع إشارة لتسجيل المدد بالسنين.'
    ],
    officialLawRef: 'المادة (7) و (8) من اللائحة التنفيذية رقم 2437'
  },
  {
    id: 'survivor_pension',
    term: 'معاش الوفاة والورثة المستحقين',
    category: 'grants',
    keywords: ['وفاة', 'مستحقين', 'أرملة', 'أيتام', 'ابنة', 'معاش والدي', 'توزيع المعاش', 'جدول 7'],
    signDescription: 'إشارة الوفاة والرحمة (خفض اليدين برفق) ثم فتح الكفين كشجرة أفراد الأسرة المستحقين.',
    handMovement: 'خفض اليدين للأسفل بخشوع، ثم حركة توزيع مروحة بالكفين للإشارة لتوزيع الحصص على الأسرة.',
    facialExpression: 'ملامح مواساة وتعاطف ورجاء بالرحمة.',
    visualIcon: '🕊️',
    videoThumbnail: '/assets/sign_death_survivor.jpg',
    summary: 'انتقال المعاش للمستحقين عن المؤمن عليه المتوفى (أرملة، أبناء، بنات، والدين، إخوة).',
    steps: [
      '1. إشارة "المواساة": لمس الصدر برفق وإيماءة مواساة.',
      '2. إشارة "المستحقين": الإشارة للأرملة (طرحة/خاتم) والأبناء (خفض اليد للأرض).',
      '3. إشارة "توزيع الأنصبة": تقسيم الهواء بكف ممدود (جدول 7).',
      '4. إشارة "منحة الوفاة": عد 3 أصابع (أجر 3 شهور كاملة).'
    ],
    officialLawRef: 'المواد (98) إلى (108) وجدول رقم (7) من القانون 148'
  },
  {
    id: 'marriage_grant',
    term: 'منحة زواج الابنة أو الأخت',
    category: 'grants',
    keywords: ['منحة زواج', 'زواج', 'جواز', 'عقد قران', 'قسيمة زواج', 'قطع معاش'],
    signDescription: 'إشارة ارتداء خاتم الزواج (الدبلة) في إصبع البنصر ثم قبض اليد فرحاً والإشارة لمبلغ مالي.',
    handMovement: 'لمس إصبع البنصر الأيسر بالإبهام والسبابة الأيمن، ثم حركة بسط الكفين لأعلى بمباركة وسعادة.',
    facialExpression: 'ابتسامة واسعة واضحة مع إيماءة التهنئة والمباركة.',
    visualIcon: '💍',
    videoThumbnail: '/assets/sign_marriage_grant.jpg',
    summary: 'منحة مالية تعادل معاش سنة كاملة (12 شهراً) تصرف لمرة واحدة عند زواج الابنة أو الأخت.',
    steps: [
      '1. إشارة "المباركة والفرح": فتح الكفين ورفعهما مع ابتسامة.',
      '2. إشارة "الزواج": لمس مكان الخاتم (الدبلة) باليد اليسرى.',
      '3. إشارة "12 شهر": رفع أصابع اليدين (10) ثم إصبعين (2).',
      '4. إشارة "الصرف": مد الكف نحو الصدر لاستلام الشيك أو التحويل.'
    ],
    officialLawRef: 'المادة (105) من القانون 148 ولائحته التنفيذية 2437'
  },
  {
    id: 'work_injury',
    term: 'تأمين إصابة العمل والعجز',
    category: 'conditions',
    keywords: ['إصابة عمل', 'حادث', 'طريق العمل', 'عجز', 'قومسيون طبي', 'نسبة العجز', 'نموذج 111'],
    signDescription: 'إشارة الضربة المفاجئة على الساعد أو الكتف مع تعبير الألم ثم الإشارة للفحص الطبي.',
    handMovement: 'ضربة خفيفة بالكف على الساعد الآخر مع الإشارة بسماعة الطبيب على الصدر.',
    facialExpression: 'ملامح احتراز وتعاطف واهتمام بالصحة.',
    visualIcon: '🩹',
    videoThumbnail: '/assets/sign_insurance_printout.jpg',
    summary: 'حماية الموظف في حالة وقوع حادث بالعمل أو أثناء الذهاب والعودة، مع تعويض كامل.',
    steps: [
      '1. إشارة "الإصابة": لمس الساعد أو الذراع مع التعبير عن الألم.',
      '2. إشارة "الطريق أو المصنع": حركة السير بالسبابتين للأمام.',
      '3. إشارة "التقرير الطبي": رسم ورقة وإشارة الكشف بالعين.',
      '4. إشارة "التعويض": استحقاق المعاش أو نسبة العجز المقررة.'
    ],
    officialLawRef: 'الباب الخامس من القانون 148 لسنة 2019'
  },
  {
    id: 'irregular_workers',
    term: 'العمالة غير المنتظمة والمقاولات',
    category: 'procedures',
    keywords: ['عمالة غير منتظمة', 'يومية', 'مقاولات', 'صيادين', 'حرفيين', 'اشتراك 9%', 'جدول 2'],
    signDescription: 'إشارة العمل الحر المتنوع باليدين ثم الإشارة لدعم الدولة ودفع 9% فقط.',
    handMovement: 'حركة اليدين بالتناوب للعمل الحر، ثم الإشارة لرقم (9) مع حركة دفع جزء بسيط والدولة تتكفل بالباقي.',
    facialExpression: 'ملامح تشجيع ودعم وأمان اجتماعي.',
    visualIcon: '👷',
    videoThumbnail: '/assets/sign_early_retire.jpg',
    summary: 'تأمين شامل للعمال باليومية والحرفيين، يدفع المواطن 9% فقط والدولة تتحمل 12%.',
    steps: [
      '1. إشارة "العمل الحر": حركة اليدين المتنوعة كالبناء أو الصيد.',
      '2. إشارة "نسبة 9%": إظهار 9 أصابع مع حركة دفع جزء بسيط.',
      '3. إشارة "دعم الدولة": كف كبير يحمي كفاً أصغر دلالة على تحمل الخزانة العامة.',
      '4. إشارة "الأمان": ضم اليدين على الصدر بارتياح.'
    ],
    officialLawRef: 'المادة (2) بند رابعاً وجدول رقم (2) باللائحة 2437'
  }
];

export interface VisualSignSequenceItem {
  id: string;
  title: string;
  signDescription: string;
  handMovement: string;
  facialExpression: string;
  keyNotice: string;
  durationSeconds: number;
  highlightWords: string[];
  visualIcon: string;
  badgeText: string;
  diagramImage: string; // Specific dynamic gesture diagram for this topic/step
  legalArticle?: string;
}

/**
 * يحلل نص الإجابة ويستخرج فقط الإشارة الدقيقة المتطابقة مع سؤال وموضوع المواطن
 * دون تكرار إشارات لمواضيع أخرى غير مطلوبة
 */
export function generateSignSequenceFromText(botResponse: string): VisualSignSequenceItem[] {
  const text = (botResponse || '').toLowerCase();

  // نظام حساب النقاط لاختيار موضوع السؤال الفعلي بدقة
  const scores: Record<string, number> = {
    early_retirement: 0,
    form_6: 0,
    marriage_grant: 0,
    survivor_pension: 0,
    insurance_printout: 0,
    pension_age: 0,
    work_injury: 0,
  };

  // 1. المعاش المبكر
  if (text.includes('مبكر')) scores.early_retirement += 12;
  if (text.includes('25 سنة') || text.includes('300 شهر')) scores.early_retirement += 10;
  if (text.includes('تقاعد مبكر') || text.includes('خروج معاش مبكر')) scores.early_retirement += 12;
  if (text.includes('50% من أجر') || text.includes('تسوية المعاش المبكر')) scores.early_retirement += 8;

  // 2. استمارة 6 وإنهاء الخدمة
  if (text.includes('استمارة 6') || text.includes('س6') || text.includes('استمارة ستة')) scores.form_6 += 15;
  if (text.includes('استقالة') || text.includes('إنهاء خدمة') || text.includes('فصل تعسفي') || text.includes('ترك العمل')) scores.form_6 += 8;

  // 3. منحة الزواج
  if (text.includes('منحة زواج') || text.includes('منحة الزواج')) scores.marriage_grant += 15;
  if (text.includes('زواج') || text.includes('عقد قران') || text.includes('قسيمة زواج')) scores.marriage_grant += 6;
  if (text.includes('عروس') || text.includes('ابنة') || text.includes('أخت')) scores.marriage_grant += 4;

  // 4. معاش الوفاة والورثة والمستحقين
  if (text.includes('وفاة') || text.includes('متوفى') || text.includes('وفاه')) scores.survivor_pension += 10;
  if (text.includes('ورثة') || text.includes('مستحقين') || text.includes('أرملة') || text.includes('أيتام') || text.includes('جدول 7')) scores.survivor_pension += 8;
  if (text.includes('منحة وفاة') || text.includes('مصاريف جنازة')) scores.survivor_pension += 10;

  // 5. البرنت التأميني والأرقام
  if (text.includes('برنت') || text.includes('برنت تأميني')) scores.insurance_printout += 15;
  if (text.includes('رقم تأميني') || text.includes('بيان مدد') || text.includes('سجل تأميني')) scores.insurance_printout += 8;

  // 6. إصابة العمل والعجز
  if (text.includes('إصابة عمل') || text.includes('حادث عمل') || text.includes('عجز')) scores.work_injury += 12;

  // 7. سن المعاش القانوني وتدرجه
  if (text.includes('سن 60') || text.includes('سن 65') || text.includes('تدرج السن') || text.includes('سن الشيخوخة') || text.includes('بلوغ السن') || text.includes('يوليو 2032')) scores.pension_age += 12;
  if (text.includes('سن المعاش') || text.includes('سن التقاعد')) scores.pension_age += 8;

  // العثور على الموضوع الأقوى تطابقاً
  let bestTopic = 'default';
  let highestScore = 0;
  for (const [topic, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // بناء تسلسل مخصص فقط للموضوع المطلوب دون إقحام مواضيع أخرى
  switch (bestTopic) {
    case 'early_retirement':
      return [
        {
          id: 'early_retire_1',
          title: 'إشارة: المعاش المبكر (إنهاء الخدمة مبكراً)',
          signDescription: 'وضع اليدين متقاطعتين على الصدر ثم دفعهما للأمام بحركة قطع أفقية تعني التوقف عن العمل قبل السن.',
          handMovement: 'اليد اليمنى تُشير للزمن (معصم اليد) ثم حركة قطع أفقية بكف اليد اليمنى.',
          facialExpression: 'ملامح تأكيد وهدوء مع إيماءة الرأس للأسفل.',
          keyNotice: 'المعاش المبكر: إنهاء الخدمة قبل بلوغ سن الستين القانوني.',
          durationSeconds: 5,
          highlightWords: ['معاش مبكر', 'إنهاء خدمة', 'قبل الستين'],
          visualIcon: '⏳',
          badgeText: 'المعاش المبكر',
          diagramImage: '/assets/sign_early_retire.jpg',
          legalArticle: 'المادة 21 بند 6 من القانون 148',
        },
        {
          id: 'early_retire_2',
          title: 'إشارة: شرط 25 سنة اشتراك فعلي (300 شهر)',
          signDescription: 'فتح اليدين لإظهار رقم 25 (أصابع اليدين 10 + 10 + 5) ثم الإشارة لمعصم اليد للدلالة على مدة السنوات.',
          handMovement: 'إشارة 25 سنة كاملة + فرك الإبهام والسبابة دلالة على استحقاق 50% من أجر التسوية كحد أدنى.',
          facialExpression: 'تأكيد وحزم على شرط المدة الفعلية بدون شراء مدد.',
          keyNotice: 'الشرط الحاسم لعام 2025: 25 سنة اشتراك فعلي كاملة بدون انقطاع.',
          durationSeconds: 5,
          highlightWords: ['25 سنة', '300 شهر', 'اشتراك فعلي'],
          visualIcon: '📜',
          badgeText: 'شرط الـ 25 سنة',
          diagramImage: '/assets/sign_early_retire.jpg',
          legalArticle: 'شروط الاستحقاق 2025',
        },
      ];

    case 'form_6':
      return [
        {
          id: 'form6_1',
          title: 'إشارة: استمارة 6 تأمينات (إنهاء الخدمة)',
          signDescription: 'رسم مستطيل في الهواء بالسبابتين دلالة على الورقة/الاستمارة ثم رفع 6 أصابع (كف كامل + إصبع).',
          handMovement: 'رسم مستطيل بالسبابتين، ثم إشارة الرقم 6، تليها حركة كف اليد من الصدر للخارج.',
          facialExpression: 'ملامح جدية وحزم للتأكيد على أهمية النموذج الرسمي.',
          keyNotice: 'استمارة (6): المستند الرسمي لإثبات نهاية خدمة الموظف أو الاستقالة.',
          durationSeconds: 5,
          highlightWords: ['استمارة 6', 'إنهاء الخدمة', 'الاستقالة'],
          visualIcon: '📄',
          badgeText: 'استمارة 6',
          diagramImage: '/assets/sign_form6.jpg',
          legalArticle: 'قرار 2437 لسنة 2021',
        },
        {
          id: 'form6_2',
          title: 'إشارة: اعتماد ختم النسر وعدم التوقيع على بياض',
          signDescription: 'ضرب باطن الكف بقبضة اليد الأخرى كختم النسر مع إشارة الرفض الصارم للتوقيع على بياض.',
          handMovement: 'حركة الختم المعتمد على راحة اليد ثم إشارة النفي والتنبيه بالسبابة.',
          facialExpression: 'ملامح تحذير واهتمام بحقوق المؤمن عليه.',
          keyNotice: 'تحذير تأميني: يجب اعتماد الاستمارة بختم المنشأة والتأمينات وعدم التوقيع على بياض مطلقاً.',
          durationSeconds: 5,
          highlightWords: ['ختم النسر', 'اعتماد رسمي', 'حماية قانونية'],
          visualIcon: '🛡️',
          badgeText: 'توثيق المستند',
          diagramImage: '/assets/sign_form6.jpg',
          legalArticle: 'حماية حقوق العامل',
        },
      ];

    case 'marriage_grant':
      return [
        {
          id: 'marriage_1',
          title: 'إشارة: منحة زواج الابنة أو الأخت',
          signDescription: 'لمس إصبع البنصر الأيسر بمكان خاتم الزواج (الدبلة)، ثم بسط الكفين لأعلى بابتسامة ومباركة.',
          handMovement: 'الإبهام والسبابة يلمسان إصبع البنصر باليد الأخرى، ثم رفع الكفين بمباركة وسعادة.',
          facialExpression: 'ابتسامة واسعة واضحة جداً تدل على التهنئة الصادقة والمباركة.',
          keyNotice: 'منحة الزواج: حق مالي يمنح لمرة واحدة للابنة أو الأخت المستحقة للمعاش عند عقد قرانها.',
          durationSeconds: 5,
          highlightWords: ['منحة زواج', 'عقد قران', 'الابنة المستحقة'],
          visualIcon: '💍',
          badgeText: 'منحة الزواج',
          diagramImage: '/assets/sign_marriage_grant.jpg',
          legalArticle: 'المادة 105 من القانون 148',
        },
        {
          id: 'marriage_2',
          title: 'إشارة: قيمة المنحة (معاش 12 شهراً كاملاً)',
          signDescription: 'رفع أصابع اليدين (10) ثم إصبعين (2) للدلالة على 12 شهراً، تليها حركة سحب المعاش نحو الصدر.',
          handMovement: 'إشارة رقم 12 بالأصابع ثم حركة قبض الكف دلالة على صرف المبلغ دفعة واحدة.',
          facialExpression: 'ملامح اطمئنان وفرحة بالاستحقاق المالي.',
          keyNotice: 'قيمة المنحة تساوي معاش سنة كاملة (12 شهراً) بحد أدنى 500 جنيه، ولا تسقط إلا بعد 5 سنوات.',
          durationSeconds: 5,
          highlightWords: ['معاش سنة', '12 شهراً', 'صرف فوري'],
          visualIcon: '💰',
          badgeText: 'معاش 12 شهر',
          diagramImage: '/assets/sign_marriage_grant.jpg',
          legalArticle: 'اللائحة التنفيذية 2437',
        },
      ];

    case 'survivor_pension':
      return [
        {
          id: 'survivor_1',
          title: 'إشارة: وفاة المؤمن عليه ومعاش الورثة',
          signDescription: 'خفض اليدين برفق مع إمالة الرأس مواساة، ثم لمس الصدر تعبيراً عن الرحمة والمواساة.',
          handMovement: 'خفض اليدين للأسفل بخشوع ثم حركة مواساة على الصدر.',
          facialExpression: 'ملامح مواساة وتعاطف دافئ مع أفراد الأسرة.',
          keyNotice: 'معاش الوفاة: انتقال الحق المالي للورثة المستحقين (الأرملة، الأبناء، البنات، الوالدين).',
          durationSeconds: 5,
          highlightWords: ['وفاة المؤمن عليه', 'حقوق الورثة', 'الأرملة والأبناء'],
          visualIcon: '🕊️',
          badgeText: 'معاش الورثة',
          diagramImage: '/assets/sign_death_survivor.jpg',
          legalArticle: 'المادة 98 من القانون 148',
        },
        {
          id: 'survivor_2',
          title: 'إشارة: توزيع الأنصبة وتأمين الأسرة (جدول 7)',
          signDescription: 'حركة توزيع مروحة بالكفين للإشارة لتوزيع الحصص الشرعية والقانونية على الأسرة.',
          handMovement: 'تقسيم الهواء بالكف الممدود دلالة على جدول 7 وتوزيع المعاش ومنحة الوفاة (3 شهور).',
          facialExpression: 'ملامح أمان واطمئنان لحماية حقوق الأسرة.',
          keyNotice: 'توزيع المعاش يتم بنسب قانونية دقيقة بجدول 7 تكفل الحماية الاجتماعية لكافة المستحقين.',
          durationSeconds: 5,
          highlightWords: ['جدول 7', 'توزيع الأنصبة', 'منحة وفاة 3 شهور'],
          visualIcon: '👨‍👩‍👧‍👦',
          badgeText: 'توزيع الأنصبة',
          diagramImage: '/assets/sign_death_survivor.jpg',
          legalArticle: 'جدول رقم (7) المعتمد',
        },
      ];

    case 'insurance_printout':
    case 'work_injury':
      return [
        {
          id: 'printout_1',
          title: 'إشارة: استخراج البرنت التأميني المعتمد',
          signDescription: 'حركة نقر سريعة بالأصابع كالكتابة على الحاسب ثم سحب اليدين رأسياً كإخراج شريط ورقي مطبوع.',
          handMovement: 'نقر الأصابع (كمبيوتر) ثم سحب اليدين متباعدتين من أعلى لأسفل (طباعة ورقة بيان مدد).',
          facialExpression: 'تركيز ومتابعة بالعينين لحركة سحب الورقة.',
          keyNotice: 'البرنت التأميني: بيان معتمد بختم النسر يوضح كامل مدد وسنوات اشتراكك التأمينية.',
          durationSeconds: 5,
          highlightWords: ['برنت تأميني', 'بيان مدد', 'مدد الاشتراك'],
          visualIcon: '🪪',
          badgeText: 'البرنت التأميني',
          diagramImage: '/assets/sign_insurance_printout.jpg',
          legalArticle: 'المادة 7 من اللائحة 2437',
        },
        {
          id: 'printout_2',
          title: 'إشارة: الرقم التأميني وختم النسر الرسمي',
          signDescription: 'رسم مستطيل بطاقة الرقم القومي ثم ضرب الكف بقبضة اليد الأخرى كختم النسر الرسمي.',
          handMovement: 'رسم البطاقة بالسبابتين، ثم دمغ الكف المفتوح بقبضة اليد بقوة.',
          facialExpression: 'ملامح تأكيد على ضرورة ختم المستند من مكتب التأمينات.',
          keyNotice: 'يجب أن يكون البرنت التأميني مختوماً بختم النسر ومطابقاً لبطاقة الرقم القومي السارية.',
          durationSeconds: 5,
          highlightWords: ['الرقم التأميني', 'ختم النسر', 'بطاقة سارية'],
          visualIcon: '📁',
          badgeText: 'توثيق الرقم القومي',
          diagramImage: '/assets/sign_insurance_printout.jpg',
          legalArticle: 'إجراءات مكتب التأمينات',
        },
      ];

    case 'pension_age':
    default:
      return [
        {
          id: 'pension_age_1',
          title: 'إشارة: سن المعاش القانوني (الشيخوخة)',
          signDescription: 'لمس الذقن بالسبابة للدلالة على السن والوقار ثم قبض الكف نحو الصدر دلالة على استحقاق المعاش.',
          handMovement: 'السبابة تلمس الذقن بحركة دائرية ثم حركة عد مالي بالأصابع إشارة للمعاش الشهري.',
          facialExpression: 'ملامح وقار واحترام واطمئنان.',
          keyNotice: 'سن المعاش: بلوغ السن القانوني يمنح المواطن الحق في المعاش التقاعدي الكامل.',
          durationSeconds: 5,
          highlightWords: ['سن المعاش', 'بلوغ السن', 'المعاش الكامل'],
          visualIcon: '🧓',
          badgeText: 'سن المعاش',
          diagramImage: '/assets/sign_pension_age.jpg',
          legalArticle: 'المادة 21 من القانون 148',
        },
        {
          id: 'pension_age_2',
          title: 'إشارة: تدرج رفع السن من 60 حتى 65 سنة',
          signDescription: 'حركة اليد في مسار مائل صاعد تدريجياً للإشارة لرفع سن التقاعد شهراً بعد شهر حتى 65 سنة في 2040.',
          handMovement: 'كف اليد يرتفع في خطوات تصاعدية متتالية تعبر عن التدرج الزمني بدءاً من عام 2032.',
          facialExpression: 'ملامح توضيح وشرح هادئ.',
          keyNotice: 'السن الحالي 60 سنة، ويبدأ الرفع التدريجي ليصل 61 سنة في 2032 حتى يكتمل عند 65 سنة في 2040.',
          durationSeconds: 5,
          highlightWords: ['تدرج السن', '65 سنة', '2032 إلى 2040'],
          visualIcon: '📈',
          badgeText: 'تدرج سن التقاعد',
          diagramImage: '/assets/sign_pension_age.jpg',
          legalArticle: 'المادة 41 من القانون 148',
        },
      ];
  }
}
