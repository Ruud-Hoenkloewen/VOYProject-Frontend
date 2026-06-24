const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/RegisterPage.jsx', 'utf8');
content = content.replace('role: "client", // backend defaults to client on registration but we override on frontend', 'role: "admin", // Admin gets admin role');
fs.writeFileSync('src/pages/auth/RegisterPage.jsx', content);
console.log('Fixed admin role');
