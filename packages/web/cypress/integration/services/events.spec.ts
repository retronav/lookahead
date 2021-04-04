import { emitCustomEvent } from '../../../src/services/events';
describe('Services -> Events', () => {
  beforeEach(() => cy.visit('/'));
  const eventName = 'lookaheadIsAwesome';
  const eventDetail = { meaningOfLife: 42 };
  it(`Should fire a custom event named '${eventName}'`, () => {
    const mockFn = cy.spy();
    cy.window().then((win) => {
      win.addEventListener(eventName, mockFn);
      cy.wait(1000);
      const eventEmitted = emitCustomEvent(eventName, null, win);
      expect(eventEmitted).to.be.true;
      expect(mockFn).to.be.calledOnce;
    });
  });
  it(`should fire a custom event named '${eventName}' with detail ${JSON.stringify(
    eventDetail,
  )}`, () => {
    const mockFn = cy.spy();
    cy.window().then((win) => {
      win.addEventListener(eventName, (evt: CustomEvent) => mockFn(evt.detail));
      cy.wait(1000);
      const eventEmitted = emitCustomEvent(eventName, eventDetail, win);
      expect(eventEmitted).to.be.true;
      expect(mockFn).to.be.calledOnce;
      expect(mockFn).to.be.calledWithExactly(eventDetail);
    });
  });
});
