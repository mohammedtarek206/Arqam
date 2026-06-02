const fs = require('fs');
const path = require('path');

const dirsToCheck = [
  'app/admin',
  'app/instructor',
  'app/student',
  'app/dashboard',
  'app/profile',
  'app/progress',
  'app/payments',
  'app/notifications'
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.tsx' || file === 'page.jsx' || file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const isClientComponent = content.includes("use client") || content.includes('use client');

      if (!isClientComponent && !content.includes('export const dynamic')) {
        console.log('Updating Page/Layout: ' + fullPath);
        const importMatch = content.match(/^(?:import.*?\n)+/m);
        if (importMatch) {
            content = content.replace(importMatch[0], importMatch[0] + '\nexport const dynamic = "force-dynamic";\n');
        } else {
            content = 'export const dynamic = "force-dynamic";\n\n' + content;
        }
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

for (const d of dirsToCheck) {
    processDir(path.join(process.cwd(), d));
}
