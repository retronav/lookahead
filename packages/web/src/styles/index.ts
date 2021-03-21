import { css } from 'lit-element';

export const textFieldAndTextAreaColors = css`
  mwc-textfield,
  app-mwc-textarea {
    --mdc-text-field-fill-color: transparent;
    --mdc-text-field-ink-color: var(--mdc-theme-on-surface, '#000');
    --mdc-theme-primary: var(--mdc-theme-secondary);
    --mdc-text-field-label-ink-color: #999999;
  }
`;
