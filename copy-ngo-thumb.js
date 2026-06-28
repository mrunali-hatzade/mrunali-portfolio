const fs = require('fs');
const src = "C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\6ebd4f96-ae4b-40b9-85a8-b355b7f8d280\\ngo_website_thumbnail_1782585814807.png";
const dest = "d:\\Portfolio\\done\\public\\ngo-thumb.png";
fs.copyFileSync(src, dest);
console.log("Done! ngo-thumb.png copied successfully.");
