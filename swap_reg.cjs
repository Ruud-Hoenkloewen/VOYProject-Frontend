
const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/RegisterPage.jsx', 'utf8');

const s1 = '<div style={{ marginBottom: \'1.5rem\', display: \'flex\', justifyContent: \'center\' }}>';
const s2 = '<form className={styles.form} onSubmit={handleSubmit} noValidate>';
const s3 = '</form>';

const p1 = content.indexOf(s1);
const p2 = content.indexOf(s2);
const p3 = content.indexOf(s3);

if (p1 === -1 || p2 === -1 || p3 === -1) {
  console.error('Markers not found');
  process.exit(1);
}

let googleBlock = content.substring(p1, p2);
let formBlock = content.substring(p2, p3 + 7);

const dividerStart = googleBlock.indexOf('<div style={{ display: \'flex\', alignItems: \'center\', marginBottom: \'1.5rem\' }}>');
if (dividerStart === -1) {
    console.error('Divider not found');
    process.exit(1);
}

let btnPart = googleBlock.substring(0, dividerStart);
let divPart = googleBlock.substring(dividerStart);

divPart = divPart.replace('O registrate con email', 'O registrate con Google');
divPart = divPart.replace('marginBottom: \'1.5rem\'', 'margin: \'1.5rem 0\'');

const newContent = content.substring(0, p1) + formBlock + '\n\n' + divPart + btnPart + content.substring(p3 + 7);

fs.writeFileSync('src/pages/auth/RegisterPage.jsx', newContent);
console.log('Swapped successfully');

