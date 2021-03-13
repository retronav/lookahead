import '@material/mwc-top-app-bar-fixed';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { customElement, html, internalProperty, LitElement } from 'lit-element';
import { Router } from '@vaadin/router';
import { getThemeType, setDarkTheme, setLightTheme } from '../services/theme';

@customElement('app-navbar')
export class AppNavbar extends LitElement {
  @internalProperty() themeType = getThemeType();
  goToHomePage() {
    Router.go('/');
  }
  changeTheme() {
    switch (this.themeType) {
      case 'dark':
        setLightTheme();
        break;
      case 'light':
        setDarkTheme();
    }
    this.themeType = getThemeType();
    this.requestUpdate();
  }
  getThemeToggleName() {
    return (this.themeType === 'dark' ? 'light' : 'dark') + '_mode';
  }
  render() {
    return html`
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
            icon=${this.getThemeToggleName()}
          >
          </mwc-icon-button>
        </div>
      </mwc-top-app-bar-fixed>
    `;
  }
}
