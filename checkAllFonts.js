const fs = require('node:fs');
const path = require('node:path');

const fontPath = path.join(__dirname, 'assets', 'fonts');
const fonts = fs.readdirSync(fontPath);

console.log('Checking all font files:\n');

fonts.forEach(file => {
  if (file.endsWith('.ttf')) {
    const filePath = path.join(fontPath, file);
    const fontData = fs.readFileSync(filePath);
    const signature = fontData.slice(0, 8);
    
    console.log(`${file}:`);
    console.log(`  Size: ${fontData.length} bytes`);
    console.log(`  First 8 bytes (hex): ${signature.toString('hex')}`);
    console.log(`  First 8 bytes (ASCII): ${signature.toString('ascii').replaceAll(/[^\x20-\x7E]/g, '.')}`);
    
    // Check for common TTF/OTF signatures
    const hex = signature.toString('hex');
    if (hex.startsWith('00010000') || hex.startsWith('4f54544f')) {
      console.log(`  ✓ Valid font signature`);
    } else if (hex === '0a0a0a0a0a0a0a0a') {
      console.log(`  ✗ File appears to be corrupted (contains only line feeds)`);
    } else {
      console.log(`  ? Unknown signature`);
    }
    console.log('');
  }
});