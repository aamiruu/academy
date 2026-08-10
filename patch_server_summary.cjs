const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const { transcripts } = req.body;',
  'const { transcripts, targetLanguage = "fa" } = req.body;'
);

code = code.replace(
  'const prompt = `شما یک دستیار هوش مصنوعی برای کلاس‌های آنلاین هستید. لطفا صحبت‌های زیر که در یک کلاس مطرح شده را به زبان فارسی و در قالب چند نکته کلیدی (bullet points) خلاصه کنید:\\n\\n${transcriptText}`;',
  'const langName = targetLanguage === "en" ? "English" : targetLanguage === "ar" ? "Arabic" : "Persian";\n      const prompt = `You are an AI assistant for online classes. Please summarize the following class transcript in ${langName} using bullet points:\\n\\n${transcriptText}`;'
);

code = code.replace(
  'return res.json({ summary: "[شبیه‌سازی خلاصه]: این یک خلاصه شبیه‌سازی شده از کلاس است." });',
  'return res.json({ summary: `[Mock Summary in ${targetLanguage}]: This is a mocked class summary.` });'
);

code = code.replace(
  'res.json({ summary: "[شبیه‌سازی خلاصه]: این یک خلاصه شبیه‌سازی شده از کلاس است." });',
  'res.json({ summary: `[Mock Summary in ${targetLanguage}]: This is a mocked class summary.` });'
);

fs.writeFileSync('server.ts', code);
