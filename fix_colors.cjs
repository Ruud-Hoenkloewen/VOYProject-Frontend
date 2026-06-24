const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix background-primary to bg-canvas
  content = content.replace(/--ds-color-background-primary/g, '--ds-color-bg-canvas');
  content = content.replace(/--ds-color-background-secondary/g, '--ds-color-bg-surface');

  // Fix fallback hex in var() like var(--foo, #123)
  content = content.replace(/var\((--[\w-]+),\s*#[a-fA-F0-9]{3,6}\)/g, 'var($1)');

  // Replace standalone common hex codes (rough approximation)
  content = content.replace(/(?<!var\([^)]*)#fff(fff)?\b/gi, 'var(--ds-color-text-primary)');
  content = content.replace(/(?<!var\([^)]*)#000(000)?\b/gi, 'var(--ds-color-bg-canvas)');
  content = content.replace(/(?<!var\([^)]*)#C6F92B\b/gi, 'var(--ds-color-accent-primary)');
  content = content.replace(/(?<!var\([^)]*)#00E5FF\b/gi, 'var(--ds-color-cyan-400)');
  content = content.replace(/(?<!var\([^)]*)#FF4444\b/gi, 'var(--ds-color-state-danger)');
  content = content.replace(/(?<!var\([^)]*)#FFAA00\b/gi, 'var(--ds-color-yellow-300)');
  content = content.replace(/(?<!var\([^)]*)#1a1a1a\b/gi, 'var(--ds-color-border-editorial)');
  content = content.replace(/(?<!var\([^)]*)#111(111)?\b/gi, 'var(--ds-color-bg-surface)');
  content = content.replace(/(?<!var\([^)]*)#333(333)?\b/gi, 'var(--ds-color-border-editorial-mid)');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walk('./src');
