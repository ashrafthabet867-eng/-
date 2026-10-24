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
  stepNumber: number;
  totalSteps: number;
  clipTitle: string;
  title: string;
  signDescription: string;
  handMovement: string;
  motionInstruction: string;
  rightHandGuide: string;
  leftHandGuide: string;
  facialExpression: string;
  keyNotice: string;
  durationSeconds: number;
  highlightWords: string[];
  visualIcon: string;
  badgeText: string;
  diagramImage: string;
  gestureType: 'cross_chest' | 'push_forward' | 'count_years' | 'draw_rect' | 'sign_exit' | 'stamp_eagle' | 'ring_finger' | 'cheer_blessing' | 'twelve_months' | 'comfort_heart' | 'shares_table' | 'heirs_tree' | 'typing_computer' | 'id_card' | 'seal_stamp' | 'chin_touch' | 'age_ladder' | 'monthly_pension';
  legalArticle?: string;
}

/**
 * يحلل نص الإجابة ويستخرج فقط الإشارة الدقيقة المتطابقة مع سؤال وموضوع المواطن
 * مقسمة إلى ٣ مقاطع منفصلة ومبسطة جداً، وكافة التوضيحات باللغة العربية الخالصة
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

  // بناء 3 مقاطع منفصلة ومبسطة جداً لكل موضوع
  switch (bestTopic) {
    case 'early_retirement':
      return [
        {
          id: 'early_retire_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: حركة تقاطع اليدين على الصدر',
          title: 'حركة تقاطع اليدين على الصدر',
          motionInstruction: 'ضع كفيك متقاطعين على الصدر مع إمالة الرأس قليلاً للأسفل.',
          rightHandGuide: 'اليد اليمنى تستقر على الصدر الأيسر',
          leftHandGuide: 'اليد اليسرى تستقر على الصدر الأيمن',
          signDescription: 'وضع اليدين متقاطعتين على الصدر للدلالة على طلب التوقف عن العمل قبل السن.',
          handMovement: 'تقاطع الذراعين بثبات على منتصف الصدر',
          facialExpression: 'ملامح تأكيد وهدوء وجدية',
          keyNotice: 'المعنى: طلب الخروج على المعاش المبكر قبل بلوغ سن الستين.',
          durationSeconds: 5,
          highlightWords: ['معاش مبكر', 'تقاطع اليدين', 'طلب التقاعد'],
          visualIcon: '⏳',
          badgeText: 'المعاش المبكر',
          diagramImage: '/assets/sign_early_retire.jpg',
          gestureType: 'cross_chest',
          legalArticle: 'المادة 21 بند 6 من القانون 148',
        },
        {
          id: 'early_retire_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: حركة دفع الكفين للأمام (إنهاء العمل)',
          title: 'حركة دفع الكفين للأمام',
          motionInstruction: 'ادفع كفيك المفتوحين للأمام في خط مستقيم إشارة للتوقف عن العمل.',
          rightHandGuide: 'الكف الأيمن مفتوح يدفع للأمام بحسم',
          leftHandGuide: 'الكف الأيسر موازٍ للكف الأيمن بحركة متزامنة',
          signDescription: 'حركة بسط ودفع الكفين للأمام للتعبير عن إنهاء الخدمة والانفصال عن العمل.',
          handMovement: 'دفع الكفين للأمام بحركة قطع أفقية تعني التوقف التام',
          facialExpression: 'ملامح حسم وتأكيد على عدم وجود عمل آخر',
          keyNotice: 'المعنى: التوقف الفعلي عن العمل وعدم الخضوع لتأمين آخر.',
          durationSeconds: 5,
          highlightWords: ['إنهاء العمل', 'دفع الكفين', 'التوقف التام'],
          visualIcon: '🛑',
          badgeText: 'إنهاء الخدمة',
          diagramImage: '/assets/sign_early_retire.jpg',
          gestureType: 'push_forward',
          legalArticle: 'شرط عدم ممارسة عمل',
        },
        {
          id: 'early_retire_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: إشارة شرط 25 سنة اشتراك فعلي',
          title: 'إشارة الـ 25 سنة اشتراك فعلي',
          motionInstruction: 'أظهر رقم 25 بأصابع يديك ثم المس معصم يدك اليسرى.',
          rightHandGuide: 'اليد اليمنى تلمس معصم اليد اليسرى (رمز سنين العمل)',
          leftHandGuide: 'اليد اليسرى مبسوطة يظهر عليها المعصم وسنين الاشتراك',
          signDescription: 'إشارة الأرقام 25 سنة (300 شهر) اشتراك فعلي بدون مدد مشتراة.',
          handMovement: 'إظهار رقم 25 بالأصابع ولمس المعصم كالساعة الزمنية',
          facialExpression: 'تأكيد قوي على استيفاء المدة القانونية',
          keyNotice: 'المعنى: 25 سنة اشتراك فعلي (300 شهر) بدون شراء مدد تسوية.',
          durationSeconds: 5,
          highlightWords: ['25 سنة', '300 شهر', 'اشتراك فعلي'],
          visualIcon: '📅',
          badgeText: 'شرط 25 سنة',
          diagramImage: '/assets/sign_early_retire.jpg',
          gestureType: 'count_years',
          legalArticle: 'المادة 21 بند 6',
        },
      ];

    case 'form_6':
      return [
        {
          id: 'form6_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: رسم مستطيل الاستمارة بالهواء',
          title: 'رسم مستطيل استمارة (6)',
          motionInstruction: 'ارسم مستطيلاً في الهواء بسبابتيك للدلالة على النموذج الورقي الرسمي.',
          rightHandGuide: 'السبابة اليمنى ترسم الضلع العلوي والأيمن',
          leftHandGuide: 'السبابة اليسرى ترسم الضلع السفلي والأيسر',
          signDescription: 'رسم حدود النموذج الورقي المعتمد لاستمارة نهاية الخدمة.',
          handMovement: 'حركة رسم مستطيل دقيقة ومتطابقة بالسبابتين',
          facialExpression: 'نظرة تركيز ومتابعة لرسم الورقة في الهواء',
          keyNotice: 'المعنى: استمارة (6) الرسمية لإثبات إنهاء خدمة الموظف.',
          durationSeconds: 5,
          highlightWords: ['استمارة 6', 'نموذج رسمي', 'رسم الورقة'],
          visualIcon: '📄',
          badgeText: 'استمارة 6',
          diagramImage: '/assets/sign_form6.jpg',
          gestureType: 'draw_rect',
          legalArticle: 'قرار 2437 لسنة 2021',
        },
        {
          id: 'form6_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: إشارة الرقم 6 بالأصابع',
          title: 'إشارة الرقم (6) باليدين',
          motionInstruction: 'ارفع كف يدك اليمنى كاملاً (5) مع إصبع واحد باليد اليسرى (1).',
          rightHandGuide: 'اليد اليمنى ترفع 5 أصابع مفتوحة',
          leftHandGuide: 'اليد اليسرى ترفع إصبع السبابة فقط (المجموع 6)',
          signDescription: 'تشكيل الرقم 6 بوضوح للإشارة لرقم استمارة س6 التأمينية.',
          handMovement: 'رفع الأصابع أمام الصدر مباشرة لسهولة الرؤية',
          facialExpression: 'ملامح وضوح وثقة',
          keyNotice: 'المعنى: التأكيد على استمارة رقم 6 المخصصة للاستقالة أو إنهاء الخدمة.',
          durationSeconds: 5,
          highlightWords: ['رقم 6', 'س6 تأمينات', 'استقالة'],
          visualIcon: '🖐️',
          badgeText: 'رقم 6',
          diagramImage: '/assets/sign_form6.jpg',
          gestureType: 'sign_exit',
          legalArticle: 'النماذج المعتمدة',
        },
        {
          id: 'form6_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: حركة ختم النسر الرسمي',
          title: 'توثيق ختم النسر وعدم التوقيع على بياض',
          motionInstruction: 'اضرب باطن كفك المفتوح بقبضة يدك الأخرى دلالة على ختم النسر.',
          rightHandGuide: 'قبضة اليد اليمنى تنزل بقوة لدمغ الختم',
          leftHandGuide: 'كف اليد اليسرى مبسوط كالمستند الرسمي المعتمد',
          signDescription: 'حركة ختم النسر الرسمي واعتماد تاريخ إنهاء الخدمة رسمياً.',
          handMovement: 'ضرب باطن الكف بالقبضة بقوة وثبات مع إشارة الرفض للتوقيع على بياض',
          facialExpression: 'ملامح تحذيرية لحماية حقوق المؤمن عليه',
          keyNotice: 'المعنى: ختم الاستمارة بختم النسر الرسمي وتجنب التوقيع على بياض.',
          durationSeconds: 5,
          highlightWords: ['ختم النسر', 'توثيق معتمد', 'حماية قانونية'],
          visualIcon: '🛡️',
          badgeText: 'ختم النسر',
          diagramImage: '/assets/sign_form6.jpg',
          gestureType: 'stamp_eagle',
          legalArticle: 'حماية العامل من التوقيع على بياض',
        },
      ];

    case 'marriage_grant':
      return [
        {
          id: 'marriage_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: لمس إصبع البنصر (خاتم الزواج)',
          title: 'إشارة خاتم الزواج والدبلة',
          motionInstruction: 'المس إصبع البنصر بيدك اليسرى بإبهام وسبابة يدك اليمنى.',
          rightHandGuide: 'الإبهام والسبابة يمسكان مكان الخاتم',
          leftHandGuide: 'إصبع البنصر ممدود للإشارة للزواج الشرعي',
          signDescription: 'إشارة ارتداء خاتم الزواج دلالة على عقد قران الابنة أو الأخت.',
          handMovement: 'لمس دائري لموضع الدبلة في إصبع البنصر',
          facialExpression: 'ابتسامة واسعة واضحة جداً تدل على التهنئة الصادقة',
          keyNotice: 'المعنى: عقد القران الرسمي للابنة أو الأخت المستحقة للمعاش.',
          durationSeconds: 5,
          highlightWords: ['خاتم الزواج', 'عقد قران', 'الابنة المستحقة'],
          visualIcon: '💍',
          badgeText: 'خاتم الزواج',
          diagramImage: '/assets/sign_marriage_grant.jpg',
          gestureType: 'ring_finger',
          legalArticle: 'المادة 105 من القانون 148',
        },
        {
          id: 'marriage_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: بسط الكفين لأعلى (مباركة وفرحة)',
          title: 'حركة المباركة والفرح بالزواج',
          motionInstruction: 'ابسط كفيك المفتوحين للأعلى مع ابتسامة دافئة بمباركة الزواج.',
          rightHandGuide: 'الكف الأيمن يرتفع للأعلى بحركة مباركة هادئة',
          leftHandGuide: 'الكف الأيسر يرتفع للأعلى بالتوازي',
          signDescription: 'رفع الكفين مبسوطين تعبيراً عن التهنئة والفرحة بصرف المنحة.',
          handMovement: 'بسط الكفين للأعلى مع إيماءة رأس بالمباركة',
          facialExpression: 'فرحة واضحة وتهنئة كريمة',
          keyNotice: 'المعنى: استحقاق منحة نقدية استثنائية مباركة بمناسبة الزواج.',
          durationSeconds: 5,
          highlightWords: ['مباركة', 'تهنئة', 'منحة مالية'],
          visualIcon: '✨',
          badgeText: 'مباركة الزواج',
          diagramImage: '/assets/sign_marriage_grant.jpg',
          gestureType: 'cheer_blessing',
          legalArticle: 'حقوق المستحقين',
        },
        {
          id: 'marriage_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: إشارة صرف معاش سنة كاملة (12 شهراً)',
          title: 'صرف معاش 12 شهراً دفعة واحدة',
          motionInstruction: 'أظهر 12 إصبعاً (10 باليدين + 2) ثم اسحب كفيك نحو الصدر.',
          rightHandGuide: 'إشارة رقم 12 بالأصابع ثم سحب الكف كاستلام الشيك',
          leftHandGuide: 'مساعدة في إظهار رقم 12 وحركة القبض المالي',
          signDescription: 'إشارة استحقاق معاش سنة كاملة (12 شهراً) تصرف لمرة واحدة.',
          handMovement: 'إظهار 12 بالأصابع ثم حركة سحب الكفين للصدر',
          facialExpression: 'ملامح اطمئنان وثقة بالحق المالي',
          keyNotice: 'المعنى: المنحة تساوي معاش سنة كاملة (12 شهر) تصرف لمرة واحدة.',
          durationSeconds: 5,
          highlightWords: ['معاش 12 شهر', 'صرف فوري', 'حد أدنى 500 جنيه'],
          visualIcon: '💰',
          badgeText: 'معاش 12 شهر',
          diagramImage: '/assets/sign_marriage_grant.jpg',
          gestureType: 'twelve_months',
          legalArticle: 'اللائحة التنفيذية 2437',
        },
      ];

    case 'survivor_pension':
      return [
        {
          id: 'survivor_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: لمس الصدر ومواساة الوفاة',
          title: 'إشارة وفاة المؤمن عليه والمواساة',
          motionInstruction: 'ضع كف يدك اليمنى على الصدر واخفض رأسك برفق مواساة.',
          rightHandGuide: 'راحة اليد اليمنى تستقر برفق على القلب',
          leftHandGuide: 'اليد اليسرى منخفضة للأسفل بخشوع',
          signDescription: 'لمس الصدر تعبيراً عن الحزن والمواساة لأهل المؤمن عليه المتوفى.',
          handMovement: 'لمس لطيف للصدر مع إمالة الرأس للأسفل',
          facialExpression: 'ملامح تعاطف ومواساة دافئة ورجاء بالرحمة',
          keyNotice: 'المعنى: وفاة المؤمن عليه وانتقال حقوقه التأمينية لأسرته.',
          durationSeconds: 5,
          highlightWords: ['وفاة المؤمن عليه', 'المواساة', 'انتقال المعاش'],
          visualIcon: '🕊️',
          badgeText: 'المواساة والرحمة',
          diagramImage: '/assets/sign_death_survivor.jpg',
          gestureType: 'comfort_heart',
          legalArticle: 'المادة 98 من القانون 148',
        },
        {
          id: 'survivor_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: إشارة الأرملة والأبناء المستحقين',
          title: 'تحديد المستحقين (الأرملة والأولاد والوالدين)',
          motionInstruction: 'أشر لموضع الخاتم (الأرملة) ثم اخفض كفك لارتفاع الأطفال (الأبناء).',
          rightHandGuide: 'تشير للخاتم (الزوجة/الأرملة) ثم للأولاد القصر',
          leftHandGuide: 'تضم الكف نحو الصدر دلالة على كفالة الأسرة',
          signDescription: 'الإشارة لأفراد الأسرة المستحقين للمعاش طبقاً لصلة القرابة.',
          handMovement: 'إشارات متتالية للأرملة والأبناء والوالدين',
          facialExpression: 'اهتمام بحماية ورعاية الأيتام والأسرة',
          keyNotice: 'المعنى: استحقاق الأرملة والأبناء والبنات والوالدين للمعاش الشهري.',
          durationSeconds: 5,
          highlightWords: ['الأرملة', 'الأبناء', 'المستحقين'],
          visualIcon: '👨‍👩‍👧‍👦',
          badgeText: 'المستحقون للمعاش',
          diagramImage: '/assets/sign_death_survivor.jpg',
          gestureType: 'heirs_tree',
          legalArticle: 'المواد 99 إلى 104',
        },
        {
          id: 'survivor_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: حركة توزيع الأنصبة بجدول (7)',
          title: 'توزيع الأنصبة طبقاً لجدول 7 ومنحة الوفاة',
          motionInstruction: 'حرك كفيك يميناً ويساراً كتقسيم الحصص القانونية العادلة.',
          rightHandGuide: 'الكف الأيمن يقسم الحصص للأرملة والأولاد',
          leftHandGuide: 'الكف الأيسر يشير لـ 3 شهور منحة مصاريف الجنازة',
          signDescription: 'تقسيم الهواء بالكفين دلالة على توزيع جدول 7 وصرف منحة الوفاة.',
          handMovement: 'حركة مروحة بالكفين تعبر عن التوزيع الدقيق للأنصبة',
          facialExpression: 'ملامح عدالة واطمئنان على الحماية الاجتماعية',
          keyNotice: 'المعنى: توزيع المعاش بنسب محددة بجدول 7 وصرف مصاريف الجنازة والمنحة.',
          durationSeconds: 5,
          highlightWords: ['جدول 7', 'توزيع الأنصبة', 'منحة وفاة 3 شهور'],
          visualIcon: '⚖️',
          badgeText: 'توزيع الأنصبة',
          diagramImage: '/assets/sign_death_survivor.jpg',
          gestureType: 'shares_table',
          legalArticle: 'جدول رقم 7 المعتمد',
        },
      ];

    case 'insurance_printout':
    case 'work_injury':
      return [
        {
          id: 'printout_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: كتابة وسحب البرنت المميكن',
          title: 'استخراج بيان مدد الاشتراك المطبوع',
          motionInstruction: 'انقر بأصابعك كالكتابة على لوحة المفاتيح ثم اسحب يديك رأسياً.',
          rightHandGuide: 'نقر سريع بالأصابع كالكتابة على الحاسب',
          leftHandGuide: 'سحب متباعد للأسفل كشريط الورقة المطبوعة',
          signDescription: 'حركة نقر على لوحة المفاتيح ثم سحب شريط بيان المدد التأمينية.',
          handMovement: 'كتابة وسحب رأسي لبيان المدد المعتمد',
          facialExpression: 'تركيز ومتابعة دقيقة بالعينين',
          keyNotice: 'المعنى: استخراج البرنت التأميني المعتمد إلكترونياً من قاعدة البيانات.',
          durationSeconds: 5,
          highlightWords: ['برنت تأميني', 'بيان مدد', 'نظام مميكن'],
          visualIcon: '💻',
          badgeText: 'استخراج البرنت',
          diagramImage: '/assets/sign_insurance_printout.jpg',
          gestureType: 'typing_computer',
          legalArticle: 'المادة 7 من اللائحة 2437',
        },
        {
          id: 'printout_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: رسم مستطيل بطاقة الرقم القومي',
          title: 'مطابقة الرقم التأميني بالرقم القومي',
          motionInstruction: 'ارسم مستطيل البطاقة بالسبابتين وأشر للرقم القومي.',
          rightHandGuide: 'السبابة اليمنى ترسم نصف البطاقة ثم تشير للأرقام',
          leftHandGuide: 'السبابة اليسرى تكمل شكل بطاقة الرقم القومي',
          signDescription: 'رسم حدود البطاقة الشخصية والتأكيد على سريانها ومطابقتها.',
          handMovement: 'رسم مستطيل البطاقة بحجم صغير أمام الصدر',
          facialExpression: 'تأكيد على إحضار بطاقة الرقم القومي سارية',
          keyNotice: 'المعنى: ربط الرقم التأميني ببطاقة الرقم القومي السارية للمواطن.',
          durationSeconds: 5,
          highlightWords: ['الرقم القومي', 'بطاقة سارية', 'الرقم التأميني'],
          visualIcon: '🪪',
          badgeText: 'الرقم القومي',
          diagramImage: '/assets/sign_insurance_printout.jpg',
          gestureType: 'id_card',
          legalArticle: 'قواعد تسجيل الرقم التأميني',
        },
        {
          id: 'printout_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: اعتماد ختم النسر الرسمي',
          title: 'توثيق البرنت بختم النسر المعتمد',
          motionInstruction: 'اضرب باطن كفك المفتوح بقبضة يدك بقوة دلالة على الختم.',
          rightHandGuide: 'قبضة اليد اليمنى تنزل كدمغ ختم النسر',
          leftHandGuide: 'باطن الكف الأيسر مفتوح لتلقي الختم المعتمد',
          signDescription: 'دمغ الكف بقبضة اليد الأخرى كختم النسر المعتمد للجهات الحكومية.',
          handMovement: 'ضربة واضحة ومسموعة رمزياً لختم النسر الرسمي',
          facialExpression: 'ملامح ثقة ورسمية تامة',
          keyNotice: 'المعنى: ختم البرنت بختم النسر لتقديمه لأي جهة عمل أو مصلحة حكومية.',
          durationSeconds: 5,
          highlightWords: ['ختم النسر', 'بيان رسمي', 'مكتب التأمينات'],
          visualIcon: '🦅',
          badgeText: 'ختم النسر',
          diagramImage: '/assets/sign_insurance_printout.jpg',
          gestureType: 'seal_stamp',
          legalArticle: 'تعليمات اعتماد المستندات',
        },
      ];

    case 'pension_age':
    default:
      return [
        {
          id: 'pension_age_clip_1',
          stepNumber: 1,
          totalSteps: 3,
          clipTitle: 'المقطع الأول: لمس الذقن (السن والوقار واستحقاق المعاش)',
          title: 'إشارة سن المعاش القانوني والوقار',
          motionInstruction: 'المس ذقنك بسبابة يدك اليمنى بحركة دائرية هادئة.',
          rightHandGuide: 'السبابة اليمنى تلمس طرف الذقن بحركة دائرية',
          leftHandGuide: 'اليد اليسرى مستقرة بهدوء بجانب الجسم',
          signDescription: 'لمس الذقن بالسبابة تعبيراً عن بلوغ السن القانوني والشيخوخة المكرمة.',
          handMovement: 'لمس الذقن ثم قبض الكف نحو الصدر دلالة على الاستحقاق',
          facialExpression: 'ملامح وقار واحترام واطمئنان',
          keyNotice: 'المعنى: بلوغ السن النظامي للتقاعد واستحقاق المعاش الكامل.',
          durationSeconds: 5,
          highlightWords: ['سن المعاش', 'بلوغ السن', 'معاش الشيخوخة'],
          visualIcon: '🧓',
          badgeText: 'سن المعاش',
          diagramImage: '/assets/sign_pension_age.jpg',
          gestureType: 'chin_touch',
          legalArticle: 'المادة 21 من القانون 148',
        },
        {
          id: 'pension_age_clip_2',
          stepNumber: 2,
          totalSteps: 3,
          clipTitle: 'المقطع الثاني: حركة تصاعدية لتدرج رفع السن حتى 65',
          title: 'تدرج رفع سن التقاعد من 60 حتى 65 سنة',
          motionInstruction: 'حرك يدك اليمنى في خط مائل صاعد تدريجياً نحو المستقبل.',
          rightHandGuide: 'كف اليد يرتفع في خطوات صاعدة متتالية',
          leftHandGuide: 'اليد اليسرى تشير لسنة البداية (2032)',
          signDescription: 'حركة اليد في مسار مائل صاعد دلالة على تدرج رفع السن من 60 إلى 65.',
          handMovement: 'حركة سلم تصاعدي تبدأ من منتصف الصدر وترتفع لأعلى',
          facialExpression: 'ملامح شرح وتوضيح هادئ للمستقبل',
          keyNotice: 'المعنى: يبدأ رفع السن في يوليو 2032 (61 سنة) ليصل 65 سنة في 2040.',
          durationSeconds: 5,
          highlightWords: ['تدرج السن', '65 سنة', '2032 حتى 2040'],
          visualIcon: '📈',
          badgeText: 'تدرج السن',
          diagramImage: '/assets/sign_pension_age.jpg',
          gestureType: 'age_ladder',
          legalArticle: 'المادة 41 من القانون 148',
        },
        {
          id: 'pension_age_clip_3',
          stepNumber: 3,
          totalSteps: 3,
          clipTitle: 'المقطع الثالث: إشارة المعاش الشهري المستمر',
          title: 'استحقاق المعاش الشهري النظامي مدى الحياة',
          motionInstruction: 'حرك أصابعك كالعَدّ المالي مع قبض الكف نحو الصدر دورياً.',
          rightHandGuide: 'حركة قبض وبسط للأصابع كالعد المالي المتكرر',
          leftHandGuide: 'الكف الأيسر مفتوح تحت اليد اليمنى كحماية اجتماعية',
          signDescription: 'إشارة الصرف الدوري للمعاش في بداية كل شهر ميلادي مدى الحياة.',
          handMovement: 'عد الأصابع ثم ضم الكفين على الصدر بارتياح',
          facialExpression: 'ملامح أمان واطمئنان واستقرار مالي',
          keyNotice: 'المعنى: صرف المعاش شهرياً مدى الحياة وزيادته دورياً في يوليو.',
          durationSeconds: 5,
          highlightWords: ['معاش شهري', 'مدى الحياة', 'حماية اجتماعية'],
          visualIcon: '💳',
          badgeText: 'المعاش الشهري',
          diagramImage: '/assets/sign_pension_age.jpg',
          gestureType: 'monthly_pension',
          legalArticle: 'المادة 35 من القانون 148',
        },
      ];
  }
}
