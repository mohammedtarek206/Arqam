const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', 'public'].includes(file)) {
        searchDir(fullPath);
      }
    } else if (/\.(ts|tsx|js|jsx|json|md|mjs)$/i.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/IT[- ]?SPARK/ig);
      if (matches) {
        console.log(Found  in );
      }
    }
  }
}

searchDir(process.cwd());
