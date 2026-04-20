const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const match = html.match(/<script>([\s\S]*)<\/script>/);
if (!match) {
  console.error('no script found');
  process.exit(1);
}
fs.writeFileSync('tmp-index-script.js', match[1]);
console.log('wrote tmp-index-script.js');
