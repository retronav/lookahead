import {
  isSignInWithEmailLink,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { customElement, html, internalProperty, LitElement } from 'lit-element';
import { auth } from '../services/firebase';
import {
  sendSignInLinkEmail,
  signInWithEmailLink,
} from '../services/firebase/methods';
import { until } from 'lit-html/directives/until';
import { textFieldAndTextAreaColors } from '../styles';
import '@material/mwc-textfield';
import '../components/app-mwc-accent-button';
import { Router } from '@vaadin/router';

@customElement('app-signin')
export class AppSignIn extends LitElement {
  @internalProperty() email = '';
  static styles = [textFieldAndTextAreaColors];
  async sendLink() {
    try {
      await sendSignInLinkEmail(this.email);
      alert('A link has been sent to your email. Use it to sign in');
    } catch (error) {
      alert(
        `Oh no! Something went wrong! Additional info : ${
          error.message ?? error
        }`,
      );
    }
  }
  handleEmailInput(e: Event) {
    this.email = (e.target as HTMLInputElement).value;
  }
  private async signInAsTestBot() {
    await signInWithEmailAndPassword(
      auth,
      'clark@lookahead.web.app',
      'l00kahead',
    );
    Router.go('/app');
  }
  render() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const userSignedInTmpl = signInWithEmailLink()
        .then((user) =>
          user
            ? html`<h1>
                Logged in! Welcome, ${user.displayName}. You can now use the
                <a href="/app">app</a>.
              </h1>`
            : html`<h1>Couldn't log you in</h1>`,
        )
        .catch((e) => (e ? html`<h1>Couldn't log you in</h1>` : html``));
      return html` ${until(userSignedInTmpl, html`<p>Wait...</p>`)} `;
    } else {
      return html`
        <h1>Sign In to Lookahead</h1>

        ${import.meta.env.NODE_ENV !== 'production'
          ? html`
              <app-mwc-accent-button
                @click=${this.signInAsTestBot}
                outlined
                label="Sign in as test bot"
              ></app-mwc-accent-button>
            `
          : html``}
        <h2>Sign in with Email</h2>
        <mwc-textfield
          type="text"
          placeholder="Type your email"
          @input=${this.handleEmailInput}
          value="${this.email}"
        ></mwc-textfield>
        <br />
        <br />
        <app-mwc-accent-button
          outlined
          ?disabled=${!this.email}
          @click=${this.sendLink}
        >
          Sign in
        </app-mwc-accent-button>
      `;
    }
  }
}
