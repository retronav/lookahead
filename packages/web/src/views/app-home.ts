import { customElement, LitElement, html, property } from 'lit-element';
import { auth } from '../services/firebase';
import '@material/mwc-button';
import '../components/app-mwc-accent-button';
import { Router } from '@vaadin/router';

@customElement('app-home')
export class AppHome extends LitElement {
  @property({ attribute: false }) user = auth.currentUser;
  route(path: string) {
    return () => Router.go(path);
  }
  constructor() {
    super();
    auth.onAuthStateChanged((user) => {
      if (user) this.user = user;
    });
  }
  render() {
    return html`
      <h1>This is Lookahead.</h1>
      <p>
        A fast, minimal to-do and notes app for everyone. <br />
        Keep the stuff with us, so that you can look ahead on what's going to
        come.
      </p>
      <p>Hello, ${this.user?.displayName ?? 'World'}!</p>
      ${this.user
        ? html` <app-mwc-accent-button
            class="goto-app"
            @click=${this.route('/app')}
            raised
            label="App"
          ></app-mwc-accent-button>`
        : html`
            <app-mwc-accent-button
              class="goto-sign-in"
              @click=${this.route('/signin')}
              raised
              label="Sign in to start
              using"
            ></app-mwc-accent-button>
          `}
    `;
  }
}
