/// <reference types="cypress" />
/// <reference types="cypress-wait-until" />
declare namespace Cypress {
  interface Chainable<Subject> {
    /** Clears the App settings */
    clearAppSettings(): void;
    /** Creates a test user with email clark@lookahead.web.app 
    and password l00kahead */
    createTestUser(): Promise<void>;
  }
}
