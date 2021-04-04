describe('App Page', () => {
  it("Should knock off to /signin since we're not signed in yet", () => {
    cy.intercept('/app-signin.ts').as('signInModuleLoaded');
    cy.visit('/app');
    cy.wait('@signInModuleLoaded');
    cy.url().should('contain', 'signin');
  });
  it('Should create a test user', () => {
    cy.createTestUser();
  });
});
