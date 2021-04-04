describe('Landing page', () => {
  const title = 'Lookahead Alpha';
  it('Window title should be the correct one', () => {
    cy.visit('/');
    cy.title().should('equal', title);
  });
  it('Should contain a signin button that will lead to the signin page', () => {
    // The app loads the file on route to signin so intercept the file instead
    cy.intercept('/app-signin.ts').as('signInModuleLoaded');
    cy.visit('/');
    cy.get('app-home')
      .shadow()
      .find('app-mwc-accent-button.goto-sign-in')
      .click();
    cy.wait('@signInModuleLoaded');
    cy.window().url().should('contain', '/signin');
  });
});
