describe('Módulo de productoras - Registro y publicación de eventos', { testIsolation: false }, () => {
  const rand = Math.floor(Math.random() * 899) + 100;
  const producerName = `Productora Tucumán ${rand}`;
  const producerEmail = `productora${rand}@test.com`;
  const eventTitle = `Festival Tucumán Rock ${rand}`;

  before(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    // Limpieza automática de datos de prueba previos en la base de datos
    cy.request('DELETE', 'http://localhost:5000/api/events/cleanup/test-data');
  });

  it('01. Debe abrir la página de registro y seleccionar rol productora', () => {
    cy.visit('/register');
    cy.contains('PRODUZCO EVENTOS').click();
  });

  it('02. Debe completar credenciales y registrar la cuenta de productora', () => {
    cy.get('input[name="name"]').type(producerName);
    cy.get('input[name="email"]').type(producerEmail);
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');

    cy.contains('button', 'CREAR MI CUENTA').click();
    cy.contains('button', 'CONFIRMAR Y REGISTRARME').click();

    cy.url({ timeout: 15000 }).should('include', '/dashboard/producer');
    cy.contains('PANEL PRODUCTOR').should('be.visible');
  });

  it('03. Debe ingresar al formulario de creación de eventos', () => {
    cy.visit('/dashboard/producer');
    cy.get('a[href="/events/create"]').click();
    cy.url().should('include', '/events/create');
    cy.contains('Crear Nuevo Evento').should('be.visible');
  });

  it('04. Debe completar la información básica y venue del show', () => {
    cy.get('input[name="nombre"]').type(eventTitle);
    cy.get('input[name="fecha"]').type('2026-11-20');
    cy.get('input[name="hora"]').type('22:00');
    cy.get('input[name="lugar"]').type('Oskar Bar, San Miguel de Tucumán');
  });

  it('05. Debe configurar entradas, precio, capacidad y lineup de artistas', () => {
    cy.get('input[name="precio"]').clear().type('5000');
    cy.get('input[name="capacidadTotal"]').clear().type('250');
    cy.get('input[placeholder="Nombre del artista / banda"]').first().type('Banda Headliner Local');
  });

  it('06. Debe seleccionar géneros musicales, ingresar descripción y publicar el evento', () => {
    cy.contains('Punk').click();
    cy.contains('Rock').click();
    cy.get('textarea[name="descripcion"]').type('Gran fecha de rock y punk en vivo en la ciudad de Tucumán.');

    cy.contains('button', 'PUBLICAR EVENTO').click();
    cy.url({ timeout: 15000 }).should('include', '/dashboard/producer');
  });

  it('07. Debe verificar que el evento aparezca activo en el dashboard de productora', () => {
    cy.visit('/dashboard/producer');
    cy.contains(eventTitle, { timeout: 15000 }).scrollIntoView().should('be.visible');
  });

  it('08. Debe confirmar que el evento esté visible en la cartelera pública', () => {
    cy.visit('/events');
    cy.contains(eventTitle, { timeout: 15000 }).scrollIntoView().should('be.visible');
  });
});
