const fs = require('fs');

// Read the CalculateScreen file
let content = fs.readFileSync('src/screens/CalculateScreen.tsx', 'utf8');

// Replace Colors references with theme.colors in JSX
content = content.replace(/fill={Colors\./g, 'fill={theme.colors.');
content = content.replace(/color={Colors\./g, 'color={theme.colors.');
content = content.replace(/tintColor={Colors\./g, 'tintColor={theme.colors.');

// Replace Colors references in styles
content = content.replace(/backgroundColor: Colors\./g, 'backgroundColor: theme.colors.');
content = content.replace(/color: Colors\./g, 'color: theme.colors.');
content = content.replace(/borderColor: Colors\./g, 'borderColor: theme.colors.');

// Fix the styles section to accept theme parameter
content = content.replace(
  'const styles = StyleSheet.create({',
  'const createStyles = (theme: any) => StyleSheet.create({'
);

// Update the component to use dynamic styles
content = content.replace(
  'style={styles.',
  'style={styles.'
);

// Write the updated content back
fs.writeFileSync('src/screens/CalculateScreen-updated.tsx', content);

console.log('CalculateScreen updated with theme support');