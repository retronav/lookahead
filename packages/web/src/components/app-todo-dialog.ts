import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  query,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import './app-mwc-textarea';
import './app-mwc-accent-button';
import type { Todo } from './app-todo';
import { AppEvents } from '../services/events/events';
import type { Dialog } from '@material/mwc-dialog';
import { textFieldAndTextAreaColors } from '../styles';

@customElement('app-todo-dialog')
export class AppTodoDialog extends LitElement {
  /** Initial value of this.data */
  private initalData: Todo = { title: '', last_edited: '', id: '' };
  @internalProperty() data: Todo = this.initalData;
  @query('mwc-dialog') dialogElement!: Dialog;
  static styles = [
    textFieldAndTextAreaColors,
    css`
      mwc-dialog * {
        color: var(--mdc-theme-on-surface, '#000');
      }
      mwc-dialog {
        --mdc-dialog-heading-ink-color: var(--mdc-theme-on-surface, '#000');
        --mdc-dialog-max-width: 80vw;
        --mdc-dialog-min-width: 75vw;
      }
      mwc-textfield,
      app-mwc-textarea {
        width: 90%;
      }
      mwc-textfield {
        --mdc-typography-subtitle1-font-size: 1.2rem;
      }
    `,
  ];
  handleEvent(evt: CustomEvent<Todo>) {
    this.data = evt.detail;
    this.dialogElement.show();
  }
  handleSave() {
    // Required to reset state and be able to open the dialog again
    this.dialogElement.close();
    this.data = this.initalData;
  }
  handleCancel() {
    // Required to reset state and be able to open the dialog again
    this.dialogElement.close();
    this.data = this.initalData;
  }
  constructor() {
    super();
    this.addEventListener(
      AppEvents.OPEN_EDIT_TODO_DIALOG,
      this.handleEvent.bind(this) as EventListener,
    );
  }
  render() {
    return html`
      <mwc-dialog
        escapeKeyAction=""
        scrimClickAction=""
        heading="Edit todo/note"
      >
        <mwc-textfield
          placeholder="Enter title of todo/note"
          type="text"
          value=${this.data.title}
        ></mwc-textfield>
        <br />
        <app-mwc-textarea
          maxLength="512"
          charCounter="external"
          placeholder="Enter content of todo/note"
          type="text"
          id="textarea"
          value=${ifDefined(this.data.content)}
        ></app-mwc-textarea>
        <app-mwc-accent-button
          outlined
          slot="primaryAction"
          dialogAction="save"
          @click=${this.handleSave}
          label="Save"
        >
        </app-mwc-accent-button>
        <app-mwc-accent-button
          outlined
          slot="secondaryAction"
          dialogAction="cancel"
          @click=${this.handleCancel}
          label="Cancel"
        >
        </app-mwc-accent-button>
      </mwc-dialog>
    `;
  }
}
