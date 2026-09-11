export const ar = {
  app: {
    title: "Fares Hub",
    description: "لوحة التحكم الشخصية لفارس — تتبع الجيم، التغذية، والأنشطة",
  },
  auth: {
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "لوحة فارس الشخصية",
    usernameLabel: "اسم المستخدم",
    usernamePlaceholder: "fares",
    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    loginButton: "دخول",
    loggingIn: "جاري التحقق...",
    invalidCredentials: "اسم المستخدم أو كلمة المرور غير صحيحة",
    rateLimitExceeded: "تم تجاوز عدد المحاولات المسموح بها. برجاء الانتظار 15 دقيقة.",
    logout: "تسجيل الخروج",
  },
  nav: {
    today: "اليوم",
    workout: "التمارين",
    nutrition: "التغذية",
    activities: "الأنشطة والجدول",
    progress: "التقدم والتحليلات",
    settings: "الإعدادات",
    more: "المزيد",
  },
  home: {
    subtitle: "جاهز لتمرين ولا وجبة النهاردة؟",
    sections: {
      workout: {
        title: "برنامج التمرين",
        desc: "البرنامج القادم والجلسات الحالية وجدول التسخين",
        cta: "عرض التمارين",
      },
      nutrition: {
        title: "السعرات والماكروز",
        desc: "تسجيل الوجبات وتتبع استهلاك البروتين والسعرات",
        cta: "عرض التغذية",
      },
      activities: {
        title: "الجدول والأنشطة",
        desc: "المواعيد اليومية، البلوكات الزمنية، والتذكيرات",
        cta: "عرض الجدول",
      },
    },
    quickStats: {
      weightUnitNote: "وحدات الأوزان K و B معتمدة بدون تحويل",
    },
  },
  theme: {
    toggle: "تبديل المظهر",
    dark: "الوضع الليلي",
    light: "الوضع النهاري",
  },
  errors: {
    generic: "حصل خطأ غير متوقع، برجاء المحاولة لاحقاً",
    unauthorized: "غير مصرح لك بالدخول، برجاء تسجيل الدخول أولاً",
  },
} as const;

export type Translations = typeof ar;
