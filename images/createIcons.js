const fs = require('fs');

// Simple SVG icon for Minimal LinkedIn
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0077B5" rx="8" ry="8"/>
  <text x="50%" y="50%" font-family="Arial" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">ML</text>
</svg>
`;

// Function to convert SVG to PNG (this is a placeholder - would need a proper conversion library in a real implementation)
function saveSvgIcon(size) {
  fs.writeFileSync(`images/icon${size}.svg`, svgIcon);
  console.log(`Created icon${size}.svg`);
}

// Create icons in different sizes
saveSvgIcon(16);
saveSvgIcon(48);
saveSvgIcon(128);

console.log("Icon files created. You'll need to convert these SVGs to PNGs using an image editor or SVG-to-PNG conversion tool."); 