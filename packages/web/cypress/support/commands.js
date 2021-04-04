// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import Color from 'color';
import { DB_NAME } from '../../src/services/settings/index.ts';
import 'cypress-wait-until';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  useAuthEmulator,
} from 'firebase/auth';

const app = initializeApp({
  apiKey: 'fake-api-key',
  projectId: 'lookahead-89164',
  authDomain: 'somedomain',
  databaseURL: 'somedomain',
  storageBucket: 'somedomain',
});
const auth = getAuth(app);
useAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

const hexToRgb = (color) => Color(color).rgb().string();
const compareCSSColor = (property, color) => (targetElement) => {
  const targetColor = targetElement.css(property);
  expect(targetColor).to.equal(hexToRgb(color));
};

Cypress.Commands.overwrite(
  'should',
  (originalFn, subject, expectation, ...args) => {
    const overrideMatchers = { 'have.css': compareCSSColor(args[0], args[1]) };
    if (typeof expectation === 'string' && overrideMatchers[expectation]) {
      return originalFn(subject, overrideMatchers[expectation]);
    }
    return originalFn(subject, expectation, ...args);
  },
);

Cypress.Commands.add('clearAppSettings', () => {
  cy.window().then((win) => {
    win.indexedDB.deleteDatabase(DB_NAME);
  });
});

Cypress.Commands.add('signIn', () => {
  cy.window().then((win) => {});
});

Cypress.Commands.add('createTestUser', async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      'clark@lookahead.web.app',
      'l00kahead',
    );
  } catch (err) {
    // Probably the user has been already created :)
    console.error(err);
  }
});
