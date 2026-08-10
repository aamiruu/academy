const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We use straightforward replacements
const reps = [
  ["speaker: 'شما'", "speaker: t('you')"],
  ["speaker: \"شما\"", "speaker: t('you')"],
  ["msg.sender === 'شما'", "msg.sender === t('you')"],
  ["{sender: 'شما'", "{sender: t('you')"],
  [">در حال برگزاری<", ">{t('live')}<"],
  [">ارائه استاد<", ">{t('teacher_presentation')}<"],
  [">پایان کلاس<", ">{t('end_class')}<"],
  [">ترجمه زنده<", ">{t('live_translation')}<"],
  [">هوش مصنوعی<", ">{t('ai')}<"],
  [">تعامل<", ">{t('interaction')}<"],
  [">فارسی<", ">{t('persian')}<"],
  [">العربية<", ">{t('arabic')}<"],
  [">خلاصه هوشمند کلاس<", ">{t('smart_summary')}<"],
  [">تولید خلاصه<", ">{t('generate_summary')}<"],
  [">دانلود فایل متنی<", ">{t('download_txt')}<"],
  [">دستیار هوش مصنوعی می‌تواند صحبت‌های کلاس را تحلیل و خلاصه کند.<", ">{t('ai_assistant_hint')}<"],
  [">چت کلاس<", ">{t('class_chat')}<"]
];

for (const [s, r] of reps) {
  code = code.split(s).join(r);
}

fs.writeFileSync('src/App.tsx', code);
