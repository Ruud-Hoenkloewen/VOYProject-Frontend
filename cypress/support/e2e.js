// Manejar excepciones no capturadas de librerías de terceros (como Leaflet)
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

/**
 * 🐢 MODO PRESENTACIÓN / DEMO SLOW-DOWN
 * Pausa automática entre cada paso para la presentación/demo visual.
 * Ajustá SLOW_MODE_DELAY en milisegundos (ej: 1000ms para 1 segundo de pausa por paso).
 * Poné 0 si querés que corra a velocidad rápida normal.
 */
const SLOW_MODE_DELAY = 1000;

if (SLOW_MODE_DELAY > 0) {
  afterEach(() => {
    cy.wait(SLOW_MODE_DELAY);
  });
}
