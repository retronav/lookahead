import { css, unsafeCSS } from 'lit-element';
import { darken } from 'polished';
import { getTheme } from '../services/theme';

export const textFieldAndTextAreaColors = css`
  mwc-textfield,
  app-mwc-textarea {
    --mdc-text-field-fill-color: transparent;
    --mdc-text-field-ink-color: var(--mdc-theme-on-surface, '#000');
    --mdc-theme-primary: var(--mdc-theme-secondary);
    --mdc-text-field-label-ink-color: ${unsafeCSS(
      darken(0.4)(getTheme().textSurface || '#000'),
    )};
  }
`;
