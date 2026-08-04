describe('Módulo de perfil de usuario - Edición y visibilidad pública', { testIsolation: false }, () => {
  const rand = Math.floor(Math.random() * 899) + 100;
  const initialEmail = `fan${rand}@test.com`;
  const initialName = `Usuario Demo ${rand}`;

  const updatedNombre = `Fan Rockero ${rand}`;
  const updatedUsername = `fan_rock_${rand}`;
  const updatedLema = `El pogo no se negocia jamas`;
  const updatedBio = `Fanático de la música en vivo y la escena emergente de Tucumán.`;
  const updatedArtistas = `La Mugre, Código Rojo, Palco Roto`;
  const updatedRecital = `Wos en Tucumán 2024`;
  const updatedInstagram = `fan_rock_${rand}`;
  const updatedUbicacion = `Yerba Buena, Tucumán`;

  before(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    // Limpieza automática de datos de prueba previos en la base de datos
    cy.request('DELETE', 'http://localhost:5000/api/events/cleanup/test-data');
  });

  it('01. Debe registrar una nueva cuenta de usuario fan', () => {
    cy.visit('/register');
    cy.contains('SOY FAN').click();

    cy.get('input[name="name"]').type(initialName);
    cy.get('input[name="email"]').type(initialEmail);
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirmPassword"]').type('Password123!');

    cy.contains('button', 'CREAR MI CUENTA').click();
    cy.contains('button', 'CONFIRMAR Y REGISTRARME').click();
    cy.url({ timeout: 15000 }).should('not.include', '/register');
  });

  it('02. Debe ingresar a la pantalla de edición de perfil', () => {
    cy.visit('/profile/edit');
    cy.url().should('include', '/profile/edit');
  });

  it('03. Debe modificar los datos de identificación', () => {
    cy.get('input[placeholder="Tu nombre"]').clear().type(updatedNombre);
    cy.get('input[placeholder="usuario"]').clear().type(updatedUsername);
    cy.contains('span', '✓', { timeout: 8000 }).should('be.visible');

    cy.get('input[placeholder="Si no hay pogo no es recital..."]').clear().type(updatedLema);
    cy.get('textarea[placeholder="Contanos tu historia o descripción detallada..."]').clear().type(updatedBio);
  });

  it('04. Debe completar datos de redes y ubicación', () => {
    cy.get('input[placeholder="tu_usuario"]').clear().type(updatedInstagram);
    cy.get('input[placeholder="San Miguel de Tucumán, Argentina"]').clear().type(updatedUbicacion);
  });

  it('05. Debe seleccionar gustos musicales', () => {
    cy.get('input[placeholder="La Mugre, Código Rojo, Palco Roto..."]').clear().type(updatedArtistas);
    cy.get('input[placeholder="Wos en la Plaza de Toros, La Renga..."]').clear().type(updatedRecital);

    cy.contains('button', 'PUNK').click();
    cy.contains('button', 'GRUNGE').click();
    cy.contains('button', 'Pogo').click();
    cy.contains('button', 'Mosh pit').click();
  });

  it('06. Debe guardar los cambios y redirigir al perfil público', () => {
    cy.contains('button', 'GUARDAR').click();
    cy.contains('¡Perfil actualizado con éxito!', { timeout: 15000 }).should('be.visible');
    cy.url({ timeout: 15000 }).should('include', `/profile/${updatedUsername}`);
  });

  it('07. Debe verificar los datos de cabecera y lema en el perfil público', () => {
    cy.contains(updatedNombre, { timeout: 10000 }).scrollIntoView().should('be.visible');
    cy.contains(`@${updatedUsername}`).scrollIntoView().should('be.visible');
    cy.contains(`"${updatedLema}"`).scrollIntoView().should('be.visible');
    cy.contains(updatedUbicacion).scrollIntoView().should('be.visible');
  });

  it('08. Debe verificar la pestaña info, etiquetas y enlace a instagram', () => {
    cy.contains(updatedBio).scrollIntoView().should('be.visible');
    cy.contains(updatedArtistas).scrollIntoView().should('be.visible');
    cy.contains('PUNK').scrollIntoView().should('be.visible');
    cy.contains('GRUNGE').scrollIntoView().should('be.visible');
    cy.contains('Pogo').scrollIntoView().should('be.visible');
    cy.contains('Mosh pit').scrollIntoView().should('be.visible');
    cy.get(`a[href*="instagram.com/${updatedInstagram}"]`).scrollIntoView().should('exist');
  });
});
