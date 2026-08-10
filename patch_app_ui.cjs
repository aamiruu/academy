const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard strings
const replacements = [
  ["مرورگر شما از قابلیت تشخیص صدا پشتیبانی نمی‌کند.", "t('browser_no_mic')"],
  ["[خطا در ترجمه]", "t('translation_error')"],
  ["خطا در ایجاد خلاصه کلاس.", "t('summary_error')"],
  ["استاد (شما)", "t('teacher_you')"],
  ["در حال برگزاری", "t('live')"],
  ["۲۴ دانشجو", "t('students_count')"],
  ["بستن تخته", "t('close_whiteboard')"],
  ["ارائه استاد", "t('teacher_presentation')"],
  ["در حال نمایش اسلایدها", "t('showing_slides')"],
  ["مقدمه‌ای بر هوش مصنوعی", "t('intro_ai')"],
  ["در این بخش به بررسی تاریخچه و کاربردهای شبکه‌های عصبی عمیق در پردازش زبان طبیعی می‌پردازیم.", "t('intro_ai_desc')"],
  ["استاد احمدی", "t('prof_ahmadi')"],
  ["در حال صحبت (تشخیص صدا فعال)", "t('speaking')"],
  ["میکروفون غیرفعال", "t('mic_disabled')"],
  ["دوربین غیرفعال است", "t('camera_disabled')"],
  ["در حال ضبط صدا...", "t('recording_audio')"],
  ["میکروفون", "t('mic')"],
  ["دوربین", "t('camera')"],
  ["اشتراک صفحه", "t('screen_share')"],
  ["تخته سفید", "t('whiteboard')"],
  ["اجازه گرفتن", "t('raise_hand')"],
  ["در حال ضبط", "t('recording')"],
  ["ضبط کلاس", "t('record_class')"],
  ["پایان کلاس", "t('end_class')"],
  ["ترجمه زنده", "t('live_translation')"],
  ["هوش مصنوعی", "t('ai')"],
  ["تعامل", "t('interaction')"],
  ["فارسی", "t('persian')"],
  ["العربية", "t('arabic')"],
  ["در حال ترجمه...", "t('translating')"],
  ["تایپ کنید (شبیه‌سازی)...", "t('typing_sim')"],
  ["شرکت کنندگان (۲۴)", "t('participants_count')"],
  ["پیامی وجود ندارد.", "t('no_messages')"],
  ["ارسال پیام به کلاس...", "t('send_msg_to_class')"],
  ["دستیار هوش مصنوعی می‌تواند صحبت‌های کلاس را تحلیل و خلاصه کند.", "t('ai_assistant_hint')"],
  ["ابتدا صحبت کنید تا متن تولید شود.", "t('speak_first')"],
  ["روی دکمه تولید خلاصه کلیک کنید.", "t('click_summary')"]
];

for (const [search, replaceKey] of replacements) {
    // For JS logic string replacements
    code = code.split('"' + search + '"').join(replaceKey);
    code = code.split("'" + search + "'").join(replaceKey);
    // For JSX text replacements
    code = code.split(">" + search + "<").join(">{" + replaceKey + "}<");
}

code = code.replace(
  'متن صحبت‌ها و ترجمه زنده در این قسمت نمایش داده می‌شود.<br/><br/>میکروفون را فعال کنید یا متن را تایپ کنید.',
  "{t('transcription_hint_1')}<br/><br/>{t('transcription_hint_2')}"
);

code = code.replace(
  'دانشجو {i + 1}',
  "{t('student_n', {n: i + 1})}"
);


fs.writeFileSync('src/App.tsx', code);
