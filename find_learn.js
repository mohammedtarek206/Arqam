const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'app', 'learn');
if(fs.existsSync(p)){
    console.log(fs.readdirSync(p));
    const sub = path.join(p, fs.readdirSync(p)[0]);
    if(fs.statSync(sub).isDirectory()){
        console.log(fs.readdirSync(sub));
    }
}
