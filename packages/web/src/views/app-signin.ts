import { isSignInWithEmailLink } from 'firebase/auth';
import { customElement, html, internalProperty, LitElement } from 'lit-element';
import { auth } from '../services/firebase';
import {
  sendSignInLinkEmail,
  signInWithEmailLink,
} from '../services/firebase/methods';
import { until } from 'lit-html/directives/until';

@customElement('app-signin')
export class AppSignIn extends LitElement {
  @internalProperty() email = '';
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
  render() {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const userSignedInTmpl = signInWithEmailLink()
        .then((user) =>
          user
            ? html`<h1>
                Logged in! Welcome, ${user.displayName}. You can now use the
                <a href="/">app</a>.
              </h1>`
            : html`<h1>Couldn't log you in</h1>`,
        )
        .catch((e) => (e ? html`<h1>Couldn't log you in</h1>` : html``));
      return html` ${until(userSignedInTmpl, html`<p>Wait...</p>`)} `;
    } else {
      return html`
        <h1>Sign In to Lookahead</h1>

        <h2>Sign in with Email</h2>
        <input
          type="text"
          placeholder="Type your email"
          @change=${this.handleEmailInput}
          value="${this.email}"
        />
        <button @click=${this.sendLink}>Sign in</button>
      `;
    }
  }
}
