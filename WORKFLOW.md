# دليل Spec Kit لبناء Fares Hub — من أول فولدر لحد الكود الشغال

> الأداة: [GitHub Spec Kit](https://github.com/github/spec-kit). المتطلبات: `uv` + `git` مثبتين، وAntigravity مفتوح.
> الـ 3 ملفات اللي معاك (`AGENTS.md`, `docs/SPEC.md`, `data/gym-data.json`) هي **المادة الخام** — مش هتتنسخ زي ما هي، هتتغذى بيها كل أمر في مكانه الصح تحت.

---

## 0) التثبيت + إنشاء المشروع (Terminal)

```bash
# تثبيت الـ CLI مرة واحدة على جهازك (لأي مشروع جاي كمان)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# إنشاء المشروع، مربوط بـ Antigravity (integration key الرسمي = agy)
specify init fares-hub --ai agy
cd fares-hub

# لو عايز تبدأ جوا فولدر موجود بدل ما ينشئ جديد:
# specify init --here --ai agy

git init
git add -A && git commit -m "chore: spec-kit scaffold"
```

> ⚠️ الفلاج ممكن يبقى `--integration agy` بدل `--ai agy` حسب نسخة الأداة عندك — شغّل `specify init --help` قبل لو مش متأكد، الاتنين ظهروا في التوثيق حسب تاريخ الإصدار.

الناتج هيبقى هيكل فيه `.specify/memory/`, `.specify/templates/`, `specs/`, وskills خاصة بـ Antigravity جوا `.agents/skills/speckit-*/`.

انسخ ملفاتك الثلاثة (`AGENTS.md`, `docs/SPEC.md`, `data/gym-data.json`) جوا الفولدر ده كمان، وسيبهم — هيفيدوا الـ agent كـ سياق إضافي حتى بعد ما تتحول محتوياتهم لـ artifacts رسمية بتاعة Spec Kit.

---

## 1) الدورة الكاملة جوا Antigravity

### الخطوة 1 — `/speckit.constitution` (المبادئ الثابتة)
```
/speckit.constitution

المشروع: موقع شخصي لمستخدم واحد (فارس) لتتبع الجيم والسعرات والأنشطة —
مش SaaS، مفيش مستخدمين تانيين.

القواعد اللي محدش يخالفها (انسخها كاملة من AGENTS.md قسم "قواعد صارمة"):
- الأوزان: object واحد {rawWeight, numericValue, unitTag, isUnitConfirmed}،
  الـ tags K/B معتمة، ممنوع تحويلها أو خلطها بين tags مختلفة
- WorkoutSession اتقفلت = append-only، ممنوع تتعدل
- تعديل WorkoutProgram = نسخة جديدة (programVersion+1)
- ممنوع اختراع calorie/macro targets أو نصايح طبية
- SQLite = source of truth، باك أب دوري إجباري
- من غير Docker إلا لو ضروري فعلاً
- عربي مصري + RTL كامل من البداية
```
راجع `.specify/memory/constitution.md` الناتج كويس قبل ما تكمل — ده الأساس اللي كل حاجة جاية هتتحاكم عليه.

### الخطوة 2 — `/speckit.specify` (الـ "إيه وليه" — من غير تكنولوجيا)
```
/speckit.specify

[الصق هنا: docs/SPEC.md § 0 (الرؤية) + § 4 (نموذج البيانات، الوصف
المفاهيمي بس مش كود الـ schema) + § 5 (قواعد الدومين كاملة: warm-up
engine، rest timer، program rotation، personal best) + § 8 (الصفحات)]
```
**قاعدة مهمة:** الأمر ده عن "المطلوب" بس — متحطش فيه Next.js/Drizzle/Tailwind هنا، مكانهم الخطوة اللي بعد كده.

### الخطوة 3 — `/speckit.clarify` (بوابة جودة 1)
```
/speckit.clarify
```
هيسألك على أي حتة غامضة أو ناقصة. جاوب بصراحة وبالتفصيل — دي أرخص خطوة في الدورة كلها وأكتر حاجة بتوفر وقت لاحقًا.

### الخطوة 4 — `/speckit.plan` (الـ "إزاي" — التكنولوجيا والمعمارية)
```
/speckit.plan

[الصق هنا: docs/SPEC.md § 2 (القرار النهائي بس من كل مقارنة —
Next.js 15 App Router + TS، SQLite+Drizzle، Tailwind+shadcn+Tremor،
auth مخصص، home server+Tailscale) + § 3 (المعمارية وهيكل المجلدات
كامل) + § 6 (مثال Drizzle schema) + § 7 (خطوات النشر) + § 10 (نظام
التصميم)]
```

### الخطوة 5 — `/speckit.tasks`
```
/speckit.tasks
```
هيكسّر الـ plan لمهام منفذة مرتبة. قارنها بخارطة الطريق `docs/SPEC.md` § 13 (Phase 0→6) — لو الترتيب مختلف عن تصورك، عدّل `tasks.md` يدوي دلوقتي قبل ما تكمل.

### الخطوة 6 — `/speckit.analyze` (بوابة جودة 2)
```
/speckit.analyze
```
بيتأكد إن spec.md وplan.md وtasks.md متطابقين ومفيش تعارض بينهم. **متتخطاش الخطوة دي** حتى لو شكلها زيادة عن اللزوم.

### الخطوة 7 — `/speckit.implement` (مرحلة واحدة في كل مرة)
```
/speckit.implement

نفّذ Phase 0 بس من tasks.md (الأساس: Next.js + TS + Tailwind + shadcn،
Drizzle + SQLite + migrations، auth بسيط، layout + RTL + i18n scaffold).
قف بعدها واستنى مراجعتي — متكملش لـ Phase 1 من غير ما أقولك.
```
بعد كل phase:
```bash
git add -A && git commit -m "feat: phase 0 - foundation"
```
commit منفصل لكل phase، مش commit واحد ضخم في الآخر — لو phase طلعت غلط تقدر ترجع لها بسهولة.

### الخطوة 8 — `/speckit.converge`
```
/speckit.converge
```
بيقارن الكود الفعلي بالـ spec/plan/tasks ويطلعلك الفجوات. كرر implement→converge لنفس الـ phase لحد ما يرجعلك "Converged"، بعدين انتقل لل phase اللي بعدها (ارجع للخطوة 7).

---

## 2) نصايح من تجربتك الفعلية مع Antigravity + Spec Kit

- **مشكلة النسيان/الاختراع اللي واجهتها قبل كده:** Antigravity أحيانًا بينسى تعليماتك أو نمط متفق عليه ويخترع حل من عنده. التخفيف: خلّي `constitution.md` مختصر وحاسم (مش صفحات طويلة)، وكرر القيود الحرجة (نموذج الأوزان، append-only) في أول أي prompt implement طويل، حتى لو موجودة أصلاً في الـ constitution.
- **Commit بعد كل بوابة برضه**، مش بس بعد implement — بعد constitution وspecify وplan وtasks لوحدهم. لو مرحلة خرجت غلط، الرجوع أسهل بكتير.
- **استخدم TestSprite وCodeRabbit** بتوعك في نهاية كل phase — TestSprite لاختبار المنطق الحرج (weight parser، warm-up engine، rotation)، CodeRabbit لمراجعة الـ diff قبل ما تعتبر الـ phase مقفولة.
- **دورة حسابات Google** بتاعتك: لو خلصت الـ 5 ساعات على حساب وبدّلت للتاني، مفيش حاجة هتضيع — كله متسجل في `specs/` و`tasks.md`، كمّل من نفس النقطة.

---

## 3) خريطة سريعة: مين بيتغذى من مين

| أمر Spec Kit | مصدره من الملفات اللي معاك |
|---|---|
| `/speckit.constitution` | `AGENTS.md` بالكامل |
| `/speckit.specify` | `docs/SPEC.md` § 0, 4, 5, 8 |
| `/speckit.plan` | `docs/SPEC.md` § 2 (القرار بس)، 3, 6, 7, 10 |
| بيانات الـ seed (جوا Phase 1 task) | `data/gym-data.json` |
