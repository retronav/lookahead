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
import { db } from '../services/firebase';
import { collection, doc, setDoc } from '@firebase/firestore';
import { AuthMethods } from '../services/firebase/methods';
import type { User } from '@firebase/auth';
import type { Todo } from './app-todo';

@customElement('app-new-todo')
export class AppNewTodo extends LitElement {
  @queryAsync('mwc-textfield') textField!: Promise<TextField>;
  @queryAsync('app-mwc-textarea') textArea!: Promise<AppTextArea>;
  @queryAsync('.fallable') fallableSection!: Promise<HTMLElement>;
  @queryAsync('.cancel-button') cancelButton!: Promise<AppAccentButton>;
  @queryAsync('.save-button') saveButton!: Promise<AppAccentButton>;
  @internalProperty() title = '';
  @internalProperty() content = '';

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
  async firstUpdated() {
    //Disable line ripple
    [this.textField, this.textArea].map(async (x) => {
      (await x).shadowRoot!.querySelector<HTMLElement>(
        'label .mdc-line-ripple',
      )!.style.display = 'none';
    });
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', async (evt) => {
      if (!evt.composedPath().includes(this)) this.hideCollapsible();
    });
  }
  private async handleWrapperClick(evt: MouseEvent) {
    // The buttons override the click event so exclude them
    if (
      evt.composedPath().includes(await this.cancelButton) ||
      evt.composedPath().includes(await this.saveButton)
    )
      return;
    else this.showCollapsible();
  }
  private async showCollapsible() {
    const fallable = await this.fallableSection;
    fallable.hidden = false;
  }
  private async hideCollapsible() {
    const fallable = await this.fallableSection;
    fallable.hidden = true;
  }
  /**
   * Function to manually reset the textfields as they somehow
   * don't provide a method which is shameful.
   */
  private resetTextFields() {
    [this.textField, this.textArea].map(async (x) => {
      (await x).value = '';
    });
  }
  private async handleSave() {
    if (!this.title) {
      this.resetTextFields();
      await this.hideCollapsible();
      return;
    }
    // Assertion to unknown and then to User is okay since
    // this will only load when the user is signed in.
    const user = ((await AuthMethods.getCurrentUser()) as unknown) as User;
    const newTodo = doc(collection(db, `users/${user.uid}/todos`));
    await setDoc<Partial<Todo>>(newTodo, {
      title: this.title,
      content: this.content,
      last_edited: new Date().toISOString(),
    });
    await this.hideCollapsible();
    this.resetTextFields();
  }
  private async handleCancel() {
    this.title = '';
    this.content = '';
    await this.hideCollapsible();
    this.resetTextFields();
  }
  render() {
    return html`
      <div class="wrapper" @click=${this.handleWrapperClick}>
        <div class="mdc-elevation-overlay"></div>
        <mwc-textfield
          value=${this.title}
          @input=${(e: KeyboardEvent) =>
            (this.title = (e.target as HTMLInputElement).value)}
          placeholder="Add a note"
        ></mwc-textfield>
        <section class="fallable" hidden>
          <app-mwc-textarea
            value=${this.content}
            @input=${(e: KeyboardEvent) =>
              (this.content = (e.target as HTMLTextAreaElement).value)}
            placeholder="Add some more content"
          ></app-mwc-textarea>
          <div style="text-align: center;">
            <app-mwc-accent-button
              class="save-button"
              label="Save"
              @click=${this.handleSave}
              ?disabled=${!this.title}
              outlined
            ></app-mwc-accent-button>
            <app-mwc-accent-button
              class="cancel-button"
              @click=${this.handleCancel}
              label="Cancel"
              outlined
            ></app-mwc-accent-button>
          </div>
        </section>
      </div>
    `;
  }
}
