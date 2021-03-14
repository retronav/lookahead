import {
  customElement,
  css,
  html,
  internalProperty,
  LitElement,
  query,
} from 'lit-element';
import '@material/mwc-snackbar';
import '@material/mwc-button';
import '@material/mwc-icon-button';
import { AppEvents, OpenSnackBarEventDetails } from '../constants/events';
import type { Snackbar } from '@material/mwc-snackbar';

@customElement('app-snackbar')
export class AppSnackbar extends LitElement {
  @internalProperty() data: OpenSnackBarEventDetails = {
    buttons: { action: { enabled: false }, enableDismiss: false },
    label: '',
  };
  @query('mwc-snackbar') snackbar!: Snackbar;
  handleEvent(evt: CustomEvent<OpenSnackBarEventDetails>) {
    this.data = evt.detail;
    this.snackbar.show();
  }
  static styles = css`
    mwc-snackbar {
      user-select: none;
      --mdc-snackbar-action-color: var(--mdc-theme-secondary, #000);
    }
  `;
  constructor() {
    super();
    window.addEventListener(
      AppEvents.OPEN_SNACKBAR,
      this.handleEvent.bind(this) as EventListener,
    );
  }
  handleAction() {
    if (!!this.data.buttons.action.handleAction) {
      this.data.buttons.action.handleAction();
    }
  }
  handleDismiss() {}
  render() {
    return html`
      <mwc-snackbar labelText=${this.data.label}>
        ${this.data.buttons.action.enabled
          ? html`<mwc-button @click=${this.handleAction} slot="action">
              ${this.data.buttons.action.text}
            </mwc-button>`
          : html``}
        ${this.data.buttons.enableDismiss
          ? html`<mwc-icon-button
              @click=${this.handleDismiss}
              icon="close"
              slot="dismiss"
            ></mwc-icon-button>`
          : html``}
      </mwc-snackbar>
    `;
  }
}
