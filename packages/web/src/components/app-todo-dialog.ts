import {
  css,
  customElement,
  html,
  internalProperty,
  LitElement,
  unsafeCSS,
} from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import '@material/mwc-dialog';
import '@material/mwc-textfield';
import '@material/mwc-textarea';
import './app-mwc-accent-button';
import type { Todo } from './app-todo';
import type { TextArea } from '@material/mwc-textarea';
import { darken } from 'polished';
import { getTheme } from '../services/theme';
import { AppEvents } from '../constants/events';

@customElement('app-todo-dialog')
export class AppTodoDialog extends LitElement {
  @internalProperty() data: Todo = { title: '', last_edited: '', id: '' };
  @internalProperty() shouldOpen = false;
  static get styles() {
    const surfaceColor = getTheme().textSurface;
    return css`
      mwc-dialog * {
        color: var(--mdc-theme-on-surface, '#000');
      }
      mwc-dialog {
        --mdc-dialog-heading-ink-color: var(--mdc-theme-on-surface, '#000');
        --mdc-dialog-max-width: 80vw;
        --mdc-dialog-min-width: 75vw;
      }
      mwc-textfield,
      mwc-textarea {
        --mdc-text-field-fill-color: var(--mdc-theme-surface, '#FFF');
        --mdc-text-field-ink-color: var(--mdc-theme-on-surface, '#000');
        --mdc-theme-primary: var(--mdc-theme-secondary);
        --mdc-text-field-label-ink-color: ${unsafeCSS(
          darken(0.4)(surfaceColor || '#000'),
        )};
        width: 90%;
      }
      mwc-textfield {
        --mdc-typography-subtitle1-font-size: 1.2rem;
      }
      mwc-textarea {
        overflow: visible;
      }
    `;
  }
  handleEvent(evt: CustomEvent<Todo>) {
    this.data = evt.detail;
    this.shouldOpen = true;
    this.requestUpdate('shouldOpen', this.shouldOpen);
  }
  handleSave() {
    // Required to reset state and be able to open the dialog again
    this.shouldOpen = false;
  }
  handleCancel() {
    // Required to reset state and be able to open the dialog again
    this.shouldOpen = false;
  }
  async resize() {
    const outer = this.shadowRoot!.querySelector('mwc-textarea') as TextArea;
    const inner = outer.shadowRoot!.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    //Awaiting anything after incrementing rows allows to wait for a while
    //for the numbers to change. Weird but works
    const waitForRender = Promise.resolve(true);
    if (inner && outer) {
      outer.rows = 3;
      await waitForRender;
      while (inner.scrollHeight > inner.offsetHeight) {
        outer.rows = outer.rows + 1;
        await waitForRender;
      }
    }
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
        ?open=${this.shouldOpen}
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
        <mwc-textarea
          maxLength="512"
          charCounter="external"
          placeholder="Enter content of todo/note"
          type="text"
          id="textarea"
          @input="${this.resize}"
          value=${ifDefined(this.data.content)}
        ></mwc-textarea>
        <app-mwc-accent-button
          slot="primaryAction"
          dialogAction="save"
          @click=${this.handleSave}
          label="Save"
        >
        </app-mwc-accent-button>
        <app-mwc-accent-button
          slot="secondaryAction"
          dialogAction="cancel"
          @click=${this.handleCancel}
          label="Cancel"
        >
        </app-mwc-accent-button>
      </mwc-dialog>
    `;
  }
  async updated() {
    await this.resize();
  }
}
