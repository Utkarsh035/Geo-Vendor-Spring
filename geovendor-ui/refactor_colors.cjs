const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  const initial = content;
  
  // Replace direct white colors in structural backgrounds
  content = content.replace(/'rgba\(255,255,255,0\.05\)'/g, "'var(--glass-bg)'");
  content = content.replace(/'rgba\(255,255,255,0\.1\)'/g, "'var(--border-medium)'");
  content = content.replace(/'rgba\(255,255,255,0\.02\)'/g, "'var(--glass-hover)'");
  content = content.replace(/'rgba\(255,255,255,0\.08\)'/g, "'var(--border-subtle)'");
  content = content.replace(/'rgba\(255,255,255,0\.06\)'/g, "'var(--border-subtle)'");
  content = content.replace(/'rgba\(0,0,0,0\.85\)'/g, "'var(--bg-elevated)'");
  content = content.replace(/'rgba\(0,0,0,0\.8\)'/g, "'var(--bg-elevated)'");
  
  // Hardcoded text/bg hex values
  content = content.replace(/'#f4f4f5'/g, "'var(--text-primary)'");
  content = content.replace(/'#a1a1aa'/g, "'var(--text-muted)'");
  content = content.replace(/'#71717a'/g, "'var(--text-secondary)'");
  content = content.replace(/'#09090b'/g, "'var(--bg-secondary)'");
  content = content.replace(/'#000'/g, "'var(--bg-deep)'");
  content = content.replace(/'black'/g, "'var(--bg-primary)'");
  
  if (content !== initial) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log('Refactored inline colors in:', file);
  }
});
