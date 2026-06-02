const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (file === 'route.ts' || file === 'route.js') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const needsDynamic = 
        content.includes('request.headers') || 
        content.includes('req.headers') ||
        content.includes('headers()') ||
        content.includes('cookies()') ||
        content.includes('verifyToken') ||
        content.includes('verifyAdmin') ||
        content.includes('verifyInstructor') ||
        content.includes('NextRequest');

      if (needsDynamic && !content.includes('export const dynamic')) {
        console.log('Updating: ' + fullPath);
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

processDir(path.join(process.cwd(), 'app', 'api'));
