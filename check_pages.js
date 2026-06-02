const fs = require('fs');
const path = require('path');
const dirs = ['app/admin/page.tsx', 'app/instructor/page.tsx', 'app/student/page.tsx', 'app/profile/page.tsx', 'app/dashboard/page.tsx'];
for(const d of dirs){
    const p = path.join(process.cwd(), d);
    if(fs.existsSync(p)){
        const c = fs.readFileSync(p, 'utf8');
        console.log(d + ' -> isClient: ' + (c.includes('"use client"') || c.includes("'use client'")) + ', hasDynamic: ' + c.includes('export const dynamic'));
    } else {
        console.log(d + ' -> not found');
    }
}
