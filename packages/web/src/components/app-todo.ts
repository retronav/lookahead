import {
  customElement,
  html,
  LitElement,
  property,
  css,
  queryAsync,
  query,
  eventOptions,
} from 'lit-element';

import '@material/mwc-ripple/mwc-ripple';
import type { Ripple } from '@material/mwc-ripple/mwc-ripple';
import { RippleHandlers } from '@material/mwc-ripple/ripple-handlers';
import { style as elevationStyle } from '@material/mwc-elevation-overlay/mwc-elevation-overlay-css';

export interface Todo {
  title: string;
  content?: string;
  last_edited: string;
  id: string;
}

@customElement('app-todo')
export class AppTodo extends LitElement {
  @property({ reflect: true, type: Object }) data: Todo;
  @queryAsync('mwc-ripple') ripple!: Promise<Ripple | null>;
  @query('.todo')
  todoElement!: HTMLLIElement;
  protected rippleHandlers = new RippleHandlers(() => {
    return this.ripple;
  });
  focus() {
    const todoElement = this.todoElement;
    if (todoElement) {
      this.rippleHandlers.startFocus();
      todoElement.focus();
    }
  }

  blur() {
    const todoElement = this.todoElement;
    if (todoElement) {
      this.rippleHandlers.endFocus();
      todoElement.blur();
    }
  }
  constructor() {
    super();
    this.data = { title: '', last_edited: '', id: '' };
  }
  static styles = [
    elevationStyle,
    css`
      li {
        cursor: pointer;
        user-select: none;
        /* Never ever forget this line; lest you will 
        waste whole day figuring out the ripple */
        position: relative;
        list-style: none;
        max-width: var(--todo-width, calc(100% - 2em));
        height: 25vh;
        padding: 1em;
        padding-top: 0;
        margin: 1em 0;
        border: 1px solid var(--mdc-theme-on-surface, #000);
        border-radius: 5px;
        color: var(--mdc-theme-on-surface, #000);
        --mdc-elevation-overlay-opacity: 9%;
      }
      .content {
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      li:hover,
      li:focus {
        --mdc-elevation-overlay-opacity: 15%;
      }
      li:active {
        --mdc-elevation-overlay-opacity: 24%;
      }
      mwc-ripple {
        height: 100%;
        width: 100%;
        --mdc-ripple-color: var(--mdc-theme-on-surface, #000);
      }
    `,
  ];
  handleClick() {
    const openDialogEvent = new CustomEvent('openEditTodoDialog', {
      detail: this.data,
    });
    const todoDialogElement = (this.getRootNode() as ShadowRoot).host.shadowRoot?.querySelector(
      'app-todo-dialog',
    );
    todoDialogElement!.dispatchEvent(openDialogEvent);
  }
  render() {
    return html`
      <li
        class="todo"
        @click=${this.handleClick}
        @focus="${this.handleRippleFocus}"
        @blur="${this.handleRippleBlur}"
        @mousedown="${this.handleRippleActivate}"
        @mouseenter="${this.handleRippleMouseEnter}"
        @mouseleave="${this.handleRippleMouseLeave}"
        @touchstart="${this.handleRippleActivate}"
        @touchend="${this.handleRippleDeactivate}"
        @touchcancel="${this.handleRippleDeactivate}"
      >
        <div class="mdc-elevation-overlay"></div>
        <mwc-ripple secondary></mwc-ripple>
        <h2 class="title">${this.data.title}</h2>
        <p class="content">
          ${
            //If newlines are there, show only two segments of newlines
            this.data.content?.split('\n').map((l, i) => {
              if (i <= 1) {
                return html`<span>
                  ${l +
                  (i === 1 &&
                  (this.data.content as string).split('\n').length > 2
                    ? ' ...'
                    : '')}
                  <br />
                </span>`;
              } else return;
            })
          }
        </p>
        <small>${this.lastEditedHumanFormat(this.data.last_edited)}</small>
      </li>
    `;
  }

  private lastEditedHumanFormat(date: string) {
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(Date.parse(date));
    return formattedDate;
  }

  // Ripple event options courtesy
  //https://github.com/material-components/material-components-web-components/blob/24fe7ba60667e57ce1d13133ce112221ab116ce5/packages/button/mwc-button-base.ts
  @eventOptions({ passive: true })
  private handleRippleActivate(evt?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.rippleHandlers.startPress(evt);
  }

  private handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  private handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  private handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  private handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  private handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }
}
