context("Lookahead Web App - Landing Page", async () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("should load the landing page without error", () => {});
  it("should contain a heading which changes tags according to viewport", () => {
    cy.viewport("iphone-7");
    cy.get("h2").contains("This is Lookahead.");
    cy.viewport("macbook-16");
    cy.get("h1").contains("This is Lookahead.");
  });
  it("sign in button should route to /signin", () => {
    const button = cy.get("a").contains("Sign in to start using");
    button.click();
    cy.url().should("contain", "/signin");
  });
});
