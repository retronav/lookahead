import { customElement } from 'lit-element';
import '@material/mwc-textarea';
import { TextAreaBase } from '@material/mwc-textarea/mwc-textarea-base';
import { style as TextAreaStyles } from '@material/mwc-textarea/mwc-textarea-css';
import { style as TextfieldStyles } from '@material/mwc-textfield/mwc-textfield-css';

@customElement('app-mwc-textarea')
export class AppTextArea extends TextAreaBase {
  static styles = [TextfieldStyles, TextAreaStyles];
  async resize() {
    const inner = this.shadowRoot!.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    inner.style.height = 48 + 'px';
    inner.style.height = inner.scrollHeight + 'px';
    await this.updateComplete;
  }
  constructor() {
    super();
    this.addEventListener('input', this.resize.bind(this));
  }
  updated() {
    this.resize();
  }
}
