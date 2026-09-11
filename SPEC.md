# لوحة فارس الشخصية (Fares Hub) — PRD كامل (نسخة الويب v1.0)

> اسم المشروع "Fares Hub" مؤقت — غيّره زي ما تحب، هو مجرد placeholder جوا الكود والدوكيومنت.
> الملف ده هو المرجع الكامل. `AGENTS.md` في الروت هو ملخصه اللي الـ agent بيقراه كل مرة.

---

## 0) الرؤية والمبادئ

موقع شخصي **لمستخدم واحد بس (فارس)**، مش منتج تجاري. بيجاوب على سؤال واحد في كل مرة تفتحه:
**"محتاج أعمل إيه دلوقتي؟"** — سواء جيم، أكل، مهمة، أو مراجعة تقدم.

المبادئ اللي كل قرار تقني في الملف ده بيرجع لها:
1. **شخصي أولاً، AI ثانيًا، بيانات دايمًا.** مفيش ميزة تتبنى على حساب صحة البيانات.
2. **الموقع لازم يفضل شغال حتى لو الـ AI اتقفل أو النت قطع.** الجيم والأكل والتاريخ من غير AI أصلاً.
3. **مفيش رقم بيتحط من غير ما فارس يكتبه بنفسه.** لا أهداف سعرات، لا تمارين مقترحة تلقائيًا، لا "نصايح صحية".
4. **التاريخ مقدّس.** جلسة اتقفلت متتغيرش. برنامج اتعدل بياخد نسخة جديدة.
5. **بياناتك عندك.** SQLite على جهازك، باك أب دوري، تصدير كامل في أي وقت من غير ما تستنى حد.

---

## 1) تحليل نقدي: ليه موقع مش تطبيق موبايل، وإيه اللي اتغيّر من البرومبت الأصلي

راجعت البرومبت الطويل اللي بعتهولي (نسخة Expo/React Native على Replit) بالكامل. الأفكار والقواعد الهندسية فيه (خصوصًا قسم الأوزان، الـ warm-up engine، ونظام الإصدارات) **ممتازة وهنقلها زي ما هي** — المشكلة كانت بس في اختيار المنصة (موبايل) اللي بقت مش مناسبة للفكرة الجديدة (موقع). الجدول ده بيوضح كل قرار اتغيّر وليه:

| المحور | النسخة القديمة (موبايل) | النسخة الجديدة (ويب) | السبب |
|---|---|---|---|
| المنصة | Expo + React Native + EAS Build | Next.js (PWA) | وصول فوري من أي متصفح/جهاز، تحديث لحظي من غير App Store review أو build جهاز |
| التخزين | SQLite على الجهاز نفسه (offline-first حقيقي) | SQLite على السيرفر (home server)، الموقع بيتاح منه | عايز تدخل من الموبايل واللابتوب في نفس الوقت وتلاقي نفس البيانات — التخزين على الجهاز مش هيعمل sync لوحده |
| الشخصية الكرتونية (Rive/Lottie) | موجودة كوحدة كاملة (قسم 31) | **اتشالت من الـ MVP** | تكلفة هندسية عالية لميزة تجميلية، مش أولوية لموقع بتعتمد عليه فعليًا. ممكن ترجع Phase 7 كـ badge بسيط لو حبيت |
| Voice capture + AI categorization | Record → Transcribe → AI يقترح تصنيف | **مُبسّطة**: نص/صورة يدوي بس في MVP، الـ AI categorization يتأجل | تعقيد إضافي (mic access، transcription pipeline) مش لازم في أول نسخة |
| HealthKit | Phase 6 كاملة | **محذوفة بالكامل** | خاصة بـ iOS نيتيف، مفيش مقابل ويب مباشر |
| Local push notifications (iOS) | expo-notifications | **Web Push + خيار Telegram عبر [[Hermes Agent]]** | عندك أصلاً agent شغال على تليجرام، التنبيهات هناك هتوصلك أضمن من browser push |
| الأمان | "device-bound shared secret" لتطبيق موبايل مغلق | Session auth عادي + الموقع أصلاً خلف Tailscale (شبكة خاصة) | المنصة اتغيرت فالتهديد اتغير — مفيش app store attack surface، لكن فيه browser/network surface بديل |
| الـ AI chat/memory الكامل (أقسام 18-22، 34) | جزء أساسي من Phase 4 | **نُقلت لـ Phase مستقبلية اختيارية (قسم 16 هنا)** | مش مطلوبة صراحة في الطلب الحالي؛ الأولوية جيم + سعرات + أنشطة أولاً |

كل حاجة تانية (نموذج الأوزان، الـ warm-up engine، الجدول اليومي، دوران البرامج، catalog التمارين، الـ versioning) **اتنقلت بنفس المنطق تقريبًا حرفيًا** — هي صح بغض النظر عن المنصة. هتلاقيها في قسم 5.

---

## 2) اختيار التكنولوجيا

### 2.1 الإطار الأساسي (Frontend + Backend)

| الخيار | الإيجابيات | السلبيات |
|---|---|---|
| **Next.js 15 (App Router) — ✅ الموصى بيه** | فريم ورك واحد للـ frontend والـ backend، أكتر تكنولوجيا مدعومة في أي AI coding agent (يعني Antigravity هيطلع كود أنضف وأقل أخطاء)، PWA سهل، React زي التلات مشاريع اللي بنيتهم قبل كده (Auto Car، Tawla، Elshinawy) | لسه محتاج تتعلم الـ App Router patterns لو أول مرة |
| React SPA (Vite) + Node/Express منفصل | نفس نمط مشاريعك الأوفلاين بالظبط (Electron→Web) | مشروعين منفصلين لحاجة واحدة، تعقيد deployment زيادة من غير داعي |
| SvelteKit | أخف وأسرع runtime | مجتمع أصغر، الـ AI agents بتنتج كود Svelte أقل جودة مقارنة بـ React |
| ASP.NET Core + Angular (زي شغلك في FODWA) | بتستخدم أقوى سكيلاتك، Clean Architecture مباشر | تقيل لمشروع شخصي سريع، سيرفر .NET على لابتوب قديم أثقل من Node، عدد سطور الكود أكتر لنفس النتيجة |

**القرار: Next.js 15 App Router + TypeScript (strict).** بيدمج الاتنين في مشروع واحد، وبيقلل الـ moving parts لمشروع بتبنيه لوحدك بمساعدة agent.

### 2.2 قاعدة البيانات + ORM

| الخيار | الإيجابيات | السلبيات |
|---|---|---|
| **SQLite + Drizzle ORM (better-sqlite3) — ✅ الموصى بيه** | نفس الـ driver اللي استخدمته في Auto Car System، ملف واحد = باك أب بسيط (نسخ ملف بس)، صفر إعداد سيرفر DB منفصل، مثالي لمستخدم واحد | لو قررت مستقبلًا تستضيف على Railway، الـ filesystem مؤقت هناك فالملف مش آمن — لازم Postgres وقتها |
| SQLite + Prisma | migrations DX أنضف شوية | أتقل runtime، أبطأ cold start، مش ضروري لحجم المشروع ده |
| Postgres + Prisma/Drizzle | لو عايز تستضيف Cloud من الأول (Railway، عندك خبرة بيه) | تعقيد إضافي (سيرفر DB منفصل) مش مبرر لمستخدم واحد وأنت أصلاً عندك home server |

**القرار: SQLite + Drizzle.** لو يومًا قررت الانتقال لـ Railway بدل الاستضافة الذاتية، وقتها بس بدّل لـ Postgres (Drizzle بيدعم الاتنين بنفس الـ API تقريبًا، الانتقال مش مكلف).

### 2.3 UI / Styling / Charts

| الطبقة | الاختيار | ليه |
|---|---|---|
| Styling | Tailwind CSS v4 | نفس التوجه اللي استخدمته في Elshinawy Store (dark theme + RTL) |
| Component library | shadcn/ui (فوق Radix) | مكونات جاهزة قابلة للتعديل بالكامل (مش black-box زي MUI)، بتنسجم مع أي دizيان تختاره |
| Charts | Tremor | مبني خصيصًا لـ dashboards شخصية زي دي، فوق Recharts، تكامل مباشر مع Tailwind |
| Icons | lucide-react | خفيف، مجاني، بيتكامل مباشر مع shadcn |

### 2.4 Auth

| الخيار | القرار |
|---|---|
| NextAuth / Auth.js | ❌ over-engineering لمستخدم واحد — فيه providers وflows إنت مش محتاجها |
| Clerk / Supabase Auth | ❌ خدمة خارجية لبيانات إنت عايزها تفضل عندك بس |
| **Auth مخصص بسيط — ✅** | argon2 hash لباسورد واحد مسجل في `.env` أو جدول `settings`، session token موقّع (HMAC) في HTTP-only cookie، مفيش refresh tokens معقدة. ~80-100 سطر كود بالكامل، مفهومة 100% ليك |

### 2.5 الاستضافة (Hosting)

| الخيار | الإيجابيات | السلبيات |
|---|---|---|
| **Home server (اللابتوب القديم Ubuntu) + Tailscale — ✅ الأساسي** | مجاني، خصوصية كاملة، السيرفر والشبكة أصلاً مظبوطين عندك (static IP + Tailscale شغالين فعلاً)، ملف SQLite دايم موجود | لازم اللابتوب يفضل شغال ومتصل بالنت طول الوقت — لو قفل/النت قطع، الموقع مش هيرد |
| Railway (عندك خبرة، هجّرت مشروع .NET عليه قبل كده) | uptime أعلى، وصول من أي مكان بدون VPN client | تكلفة شهرية بسيطة (~$5)، والـ persistent SQLite file محتاج Postgres بدله |
| Vercel | ❌ مش مناسب | الـ serverless functions عندهم filesystem مؤقت — SQLite هيتمسح كل deploy. مناسب بس لو الـ DB خارجية تمامًا |

**القرار: ابدأ بالـ home server + Tailscale Serve** (تفاصيل التنفيذ في قسم 7). لو بعد كام شهر لقيت الـ uptime مش مريحك، الخطوة التالية جاهزة: Railway + Postgres، والتحويل مش هيكلفك إعادة بناء — Drizzle schema هتتغير سطرين بس.

---

## 3) المعمارية

```
Browser (phone / laptop)
        │  HTTPS عبر Tailscale (.ts.net)
        ▼
┌─────────────────────────────────────────┐
│  Next.js App (PM2 process على home server)│
│                                           │
│  app/            → Routes (React Server  │
│                     Components + Route    │
│                     Handlers للـ API)     │
│  src/ui/          → Design system +      │
│                      shadcn components   │
│  src/features/    → workout / nutrition /│
│                      activities / progress│
│                      / settings          │
│  src/domain/       → pure logic: weight  │
│                      parser, warm-up     │
│                      engine, rotation,   │
│                      progress calc       │
│                      (صفر React imports) │
│  src/data/         → Drizzle schema +    │
│                      migrations +        │
│                      repositories        │
│  src/server/       → auth, session,      │
│                      middleware          │
│  src/lib/          → zod schemas, utils  │
└─────────────────────────────────────────┘
        │
        ▼
   fares-hub.db  (SQLite file, WAL mode)
        │
        ▼  cron نايتلي
   backup/*.zip → private repo / Drive
```

**قاعدة Clean-Architecture-lite:** `src/domain/` ممنوع يستورد React أو Next أبدًا — دوال pure قابلة للاختبار لوحدها. `src/data/` (repositories) هي الطبقة الوحيدة اللي بتلمس DB مباشرة. الـ UI بينادي على repositories/domain عبر Server Actions أو Route Handlers، مش بيلمس Drizzle مباشرة.

### هيكل المجلدات (starter)

```
fares-hub/
├── AGENTS.md
├── docs/
│   └── SPEC.md
├── data/
│   └── gym-data.json
├── .agents/
│   └── rules/            # قواعد إضافية تفصيلية لو احتجت تقسيمها لاحقًا
├── app/
│   ├── (auth)/login/
│   ├── (app)/
│   │   ├── page.tsx              # Home / Today
│   │   ├── workout/
│   │   ├── nutrition/
│   │   ├── activities/
│   │   ├── progress/
│   │   └── settings/
│   └── api/                      # Route Handlers لو احتجتها بدل Server Actions
├── src/
│   ├── ui/
│   ├── features/
│   │   ├── workout/
│   │   ├── nutrition/
│   │   ├── activities/
│   │   └── progress/
│   ├── domain/
│   │   ├── weight-parser.ts
│   │   ├── warmup-engine.ts
│   │   ├── program-rotation.ts
│   │   └── progress-calc.ts
│   ├── data/
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── migrations/
│   │   └── repositories/
│   ├── server/
│   │   └── auth.ts
│   └── i18n/
├── public/
│   ├── manifest.json
│   └── sw.js
├── drizzle.config.ts
├── .env.example
└── package.json
```

---

## 4) نموذج البيانات (الجداول الأساسية)

مأخوذة ومُكيّفة من نسختك الأصلية (قسم 29)، اتشالت منها بس الجداول المرتبطة بـ HealthKit والشخصية الكرتونية:

`UserProfile`, `Session` (auth)، `ScheduleBlock`, `WeeklySplit`, `Exercise`, `WorkoutProgram`, `WorkoutProgramExercise`, `WorkoutSession`, `PerformedSet`, `WarmupRule`, `WarmupOverride`, `ActivationSession`, `Meal`, `NutritionTarget`, `Reminder`, `Note` (بديل Capture المبسط)، `Media`, `DailyActivity`, `ProgressSnapshot`, `BodyMetric`, `AppSettings`.

كل الجداول: `id` (uuid)، foreign keys بالـ ID، timestamps UTC + عرض بتوقيت القاهرة، مفيش duplicated name strings (زي ما اتقال في نسختك الأصلية بالظبط).

مثال Drizzle schema لجزء الأوزان (باقي الجداول بنفس النمط، تتبني تدريجيًا في الـ phases):

```typescript
// src/data/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),              // slug ثابت: db_shoulder_press
  displayName: text("display_name").notNull(),
  aliases: text("aliases", { mode: "json" }).$type<string[]>().default([]),
  tutorialUrl: text("tutorial_url"),
  personalNotes: text("personal_notes"),
});

export const performedSets = sqliteTable("performed_sets", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  exerciseId: text("exercise_id").notNull(),
  setNumber: integer("set_number").notNull(),
  type: text("type", { enum: ["warmup", "working"] }).notNull(),
  targetReps: text("target_reps"),
  actualReps: integer("actual_reps"),
  // الوزن بيتخزن كـ JSON عشان نحافظ على rawWeight + unitTag سوا
  targetWeight: text("target_weight", { mode: "json" }).$type<WeightValue>(),
  actualWeight: text("actual_weight", { mode: "json" }).$type<WeightValue>(),
  completed: integer("completed", { mode: "boolean" }).default(false),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
});

export type WeightValue = {
  rawWeight: string;       // "57K" زي ما اتكتبت بالظبط
  numericValue: number;    // 57 — للحساب بس، أبدًا يتعرض لوحده
  unitTag: string;         // "K" | "B" | أي حاجة تانية — معتمة
  isUnitConfirmed: boolean;
};
```

---

## 5) قواعد الدومين المنقولة (نفس منطق نسختك الأصلية تقريبًا حرفيًا)

القواعد دي هي أهم حاجة في المشروع كله — هندستها صح من الأول في نسختك القديمة، هنا بس نفس المنطق:

### 5.1 قاعدة الأوزان
- الوزن بيتخزن **دايمًا** كـ object `{ rawWeight, numericValue, unitTag, isUnitConfirmed }` — أبدًا رقم عادي أو نص عادي.
- `K` و`B` **علامات معتمة (opaque)** من نظامك الشخصي. ممنوع تتحول لكجم/رطل/بلايتس. ممنوع أي تخمين لمعناها.
- `numericValue` يتفسّر للحساب بس (نسب، فروق، أرقام قياسية) — أبدًا يتعرض لوحده في الـ UI.
- الـ UI دايمًا بتعرض `rawWeight` ("57K").
- أي حساب (warm-up %، فروق تقدم، أرقام قياسية، رسم بياني) **مسموح بس بين قيم بنفس الـ unitTag لنفس التمرين**.
- لو الـ tags مختلفة، اعرض series منفصلة في أي رسم بياني — أبدًا تجميع أو مقارنة عبرهم.
- التقريب: لأقرب 0.5 افتراضيًا، قابل للتعديل per-exercise من الإعدادات.
- شاشة إعدادات "Weight Notation" فارس بيحدد فيها معنى K وB لكل تمرين لو حب — ده اللي بيفعّل `isUnitConfirmed = true`. لحد ما يحصل، الموقع بيعرض الـ tag زي ما هو من غير ما يدّعي وحدة.

### 5.2 محرك الإحماء (Warm-up Engine)
جدول التوليد ثابت (من بياناتك الحقيقية، `data/gym-data.json`):

| قيمة heating | نتيجة |
|---|---|
| `"0"` | مفيش warm-up sets |
| `"1"` | set واحد: ~60% × 3-6 reps |
| `"1-2"` | 2 sets: ~50% × 3-6، بعدين ~75-80% × 3 |
| `"1-3"` | 3 sets: ~50% × 3-6، بعدين ~75-80% × 3، بعدين ~85-90% × 1-3 |

النسب بتتطبق على الـ working weight لنفس التمرين (باحترام قاعدة 5.1). كل warm-up set قابل للتعديل جوا الجلسة، والتعديل بيتخزن كـ override خاص بالتمرين. الـ warm-up sets بتتسجل بـ `type = "warmup"` ومُستبعدة من الأرقام القياسية.

### 5.3 مؤقت الراحة (Rest Timer)
`restRange` بيتحول لـ `{ minMinutes, maxMinutes } | null`:
`"3-5"` → `{min:3, max:5}` | `"-"` → `null` | `"0"` → `null` (label: "غير محدد").
الوحدة **دقايق** دايمًا (الافتراض الوحيد المسموح، ومكتوب هنا صراحة). المؤقت بيبدأ من `minMinutes`، بيعلّم عند `maxMinutes`، ويكمل عدّ بعدها. أزرار +30s / -30s / Skip. لو `null`، اعرض stopwatch حر مش countdown.

### 5.4 كتالوج التمارين والـ aliases
جدول `exercises` منفصل قبل أي برنامج. البرامج بترجع لـ `exerciseId` بس، أبدًا اسم خام جوا صف البرنامج. الـ duplicates المعروفة من بياناتك اتدمجت فعلاً في `data/gym-data.json` (LegExtension→leg_extension، Upperback Row→upper_back_row، Low Incline DB Pres→low_incline_db_press، إلخ).

### 5.5 دوران البرامج
`WeeklySplit`: Anterior A → Posterior A → Anterior B → Posterior B، بيدور. "تمرين اليوم" = البرنامج التالي في الدورة، وبيتقدّم بس لما جلسة تتقفل (completed). تفويت يوم **مايقدمش** الدورة. فارس يقدر يغيّر برنامج اليوم يدويًا في أي وقت.

### 5.6 نسخ البرامج (Program Versioning)
أي تعديل (وزن، reps، sets، heating، rest، إضافة/حذف/إعادة ترتيب تمرين) بيعمل `programVersion + 1`. الجلسات القديمة تفضل مربوطة بالنسخة اللي كانت وقتها (snapshot عند بداية الجلسة). اعرض diff بسيط "إيه اللي اتغيّر" قبل الحفظ. **مفيش auto-progression ومفيش auto-deload أبدًا** — القرار بايد فارس بس.

### 5.7 الجلسات (Append-Only)
`WorkoutSession` + `PerformedSet` — append-only بالكامل. Autosave بعد كل set. لو اتقفل التاب/الموقع في نص جلسة، اعرض "استكمال الجلسة" عند الرجوع. جلسة من غير نشاط لأكتر من 12 ساعة بتتعلّم "abandoned" تلقائيًا لكن بتفضل محفوظة.

### 5.8 الأرقام القياسية والتقدم
Personal best = working sets بس، أعلى `numericValue`، التعادل يتكسر بعدد الـ reps. أي مقارنة لازم تحترم قاعدة 5.1 (نفس الـ tag بس). النصوص وصفية بس: "50K × 7 مقابل 45K × 8 آخر مرة" — أبدًا "بقيت أقوى" كنتيجة. أقل من نقطتين بيانات → "مفيش بيانات كفاية لسه".

---

## 6) الأمان والدخول (Auth)

- تسجيل دخول واحد فقط (username/password ثابتين، الباسورد hash بـ argon2id — نفس المكتبة اللي استخدمتها في Auto Car System v2).
- Session token: HMAC-signed، HTTP-only، Secure، SameSite=Lax cookie، مدة صلاحية طويلة (أسبوعين مثلاً) مع تجديد تلقائي عند الاستخدام.
- كل route جوا `app/(app)/` وكل server action خلف middleware بيتأكد من الـ session قبل أي حاجة.
- بما إن الموقع أصلاً خلف Tailscale (شبكة خاصة، مش عام على الإنترنت)، طبقة الـ auth دي defense-in-depth مش الخط الدفاعي الوحيد — لكن لازم تفضل موجودة، خصوصًا لو يومًا فعّلت Tailscale Funnel (وصول عام) أو دخلت من جهاز مش موثوق.
- Rate limiting بسيط على `/login` (5 محاولات / 15 دقيقة) كافي لمستخدم واحد.
- `.env` فيه: `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `DATABASE_PATH`. ملف `.env.example` بقيم placeholder بس، الحقيقي أبدًا يتعمله commit.

---

## 7) الاستضافة والنشر (خطوات فعلية على السيرفر بتاعك)

السيرفر عندك (Ubuntu، 192.168.170.5، Tailscale مفعّل) جاهز فعليًا لخطوة الاستضافة من غير أي إعداد إضافي تقريبًا:

```bash
# على السيرفر
git clone <repo> fares-hub && cd fares-hub
npm install
npm run build

# PM2 (بدل Docker، زي ما هو مفضّل عندك)
npm i -g pm2
pm2 start npm --name fares-hub -- start
pm2 startup            # يخلي PM2 يشتغل تلقائي بعد أي reboot
pm2 save

# الوصول الآمن عبر Tailscale (مفيش حاجة لـ Nginx/Caddy أصلًا)
tailscale serve https / http://localhost:3000
```

بعدها الموقع بيبقى متاح على `https://<اسم-الجهاز>.<tailnet>.ts.net` — HTTPS جاهز تلقائيًا من Tailscale، من أي جهاز مسجل على نفس الـ tailnet بتاعك (موبايلك، لابتوبك) من غير ما تفتح أي port للإنترنت العام.

**لو حبيت وصول من جهاز مش على الـ tailnet:** `tailscale funnel` بدل `serve` (بيفتح وصول عام محدود)، لكن ده اختياري ومش لازم في البداية.

### الباك أب (cron يومي)
```bash
# /etc/cron.d/fares-hub-backup — الساعة 3 صباحًا يوميًا
0 3 * * * fares zip -r /backups/fares-hub-$(date +\%F).zip /home/fares/fares-hub/data/fares-hub.db /home/fares/fares-hub/uploads
```
احتفظ بآخر 14 نسخة محليًا + ارفع نسخة أسبوعية لـ Google Drive أو private GitHub repo (rclone أو git، أيهما أسهل عليك). اعرض تاريخ آخر باك أب في شاشة Settings ونبّه لو أقدم من 14 يوم.

---

## 8) الصفحات (Pages)

| الصفحة | المحتوى الأساسي |
|---|---|
| **Home / اليوم** | التحية، الـ ScheduleBlock الحالي، الجيم النهارده لو في وقته، ملخص سريع (جيم/أكل/تذكيرات)، CTA واحد بس ("جيم يبدأ بعد 42 دقيقة → ابدأ") |
| **Workout — القائمة** | البرامج الأربعة، مين الدور عليه، تاريخ آخر مرة اتعمل فيها كل واحد |
| **Workout — تفاصيل البرنامج** | التمارين، الأوزان، الـ sets/reps، زرار تعديل (بيفتح نسخة جديدة) |
| **Active Workout** | شاشة واحدة: اسم التمرين، الهدف، heating sets، working sets، sets قابلة للتعديل inline، زرار Complete Set، Rest Timer، Next Exercise |
| **Workout History** | لستة الجلسات، تفاصيل كل جلسة (sets فعلية vs مستهدفة) |
| **Nutrition** | تسجيل وجبات (يدوي)، أهداف السعرات/الماكروز (يدوية بالكامل)، ملخص اليوم |
| **Activities** | ScheduleBlocks، التذكيرات، ملاحظات نصية سريعة |
| **Progress** | رسوم بيانية (Tremor): وزن الجسم، تقدم التمارين، معدل إكمال الجلسات، consistency |
| **Settings** | Weight Notation، تعديل البرامج، الباك أب/التصدير، الثيم، اللغة |

---

## 9) بيانات البداية (Seed Data)

كل بياناتك الحقيقية (كتالوج التمارين، البرامج الأربعة Anterior A/B و Posterior A/B، روتين الـ Warming) موجودة كاملة وجاهزة في `data/gym-data.json` — نفس البيانات اللي بعتهالي بالظبط، الشكل مايتغيرش لأنه مستقل عن المنصة أصلاً. أول phase بتستورد الملف ده وتعمل seed للـ DB منه (مع طباعة جدول الـ mapping للموافقة، زي ما كان مخطط في نسختك الأصلية).

---

## 10) نظام التصميم

- **الطابع:** premium، minimal، شخصي، هادئ. Dark theme افتراضي + Light اختياري.
- **لون واحد accent** + neutral scale + ألوان status دلالية بس (نجاح/تحذير/خطر).
- **Type scale:** 15pt minimum للـ body. مسافات سخية. كروت قليلة، مفيش nested cards.
- **RTL كامل:** استخدم `start/end` مش `left/right` في كل مكان (Tailwind logical properties).
- **Motion:** 150-250ms بس ولها غرض، احترم `prefers-reduced-motion`.
- **تجنّب:** قوالب جيم عامة، gradients ثقيلة، dashboards شكلها corporate، ازدحام.
- **Accessibility:** tap targets 44pt minimum، contrast AA.

---

## 11) PWA وOffline

- `manifest.json` + service worker (`next-pwa` أو يدوي) → قابل للتثبيت على شاشة الموبايل الرئيسية زي أي تطبيق.
- Cache-first للأصول الثابتة، Network-first مع fallback للبيانات (آخر نسخة معروفة تتعرض لو النت قطع، read-only).
- الكتابة أوفلاين (تسجيل set والنت مقطوع) هدف Phase 5 لاحق (queue + background sync) — مش MVP، لأن الـ DB على السيرفر مش على الجهاز زي النسخة الموبايل القديمة.

---

## 12) النسخ الاحتياطي والتصدير

- تصدير JSON كامل لكل الجداول + قائمة الملفات، من شاشة Settings في أي وقت (zip يتحمّل مباشرة من المتصفح).
- تصدير CSV لتاريخ الجيم والوجبات.
- استيراد/استعادة من ملف JSON، مع preview وتأكيد قبل الكتابة.
- باك أب دوري تلقائي على السيرفر (قسم 7) — مش بديل عن التصدير اليدوي، الاتنين مطلوبين.

---

## 13) خارطة الطريق (Phases — توقف بعد كل واحدة)

- **Phase 0 — الأساس:** Next.js + TS + Tailwind + shadcn، Drizzle + SQLite + migrations، auth بسيط، layout عام + RTL + i18n scaffold، نشر أولي على السيرفر (PM2 + Tailscale Serve).
- **Phase 1 — الجيم:** استيراد كتالوج التمارين (بالموافقة)، البرامج الأربعة + versioning، دوران البرامج، Active Workout، warm-up engine، rest timer، حفظ + استئناف الجلسة، التاريخ.
- **Phase 2 — الأكل:** تسجيل وجبات يدوي، أهداف يدوية، progress rings، ملخص اليوم.
- **Phase 3 — الأنشطة:** ScheduleBlocks، تذكيرات (Web Push)، ملاحظات نصية.
- **Phase 4 — التقدم:** لوحة Progress الكاملة بالرسوم البيانية (Tremor)، الأرقام القياسية، consistency.
- **Phase 5 — الصقل:** PWA كامل + offline caching، تصدير/استيراد، باك أب تلقائي، accessibility pass، أداء.
- **Phase 6 (اختياري مستقبلي):** طبقة AI — راجع قسم 16 تحت.

---

## 14) Definition of Done (لكل ميزة)

- شغالة أوفلاين لو القسم 11 بيطلب كده.
- حالات Loading / Empty / Error متعملة.
- البيانات تعيش بعد إعادة تحميل الصفحة (اتأكد فعليًا).
- منطق الدومين (weight parser، warm-up engine، rotation، progress calc) عليه unit tests.
- تجربة RTL + عربي اتأكد منها على الشاشة فعليًا.
- سكريبت اختبار يدوي مكتوب أقدر أجربه من المتصفح.

---

## 15) أول تاسك تكتبه في Antigravity

```
اقرأ AGENTS.md وdocs/SPEC.md وdata/gym-data.json كاملين الأول.

بعدين نفّذ بس القسم اللي جاي (Phase 0) — First task:
1. افحص أي مجلد فاضي/موجود حاليًا.
2. اطبع: (أ) المعمارية (ب) الـ tech stack بإصدارات دقيقة (ج) هيكل المجلدات
   (د) Drizzle schema لكل الجداول في SPEC.md قسم 4 (هـ) خطة الـ navigation
   (و) design tokens (ز) خطة الـ phases (ح) الملفات اللي هتتعمل (ط) الملفات
   اللي هتتعدل/تتمسح مع السبب.
4. اطبع جدول الـ seed mapping لكتالوج التمارين من data/gym-data.json للموافقة.
5. بعدها قف واستنى "GO Phase 0". متكتبش كود فيتشرز في الرد ده.
```

بعد كل phase: اكتب `"GO Phase N"` عشان يكمل.

---

## 16) امتداد مستقبلي (اختياري، مش MVP): طبقة AI + دمج مع Hermes Agent

نسختك الأصلية خصصت أقسام كاملة (18-22، 34) لـ AI chat وmemory system — القرار إنها تتأجل مش إلغاء، لسبب عملي:

**عندك أصلاً [[Hermes Agent]]** شغال على VPS وبيتحكم فيه عبر Telegram، وبيعمل automation وGmail وحاجات يومية. بدل ما تبني AI chat layer منفصل جوا Fares Hub من الصفر (context builder، tools، budget guard، إلخ — تكرار مجهود)، الخيار الأذكى لاحقًا:

1. اعمل مجموعة API endpoints محمية (`getToday`, `getWorkout`, `getExerciseHistory`, `saveMemory`, ...) فوق نفس الـ repositories الموجودة — دي أصلاً نفس الأدوات المذكورة في نسختك القديمة (قسم 21).
2. خلّي Hermes Agent يستخدمهم كـ tools بتاعته (أو اعمل MCP server بسيط فوقهم) — كده التنبيهات والأسئلة الطبيعية ("عملت جيم إمبارح؟") بتتبعت لك على تليجرام، من غير ما تبني UI chat جوا الموقع نفسه ولا تدفع API tokens مرتين لنفس الغرض.
3. لو حبيت chat UI جوا الموقع كمان، ابنيه فوق نفس الـ tools دي مباشرة — مش نظام منفصل.

القرار ده مؤجل قصدًا لحد ما الأساسيات (جيم + أكل + أنشطة) تشتغل وتتستخدم فعليًا كام أسبوع، وقتها هيبقى واضح فعلاً محتاج AI layer ولا لأ.
