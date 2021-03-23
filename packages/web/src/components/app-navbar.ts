import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import './app-user-info-dialog';
import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  query,
} from 'lit-element';
import { Router } from '@vaadin/router';
import {
  getThemeType,
  setDarkTheme,
  setLightTheme,
  ThemeType,
} from '../services/theme';
import {
  getTheme as getSettingsTheme,
  setTheme as setSettingsTheme,
} from '../services/settings';
import { until } from 'lit-html/directives/until';
import { setInitalTheme } from '../services/theme';
import { emitCustomEvent } from '../services/events';
import { AppEvents } from '../services/events/events';
import type { AppUserInfoDialog } from './app-user-info-dialog';
import { auth } from '../services/firebase';
import { ifDefined } from 'lit-html/directives/if-defined';

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  @internalProperty() themeType = getThemeType();
  @internalProperty() user = auth.currentUser;
  @query('app-user-info-dialog') userDialog!: AppUserInfoDialog;
  static get styles() {
    return css`
      @media (max-width: 599px) {
        .top-app-bar-spacer {
          height: 56px;
        }
      }
      .top-app-bar-spacer {
        display: block;
        width: 100vw;
        height: 64px;
      }
      mwc-icon-button img {
        border-radius: 50%;
      }
    `;
  }
  constructor() {
    super();
    auth.onAuthStateChanged((user) => {
      if (user) this.user = user;
      this.requestUpdate();
    });
  }
  goToHomePage() {
    Router.go('/');
  }
  async changeTheme() {
    switch (this.themeType) {
      case 'dark':
        await setSettingsTheme('light');
        setLightTheme();
        break;
      case 'light':
        await setSettingsTheme('dark');
        setDarkTheme();
        break;
    }
    this.themeType = getThemeType();
    this.requestUpdate();
  }
  private themeToggler(initial: ThemeType) {
    return initial === 'dark' ? 'light' : 'dark';
  }
  async getThemeToggleName() {
    if (this.themeType === null) {
      this.themeType = await getSettingsTheme();
      this.requestUpdate();
    }
    return this.themeToggler(this.themeType) + '_mode';
  }
  openUserDialog() {
    emitCustomEvent(AppEvents.OPEN_USER_DIALOG, null, this.userDialog);
  }
  render() {
    return until(
      //Since navbar is the first component to render, the theme is set right here
      //and then the rendering happens
      setInitalTheme().then(
        () => html`
          <mwc-top-app-bar-fixed>
            <mwc-button
              @click=${this.goToHomePage}
              slot="title"
              unelevated
              label="Lookahead"
            ></mwc-button>
            <div slot="actionItems">
              <mwc-icon-button
                @click=${this.changeTheme}
                icon=${until(this.getThemeToggleName(), '')}
              >
              </mwc-icon-button>
              <mwc-icon-button
                icon=${ifDefined(
                  this.user && this.user.photoURL
                    ? undefined
                    : 'account_circle',
                )}
                @click=${this.openUserDialog}
              >
                ${this.user && this.user.photoURL
                  ? html`<img
                      src=${this.user.photoURL}
                      alt="Profile picture"
                    />`
                  : html``}
              </mwc-icon-button>
            </div>
          </mwc-top-app-bar-fixed>
          <app-user-info-dialog></app-user-info-dialog>
        `,
      ),
      html`<div class="top-app-bar-spacer" role="presentation"></div>`,
    );
  }
}
