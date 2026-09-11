# Fares Hub — PRD تنفيذي مقسم بالكامل على Phases

> **علاقة الملف ده بباقي الملفات:** `AGENTS.md` = القواعد المختصرة اللي الـ agent بيقراها كل مرة. `docs/SPEC.md` = القرارات التقنية ومبرراتها (مقارنات stack، معمارية، أمان). `docs/WORKFLOW.md` = إزاي تشغّل Spec Kit خطوة بخطوة. **الملف ده** = التفصيل الكامل لكل مرحلة — الشاشات، الجداول، القواعد، المهام، وتعريف الاكتمال — عشان تقدر تنفّذ منه مباشرة أو تلصقه جوا `/speckit.tasks` / `/speckit.implement` لكل phase على حدة.

**جدول المحتويات:** [Phase 0](#phase-0--الأساس-foundation) · [Phase 1](#phase-1--الجيم-workout-core) · [Phase 2](#phase-2--الأكل-nutrition) · [Phase 3](#phase-3--الأنشطة-activities) · [Phase 4](#phase-4--التقدم-progress) · [Phase 5](#phase-5--الصقل-polish) · [Phase 6](#phase-6--مستقبلي-اختياري)

---

## Phase 0 — الأساس (Foundation)

### الهدف
تجهيز الهيكل الكامل (كود + بيانات + دخول + تصميم) بحيث أي phase جاية تضيف فيتشرز بس، من غير ما تلمس الأساسيات تاني.

### الشاشات
- **`/login`** — فورم username + password، رسالة خطأ واضحة عند الفشل
- **Layout عام** — Sidebar (desktop) / Bottom Nav (mobile)، Header فيه theme toggle، فاضي من غير فيتشرز لسه

### الإعداد التقني (خطوة بخطوة)
```bash
npx create-next-app@latest fares-hub --typescript --tailwind --app --src-dir
cd fares-hub
npm i drizzle-orm better-sqlite3 zod argon2 lucide-react @tremor/react
npm i -D drizzle-kit @types/better-sqlite3
npx shadcn@latest init        # base color: neutral
```
- إعداد `drizzle.config.ts` + `src/data/schema.ts` (يبدأ بجدولين بس: `app_settings`, `sessions`)
- إعداد `src/i18n/ar.json` + `src/i18n/en.json`، و`dir="rtl"` على `<html>` لما اللغة عربي (الافتراضية)
- إعداد `.env.example` بالمفاتيح: `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `DATABASE_PATH`
- `.gitignore`: `.env`, `*.db`, `*.db-wal`, `*.db-shm`, `node_modules`

### نموذج البيانات
```
app_settings: id, key, value, updated_at
sessions:     id, token_hash, created_at, expires_at
```

### قواعد الدومين
- باسورد واحد فقط، مُخزّن كـ argon2id hash (في `.env` أو `app_settings` — أبدًا نص صريح).
- Session cookie: HMAC-signed، HTTP-only، Secure، SameSite=Lax، صلاحية أسبوعين + تجديد تلقائي عند أي طلب ناجح.
- Rate limit بسيط على `/login`: 5 محاولات كل 15 دقيقة (في الذاكرة كفاية، مفيش داعي لجدول DB).

### المهام
- [ ] `npm run dev` شغال، صفحة تجربة فيها زرار shadcn + كارت + chart بسيط من Tremor
- [ ] Drizzle متصل، أول migration شغالة (`npm run db:generate && npm run db:migrate`)
- [ ] `/login` شغالة كاملة (تحقق، cookie، توجيه)
- [ ] middleware بيحمي كل route تحت `(app)/`
- [ ] RTL متأكد منه فعليًا على الشاشة (مش بس في الكود)
- [ ] Dark/Light toggle شغال ومحفوظ
- [ ] `.env.example` موجود، `.env` الحقيقي متسجلش في git

### Definition of Done
تسجل دخول، تتصفح، تقفل المتصفح وترجع لسه داخل. `npm run build` بينجح من غير أخطاء TS.

### سكريبت اختبار يدوي
1. افتح `/` من غير دخول → يوديك `/login`.
2. باسورد غلط → رسالة خطأ واضحة.
3. باسورد صح → تدخل.
4. اقفل التاب، افتحه تاني → لسه داخل.
5. بدّل الثيم → يفضل زي ما هو بعد refresh.

---

## Phase 1 — الجيم (Workout Core)

### الهدف
تتبع حقيقي كامل: كتالوج تمارين، 4 برامج بنظام إصدارات، دوران أسبوعي، محرك إحماء، مؤقت راحة، جلسة حية مع autosave واستئناف، وتاريخ كامل.

### الشاشات
| الشاشة | المحتوى |
|---|---|
| Workout List | البرامج الأربعة، مين الدور عليه (حسب الدوران)، تاريخ آخر مرة اتعملت |
| Workout Detail | تمارين البرنامج + أوزان + sets/reps + زرار تعديل (يفتح نسخة جديدة) |
| Active Workout | شاشة واحدة كاملة — التفاصيل تحت |
| Workout History | لستة الجلسات + تفاصيل كل جلسة (مستهدف مقابل فعلي) |

### نموذج البيانات
```
exercises:                  id, display_name, aliases(json), tutorial_url, personal_notes
workout_programs:           id, name, order, current_version_id
workout_program_versions:   id, program_id, version_number, created_at, diff_note
workout_program_exercises:  id, program_version_id, exercise_id, position, heating,
                             working_sets, reps, rest_range, weight(json)
weekly_split:                id, program_id, position          -- ترتيب الدوران
workout_sessions:           id, program_id, program_version_id, started_at, completed_at,
                             duration_sec, status(active|completed|abandoned), notes
performed_sets:             id, session_id, exercise_id, set_number, type(warmup|working),
                             target_reps, actual_reps, target_weight(json), actual_weight(json),
                             completed, notes, timestamp
warmup_overrides:           id, exercise_id, heating_level, custom_sets(json)
rest_timer_prefs:           id, exercise_id, saved_duration_sec
```

### قواعد الدومين (تفصيل كامل)

**نموذج الأوزان:** كل وزن = `{ rawWeight, numericValue, unitTag, isUnitConfirmed }`. الـ `K`/`B` معتمة تمامًا — ممنوع تحويل أو خلط بين tags مختلفة في أي حساب. الـ UI دايمًا بتعرض `rawWeight`. تقريب افتراضي لأقرب 0.5، قابل للتعديل per-exercise.

**محرك الإحماء:**
| heating | النتيجة |
|---|---|
| `"0"` | مفيش warm-up |
| `"1"` | set واحد: ~60% × 3-6 |
| `"1-2"` | 2 sets: ~50% × 3-6، ثم ~75-80% × 3 |
| `"1-3"` | 3 sets: ~50% × 3-6، ثم ~75-80% × 3، ثم ~85-90% × 1-3 |

النسب على working weight لنفس التمرين. كل set قابل للتعديل، والتعديل بيتسجل كـ override دايم لنفس التمرين.

**مؤقت الراحة:** `restRange` → `{minMinutes, maxMinutes} | null`. الوحدة **دقايق دايمًا**. يبدأ من min، يعلّم عند max، يكمل عدّ بعدها. `null` → stopwatch حر.

**الدوران:** Anterior A → Posterior A → Anterior B → Posterior B. يتقدم بس عند إقفال جلسة (completed). تفويت يوم لا يقدّم الدورة. تغيير يدوي متاح دايمًا.

**نسخ البرامج:** أي تعديل (وزن/reps/sets/heating/rest/ترتيب) = `version + 1`. الجلسات تفضل مربوطة بالنسخة وقت بدايتها (snapshot). Diff بسيط قبل الحفظ. مفيش auto-progression أبدًا.

**append-only:** جلسة مقفولة ممنوع تتعدل. autosave بعد كل set. جلسة بلا نشاط 12 ساعة → `abandoned` تلقائيًا (بتتفحص عند أي فتح لصفحة الجيم).

### تفاصيل Active Workout
- **Header:** اسم البرنامج + "تمرين 4/8" + وقت منقضي
- **Body:** اسم التمرين، الهدف، warm-up sets (متولدة تلقائي)، working sets (reps/weight قابلين للتعديل inline)، Complete Set لكل set
- **Footer:** Start Rest Timer + Next Exercise
- Autosave فوري بعد كل Complete — مفيش زرار حفظ عام
- بانر "استكمال جلسة نشطة" لو فيه جلسة `active` عند فتح صفحة الجيم

### المهام
- [ ] استيراد `data/gym-data.json` (سكريبت seed) + طباعة جدول mapping للموافقة قبل الكتابة الفعلية
- [ ] `src/domain/weight-parser.ts` — `parseWeight(raw) → WeightValue` + unit tests
- [ ] `src/domain/warmup-engine.ts` — `generateWarmupSets(heating, workingWeight)` + unit tests لكل قيم heating
- [ ] `src/domain/program-rotation.ts` — `getNextProgram(split, sessions)` + unit tests
- [ ] شاشة Active Workout كاملة + autosave
- [ ] Rest Timer (خلفية + إشعار عند الانتهاء)
- [ ] Workout History + تفاصيل الجلسة
- [ ] Program versioning + diff view

### Definition of Done
جلسة كاملة (إحماء → working → مؤقت → تمرين تالي) بتتسجل صح. استئناف بعد قفل التاب شغال. تعديل برنامج ميغيرش جلسات قديمة. كل `src/domain/` عليه tests شغالة.

### سكريبت اختبار يدوي
1. ابدأ Anterior A — تأكد الترتيب والـ warm-up صح لكل تمرين.
2. سجل working set بوزن مختلف عن المستهدف.
3. اقفل التاب في نص التمرين التالت، افتح تاني، تأكد الاستئناف اشتغل بنفس البيانات.
4. كمّل واقفل الجلسة، تأكد ظهورها في History بكل التفاصيل.
5. عدّل وزن في البرنامج، اعمل جلسة جديدة، تأكد القديمة لسه شايلة الرقم القديم.

---

## Phase 2 — الأكل (Nutrition)

### الهدف
تسجيل وجبات وسعرات يدوي بالكامل، مع أهداف يومية اختيارية وملخص بصري — من غير أي رقم مُخترع.

### الشاشات
| الشاشة | المحتوى |
|---|---|
| Nutrition Home | ملخص اليوم (سعرات/بروتين/كارب/دهون مسجلة مقابل الهدف لو موجود)، لستة وجبات اليوم |
| Meal Add/Edit | اسم، نوع الوجبة، سعرات، ماكروز (كلها اختيارية إلا الاسم)، ملاحظات، صورة اختيارية |
| Nutrition Settings | تحديد/تعديل الأهداف اليومية يدويًا |

### نموذج البيانات
```
meals:             id, name, timestamp, meal_type, calories, protein, carbs, fat,
                    notes, photo_id, source(manual|estimate), is_estimate
nutrition_targets: id, daily_calories, protein, carbs, fat, effective_from
```

### قواعد الدومين
- **مفيش أي هدف بيتحط لوحده.** كل رقم في `nutrition_targets` بيدخله فارس بنفسه.
- لو مفيش هدف محدد لأي macro → اعرض "غير محدد" + زرار إدخال، أبدًا رقم افتراضي.
- Progress rings تتعرض بس للـ macros اللي ليها هدف فعلي.
- **حاسبة TDEE (اختيارية):** لو اتعملت، لازم تكون شاشة منفصلة واضح عليها "صيغة عامة قياسية (Mifflin-St Jeor أو مشابه) — مش نصيحة طبية مخصصة"، والناتج بيتعرض كـ **اقتراح قابل للتعديل** يحتاج تأكيد فارس قبل ما يتحفظ كـ `nutrition_target` — أبدًا auto-apply.

### المهام
- [ ] فورم إضافة/تعديل وجبة
- [ ] حساب ملخص اليوم (جمع بسيط من `meals` حسب التاريخ)
- [ ] شاشة تحديد الأهداف اليدوية
- [ ] Progress rings (Tremor) — بس للـ macros المحددة
- [ ] (اختياري) حاسبة TDEE منفصلة بالتحذير المطلوب

### Definition of Done
تسجيل وجبة، تعديلها، حذفها، وملخص اليوم بيتحدث صح فورًا. أهداف فاضية = "غير محدد" مش صفر مخفي.

### سكريبت اختبار يدوي
1. سجّل 3 وجبات بأوقات مختلفة النهاردة، تأكد الملخص بيجمعهم صح.
2. سيب هدف البروتين فاضي، تأكد الشاشة بتقول "غير محدد" مش "0g".
3. حدد هدف سعرات، سجل وجبات تعدّيه، تأكد الـ ring بيعكس الزيادة بصريًا من غير أي رسالة تحكيمية.

---

## Phase 3 — الأنشطة (Activities)

### الهدف
جدول يومي، تذكيرات، وملاحظات سريعة — نسخة مبسطة من نظام الـ Capture الأصلي (نص/صورة، من غير voice/AI categorization في MVP).

### الشاشات
| الشاشة | المحتوى |
|---|---|
| Home / اليوم | الجدول الزمني (ScheduleBlocks)، الكتلة الحالية مميزة، ملخص سريع (جيم/أكل/تذكيرات) |
| Activities | إدارة ScheduleBlocks + التذكيرات + الملاحظات |
| Capture (+) | زرار عائم — نص سريع أو صورة، يختار تصنيف يدوي (Note/Task/Reminder/Idea/Other) |

### نموذج البيانات
```
schedule_blocks: id, title, category(meal|work|gym|reminder|review|custom),
                  start_time, end_time, repeat_rule, enabled
reminders:        id, title, description, scheduled_at, repeat_rule, category,
                  enabled, last_fired_at
notes:            id, content, category, media_ref, created_at
```

### قواعد الدومين
- Seed افتراضي لـ `schedule_blocks` (قابل للتعديل الكامل): `08:00 فطار | 10:00 شغل | 13:30 غدا | 17:00 جيم | 20:30 تذكير | 22:00 مراجعة اليوم`.
- التذكيرات عبر **Web Push** (permission request واضح، مش مفروض). لو رفض الإذن، اعرض حالة "التذكيرات متوقفة" بدل ما تفشل بصمت.
- مفيش AI تصنيف تلقائي في MVP — فارس بيختار التصنيف يدوي وقت الحفظ. AI categorization اختياري لـ Phase 6.
- التصنيف والمحتوى بيتسجلوا فورًا، مفيش تأكيد إضافي مطلوب زي الـ AI-confirm في النسخة الأصلية (مش موجود AI هنا أصلاً).

### المهام
- [ ] CRUD لـ ScheduleBlocks + عرض الجدول اليومي في Home مرتب زمنيًا
- [ ] منطق "الكتلة الحالية" (highlight الـ block اللي وقته دلوقتي)
- [ ] CRUD للتذكيرات + Web Push subscription flow
- [ ] Capture سريع (نص + صورة اختيارية) مع اختيار تصنيف يدوي
- [ ] ملخص Home: حالة الجيم/الأكل/التذكيرات النهاردة

### Definition of Done
الجدول اليومي بيعكس ScheduleBlocks فعليًا (مفيش هاردكود). تذكير مجدول فعلًا بيوصل إشعار push في وقته. ملاحظة سريعة بتتحفظ وتظهر في لستة.

### سكريبت اختبار يدوي
1. عدّل ScheduleBlock (مثلاً وقت الجيم)، تأكد الـ Home اتحدثت.
2. اعمل تذكير بعد دقيقتين، وافق على إذن الإشعارات، تأكد وصل في وقته.
3. ارفض إذن الإشعارات عمدًا، تأكد الموقع بيوضح الحالة مش بيفشل بصمت.
4. سجل ملاحظة نصية + صورة، تأكد ظهورها بالتصنيف الصح.

---

## Phase 4 — التقدم (Progress)

### الهدف
لوحة تحليلات بصرية حقيقية من البيانات المتراكمة — أرقام قياسية، تقدم الأوزان، consistency — بدون أي استنتاج غير مبرر.

### الشاشات
| الشاشة | المحتوى |
|---|---|
| Progress | رسوم بيانية Tremor: تقدم الأوزان لكل تمرين، معدل إكمال الجلسات، consistency heatmap، الأرقام القياسية |

### نموذج البيانات
```
-- مفيش جداول جديدة أساسية؛ كل الحسابات مُشتقة من performed_sets / workout_sessions / meals
progress_snapshots (اختياري، للأداء بس): id, type, computed_at, payload(json)
```

### قواعد الدومين
- أي مقارنة **بس بين نفس الـ unitTag لنفس التمرين** — لو مختلفين، series منفصلة في الرسم، أبدًا تجميع.
- Personal best = working sets بس، أعلى `numericValue`، تعادل يتكسر بعدد reps.
- النصوص وصفية بس: "50K×7 مقابل 45K×8 آخر مرة" — أبدًا استنتاج زي "بقيت أقوى".
- أقل من نقطتين بيانات → "مفيش بيانات كفاية لسه"، مفيش خط اتجاه وهمي.

### المهام
- [ ] `src/domain/progress-calc.ts` — دوال pure لكل حساب (progression، completion rate، personal bests) + unit tests
- [ ] رسم بياني لكل تمرين (فلتر حسب unitTag لو متعدد)
- [ ] Consistency heatmap (شهر بالأيام، ملون حسب جلسات مكتملة)
- [ ] لستة الأرقام القياسية الحالية لكل تمرين
- [ ] حالات Empty/Insufficient-data لكل شارت

### Definition of Done
كل رسم بياني بيعكس بيانات حقيقية من DB، مفيش رقم مُختلق. تمرين له K وB → series منفصلة واضحة. أقل من نقطتين → رسالة مفيش بيانات مش رسم فاضي مُربك.

### سكريبت اختبار يدوي
1. اعمل جلستين لنفس التمرين بنفس الـ unitTag، تأكد الرسم بيوصلهم.
2. سجل set بـ unitTag مختلف لنفس التمرين، تأكد ظهر كـ series منفصل مش مدموج.
3. افتح تمرين عملته مرة واحدة بس، تأكد رسالة "مفيش بيانات كفاية" ظهرت بدل رسم مكسور.

---

## Phase 5 — الصقل (Polish)

### الهدف
تجربة قابلة للاعتماد فعليًا: قابلة للتثبيت، محفوظة احتياطيًا تلقائيًا، متاحة بالقراءة أوفلاين، ومتاحة لأي حد بلا حواجز وصول.

### المهام
- [ ] PWA: `manifest.json` (أيقونات، اسم، ثيم كولور) + service worker (`next-pwa` أو يدوي) — قابل للتثبيت من المتصفح
- [ ] Offline caching: آخر نسخة معروفة من الصفحة الرئيسية + Workout List تتعرض لو النت مقطوع (read-only، مع مؤشر "أوفلاين" واضح)
- [ ] تصدير JSON كامل لكل الجداول + zip من شاشة Settings
- [ ] تصدير CSV لتاريخ الجيم والوجبات
- [ ] استيراد/استعادة من JSON مع preview قبل الكتابة
- [ ] cron نايتلي على السيرفر (راجع `docs/SPEC.md` § 7) — تفعيله فعليًا مش بس التوثيق
- [ ] Accessibility pass: tap targets 44pt، contrast AA، screen reader labels على كل عنصر تفاعلي
- [ ] Performance pass: lazy loading للرسوم البيانية، فحص أول تحميل على شبكة بطيئة

### Definition of Done
تقدر "تضيف الموقع للشاشة الرئيسية" من الموبايل ويفتح زي تطبيق. تقطع النت وتفتح الصفحة الرئيسية — لسه بتشتغل بعرض آخر بيانات. تصدير كامل بينزل فعليًا كملف. باك أب تلقائي شغال فعليًا على السيرفر (اتأكد بالدخول وشوف ملفات النسخ موجودة).

### سكريبت اختبار يدوي
1. من موبايلك، "أضف للشاشة الرئيسية"، افتحه — يفتح بدون شريط عنوان المتصفح.
2. فعّل وضع الطيران، افتح الموقع — تشوف آخر بيانات بمؤشر أوفلاين واضح.
3. صدّر JSON، افتح الملف تأكد كل الجداول موجودة.
4. سيبه يوم كامل، ادخل على السيرفر وتأكد ملف باك أب جديد اتعمل فعلًا الساعة 3 صباحًا.

---

## Phase 6 — مستقبلي (اختياري)

راجع `docs/SPEC.md` § 16 بالتفصيل. الملخص: بدل بناء AI chat layer منفصل من الصفر، اكشف الـ repositories الموجودة كـ tools محمية (`getToday`, `getWorkout`, `getExerciseHistory`, `saveMemory`...) و[[Hermes Agent]] بتاعك (شغال أصلاً على تليجرام) يستخدمهم — تنبيهات وأسئلة طبيعية عن بياناتك بتوصلك على تليجرام من غير ما تبني UI chat جوا الموقع ولا تدفع API مرتين لنفس الغرض. القرار ده مؤجل قصدًا لحد ما Phase 0-5 تشتغل وتتستخدم فعليًا كام أسبوع.
