const fs = require('fs');
let css = fs.readFileSync('src/pages/auth/RegisterPage.module.css', 'utf8');

const newCSS = `
/* Onboarding Step */
.onboardingStep {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  text-align: center;
  width: 100%;
}

.onboardingEyebrow {
  color: var(--ds-color-text-editorial-subtle);
  font-weight: 800;
  letter-spacing: 0.15em;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.onboardingTitle {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.onboardingTitleAccent {
  color: var(--ds-color-accent-primary);
}

.onboardingSubtitle {
  color: var(--ds-color-text-secondary);
  font-size: 1rem;
  margin-bottom: 3rem;
}

.onboardingCards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  width: 100%;
}

.onboardingCard {
  flex: 1;
  min-width: 280px;
  background: rgba(15, 15, 15, 0.5);
  border: 1px solid var(--ds-color-border-editorial-mid);
  border-radius: 4px;
  padding: 2.5rem 2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.onboardingCard:hover {
  background: var(--ds-color-bg-surface);
  border-color: var(--ds-color-text-primary);
  transform: translateY(-4px);
}

.onboardingCardActive {
  border-color: var(--ds-color-accent-primary);
  box-shadow: 0 0 20px rgba(163, 230, 53, 0.1);
}

.onboardingCardIcon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.onboardingCardTitle {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ds-color-accent-primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.onboardingCardDesc {
  font-size: 0.9rem;
  color: var(--ds-color-text-secondary);
  line-height: 1.5;
}

.onboardingFooter {
  margin-top: 4rem;
  font-size: 0.9rem;
  color: var(--ds-color-text-editorial-subtle);
}

.onboardingLoginLink {
  color: var(--ds-color-accent-primary);
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s;
}

.onboardingLoginLink:hover {
  opacity: 0.8;
}
`;

if (!css.includes('.onboardingStep')) {
  fs.writeFileSync('src/pages/auth/RegisterPage.module.css', css + '\n' + newCSS);
}
console.log('CSS updated');
