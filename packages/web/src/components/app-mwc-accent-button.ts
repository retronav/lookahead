import { ButtonBase } from '@material/mwc-button/mwc-button-base';
import { style as ButtonStyles } from '@material/mwc-button/styles-css';
import { CSSResult, customElement, css } from 'lit-element';

@customElement('app-mwc-accent-button')
export class AppAccentButton extends ButtonBase {
  static styles: CSSResult[] = [
    ButtonStyles,
    css`
      :host {
        --mdc-button-outline-color: var(--mdc-theme-secondary);
        --mdc-theme-primary: var(--mdc-theme-secondary);
        --mdc-theme-on-primary: var(--mdc-theme-on-secondary);
      }
    `,
  ];
}
