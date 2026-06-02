const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.next', 'public'].includes(file)) {
        searchDir(fullPath);
      }
    } else if (/\.(tsx|jsx)$/i.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<table')) {
        console.log(fullPath);
      }
    }
  }
}

searchDir(process.cwd());
