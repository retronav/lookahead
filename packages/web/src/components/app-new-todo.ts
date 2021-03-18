import {
  customElement,
  html,
  LitElement,
  css,
  queryAsync,
  internalProperty,
} from 'lit-element';
import '@material/mwc-textfield';
import './app-mwc-textarea';
import './app-mwc-accent-button';
import { style as elevationStyle } from '@material/mwc-elevation-overlay/mwc-elevation-overlay-css';
import type { TextField } from '@material/mwc-textfield';
import type { AppTextArea } from './app-mwc-textarea';
import { textFieldAndTextAreaColors } from '../styles';
import type { AppAccentButton } from './app-mwc-accent-button';

@customElement('app-new-todo')
export class AppNewTodo extends LitElement {
  @queryAsync('mwc-textfield') textField!: Promise<TextField>;
  @queryAsync('app-mwc-textarea') textArea!: Promise<AppTextArea>;
  @queryAsync('.fallable') fallableSection!: Promise<HTMLElement>;
  @queryAsync('.cancel-button') cancelButton!: Promise<AppAccentButton>;
  @internalProperty() shouldCollapse = true;
  static get styles() {
    return [
      elevationStyle,
      textFieldAndTextAreaColors,
      css`
        .wrapper {
          border: 1px solid var(--mdc-theme-on-surface, '#FFF');
          border-radius: 10px;
          position: relative;
          width: 90%;
          padding: 0.6em 0;
          margin: 0.4em 5%;
          --mdc-elevation-overlay-opacity: 2%;
        }
        .wrapper:hover {
          --mdc-elevation-overlay-opacity: 4%;
        }
        .wrapper:active {
          --mdc-elevation-overlay-opacity: 6%;
        }

        .fallable {
          width: 96%;
          padding: 0 2%;
        }
        mwc-textfield {
          --mdc-typography-subtitle1-font-size: 1.2rem;
          width: 96%;
          margin-left: 2%;
        }
        app-mwc-textarea {
          width: 100%;
        }
      `,
    ];
  }
  async updated() {
    [this.textField, this.textArea].map(async (x) => {
      (await x).shadowRoot!.querySelector<HTMLElement>(
        'label .mdc-line-ripple',
      )!.style.display = 'none';
    });
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', async (evt) => {
      if (evt.composedPath().includes(await this.cancelButton))
        this.hideCollapsible();
      if (!evt.composedPath().includes(this)) this.hideCollapsible();
    });
  }
  showCollapsible() {
    this.shouldCollapse = false;
    this.requestUpdate();
  }
  hideCollapsible() {
    this.shouldCollapse = true;
    this.requestUpdate();
  }
  render() {
    return html`
      <div class="wrapper" @click=${this.showCollapsible}>
        <div class="mdc-elevation-overlay"></div>
        <mwc-textfield placeholder="Add a note"></mwc-textfield>
        <section class="fallable" ?hidden=${this.shouldCollapse}>
          <app-mwc-textarea
            placeholder="Add some more content"
          ></app-mwc-textarea>
          <div style="text-align: center;">
            <app-mwc-accent-button
              class="save-button"
              label="Save"
              outlined
            ></app-mwc-accent-button>
            <app-mwc-accent-button
              class="cancel-button"
              @click=${this.hideCollapsible}
              label="Cancel"
              outlined
            ></app-mwc-accent-button>
          </div>
        </section>
      </div>
    `;
  }
}
