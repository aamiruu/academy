const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'body: JSON.stringify({ transcripts }),',
  'body: JSON.stringify({ transcripts, targetLanguage: i18n.language }),'
);

code = code.replace(
  'const { t } = useTranslation();',
  'const { t, i18n } = useTranslation();'
);

fs.writeFileSync('src/App.tsx', code);
