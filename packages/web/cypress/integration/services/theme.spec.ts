describe('Services -> Theme', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Should load with the default dark theme first', () => {
    // Clear IndexedDB and reload the page
    cy.clearAppSettings();
    cy.reload();

    // White text indicates a dark background
    cy.get('body', { timeout: 10000 }).should('have.css', 'color', '#ffffff');
  });
  it('Should change the theme', () => {
    cy.get('app-home', { timeout: 10000 }).then(() => {
      //Wait for app to fully render
      cy.waitUntil(() =>
        cy
          .get('app-navbar', { timeout: 10000 })
          .shadow()
          .find('mwc-top-app-bar-fixed')
          .find('.change-theme'),
      ).then((el) =>
        cy
          .wrap(cy.$$(el))
          .click()
          .wait(2000) // Wait for transition
          .then(() => {
            cy.get('body').should('have.css', 'color', '#000000');
          }),
      );
    });
  });
  it('Should persist the light theme from previous test', () => {
    cy.get('body', { timeout: 10000 }).should('have.css', 'color', '#000000');
  });
});
