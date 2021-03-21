import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  query,
} from 'lit-element';
import type { User } from '@firebase/auth';
import type { Dialog } from '@material/mwc-dialog';
import { AppEvents } from '../services/events/events';
import '@material/mwc-dialog';
import '@material/mwc-icon';
import { auth } from '../services/firebase';
import { Router } from '@vaadin/router';

@customElement('app-user-info-dialog')
export class AppUserInfoDialog extends LitElement {
  @internalProperty() user: User | null = auth.currentUser;
  @query('mwc-dialog') dialogElement!: Dialog;
  static styles = css`
    mwc-dialog * {
      color: var(--mdc-theme-on-surface, '#000');
    }
    mwc-dialog {
      --mdc-dialog-heading-ink-color: var(--mdc-theme-on-surface, '#000');
      --mdc-dialog-max-width: 80vw;
      --mdc-dialog-min-width: 20vw;
    }
    .avatar {
      border-radius: 50%;
      width: 128px;
      height: 128px;
      object-fit: cover;
    }
  `;
  constructor() {
    super();
    this.addEventListener(
      AppEvents.OPEN_USER_DIALOG,
      this.handleEvent.bind(this) as EventListener,
    );
    auth.onAuthStateChanged((user) => {
      this.user = user;
      this.requestUpdate();
    });
  }
  handleEvent() {
    this.dialogElement.show();
  }
  render() {
    const dialogContent = (user: User | null) =>
      user
        ? html`
            <div class="user-info" style="text-align: center;">
              ${user.photoURL
                ? html` <img class="avatar" src=${user.photoURL} />`
                : html`<mwc-icon>account_circle</mwc-icon>`}
              <h2>${user.displayName}</h2>
            </div>
            <app-mwc-accent-button outlined slot="primaryAction">
              Edit
            </app-mwc-accent-button>
          `
        : html`
            <h2>You're not logged in</h2>
            <app-mwc-accent-button
              slot="primaryAction"
              dialogAction="close"
              outlined
              @click=${() => Router.go('/signin')}
              >Sign in</app-mwc-accent-button
            >
          `;

    return html`
      <mwc-dialog heading="Account Information">
        ${dialogContent(this.user)}
      </mwc-dialog>
    `;
  }
}
