const fs = require('node:fs');
const path = require('node:path');

const fontPath = path.join(__dirname, 'assets', 'fonts');

console.log('Checking fonts directory:', fontPath);
console.log('Directory exists:', fs.existsSync(fontPath));

if (fs.existsSync(fontPath)) {
  const files = fs.readdirSync(fontPath);
  console.log('\nFont files found:');
  files.forEach(file => {
    const filePath = path.join(fontPath, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.size} bytes)`);
  });
  
  // Check specific font file
  const spaceGroteskPath = path.join(fontPath, 'SpaceGrotesk-Regular.ttf');
  console.log('\nSpaceGrotesk-Regular.ttf exists:', fs.existsSync(spaceGroteskPath));
  
  if (fs.existsSync(spaceGroteskPath)) {
    const fontData = fs.readFileSync(spaceGroteskPath);
    console.log('Font file is readable, size:', fontData.length, 'bytes');
    
    // Check if it's a valid TTF file (starts with specific bytes)
    const ttfSignature = fontData.slice(0, 4);
    console.log('File signature (hex):', ttfSignature.toString('hex'));
    
    // TTF files typically start with 00 01 00 00 or similar
    const isValidTTF = ttfSignature[0] === 0x00 && ttfSignature[1] === 0x01;
    console.log('Appears to be valid TTF:', isValidTTF);
  }
}