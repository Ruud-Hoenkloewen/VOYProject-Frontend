const fs = require('fs');
let content = fs.readFileSync('src/pages/auth/RegisterPage.jsx', 'utf8');

// 1. Add `step` state
content = content.replace(
  'const [selectedRole, setSelectedRole] = useState("usuario");',
  'const [selectedRole, setSelectedRole] = useState("usuario");\n  const [step, setStep] = useState(0);'
);

// 2. Remove the old inline role selector
const roleSelectorRegex = /<div className=\{styles\.field\}>\s*<label className=\{styles\.label\}>TIPO DE PERFIL<\/label>\s*<div className=\{styles\.roleSelector\}>[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(roleSelectorRegex, '');

// 3. Create the step 0 UI
const step0UI = `
  if (step === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.grain} aria-hidden="true" />
        <nav className={styles.nav}>
          <div className={styles.navLogo}>
            <LogoVoy />
          </div>
        </nav>
        
        <main className={styles.onboardingStep}>
          <p className={styles.onboardingEyebrow}>BIENVENIDO A LA MOVIDA</p>
          <h1 className={styles.onboardingTitle}>
            ¿QUÉ VENÍS <span className={styles.onboardingTitleAccent}>A HACER?</span>
          </h1>
          <p className={styles.onboardingSubtitle}>
            Elegí cómo querés ser parte de la escena.
          </p>

          <div className={styles.onboardingCards}>
            <div 
              className={styles.onboardingCard} 
              onClick={() => { setSelectedRole("usuario"); setStep(1); }}
            >
              <div className={styles.onboardingCardIcon}>🎫</div>
              <h3 className={styles.onboardingCardTitle}>SOY FAN</h3>
              <p className={styles.onboardingCardDesc}>
                Seguí artistas, comprá entradas y conectá con la escena local.
              </p>
            </div>

            <div 
              className={styles.onboardingCard} 
              onClick={() => { setSelectedRole("productor"); setStep(1); }}
            >
              <div className={styles.onboardingCardIcon}>🏢</div>
              <h3 className={styles.onboardingCardTitle}>PRODUZCO EVENTOS</h3>
              <p className={styles.onboardingCardDesc}>
                Publicá eventos, gestioná venues y vendé entradas.
              </p>
            </div>
          </div>

          <div className={styles.onboardingFooter}>
            ¿Ya tenés cuenta? <Link to="/login" className={styles.onboardingLoginLink}>Iniciá sesión</Link>
          </div>
        </main>
      </div>
    );
  }
`;

// Insert step0UI right before `return (` of the main render
const returnIndex = content.indexOf('return (');
content = content.substring(0, returnIndex) + step0UI + '\n  ' + content.substring(returnIndex);

fs.writeFileSync('src/pages/auth/RegisterPage.jsx', content);
console.log('RegisterPage updated');
