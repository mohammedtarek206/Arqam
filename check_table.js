const fs = require('fs');
const path = require('path');
const dirs = [
  'app/admin/analytics/page.tsx',
  'app/admin/codes/page.tsx',
  'app/admin/instructors/page.tsx',
  'app/admin/payments/page.tsx',
  'app/admin/results/page.tsx',
  'app/instructor/exams/page.tsx',
  'app/instructor/stats/page.tsx'
];
for (const d of dirs) {
    const p = path.join(process.cwd(), d);
    if(fs.existsSync(p)){
        const c = fs.readFileSync(p, 'utf8');
        console.log(d + ' has overflow-x-auto: ' + c.includes('overflow-x-auto'));
    }
}
