const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For JSX attributes like title="...", we replaced them incorrectly.
// Actually, they were title="میکروفون". When replaced, they became title=t('mic').
code = code.replace(/title=t\('([^']+)'\)/g, "title={t('$1')}");
code = code.replace(/placeholder=t\('([^']+)'\)/g, "placeholder={t('$1')}");

fs.writeFileSync('src/App.tsx', code);
