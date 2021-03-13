import { customElement, html, LitElement } from 'lit-element';

@customElement('app-404')
export class App404 extends LitElement {
  render() {
    return html`<h1>Oops, 404!</h1>`;
  }
}
