const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/RegisterPage.jsx', 'utf8');

const regex = /let targetUsername = "admin\.voy";[\s\S]*?if \(isAdminName && isAdminAvailable\) \{/m;

const replacement = `let adminUsername = "admin.voy";
        if (isAdminName) {
          adminUsername = await generateUniqueUsername("admin.voy");
        }

        const data = await registerUser(form.name, form.email, form.password);
        
        if (isAdminName) {`;

content = content.replace(regex, replacement);

// also we need to change targetUsername to adminUsername inside the payload
content = content.replace('username: targetUsername,', 'username: adminUsername,');

fs.writeFileSync('src/pages/auth/RegisterPage.jsx', content);
console.log('Fixed admin logic');
