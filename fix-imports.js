const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/api/controllers/compile.js',
  'src/api/controllers/chat.js',
  'src/api/controllers/bot.js',
  'src/api/routes.js',
  'src/server.js',
  'src/storage/repository.js'
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add path import if missing and file uses __dirname
    if (content.includes('__dirname') && !content.includes('require(\'path\')') && !content.includes('require("path")')) {
      content = `const path = require('path');\n${content}`;
      fs.writeFileSync(fullPath, content);
      console.log(`Fixed: ${filePath}`);
    }
  }
});

console.log('All files fixed!');