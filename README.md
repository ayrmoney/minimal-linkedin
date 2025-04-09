# Minimal LinkedIn

![screenshot](https://github.com/user-attachments/assets/807c2ab4-ab82-4066-805a-abe453e18ad6)

A Chrome extension that simplifies the LinkedIn interface by hiding most UI elements, leaving only the essential parts:
- The LinkedIn logo
- The search bar
- The "create post" element

## What Gets Hidden
- All navigation menu items (Home, My Network, Jobs, Messaging, etc.)
- All sidebar elements (profile information, news, ads)
- LinkedIn Premium upsell prompts
- Feed content (posts, articles, etc.)
- Footer elements
- Messaging overlay
- Advertisements and promotional content
- Any other distracting UI elements

## Installation

### From Source
1. Clone this repository or download it as a ZIP file and extract it
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension will now be installed and active when you visit LinkedIn

### From Chrome Web Store
*(Note: This extension is not yet available on the Chrome Web Store)*

## Usage

1. Visit LinkedIn.com
2. The interface will be automatically simplified, hiding most UI elements
3. You'll only see the LinkedIn logo, search bar, and create post element

## Customization

If you'd like to customize which elements are hidden or shown:

1. Edit the `styles.css` file to change which CSS selectors are hidden
2. Edit the `content.js` file to adjust how dynamic elements are handled
3. Reload the extension from the Chrome extensions page

## Development

To generate icon files:
1. Run `node images/createIcons.js` to create SVG icons
2. Convert the SVGs to PNGs using an image editor or conversion tool
3. Ensure the icon files are properly placed in the `images` directory

## License

See the LICENSE file for details. 
