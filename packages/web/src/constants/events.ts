/**
 * An enum containing custom event names used in the app for various
 * operations
 */
export enum AppEvents {
  /**
   * Event name for opening todo/note edit dialog
   */
  OPEN_EDIT_TODO_DIALOG = 'openEditTodoDialog',
  /**
   * Event name for opening a snackbar
   */
  OPEN_SNACKBAR = 'openSnackbar',
}

/**
 * Data passed in OPEN_SNACKBAR event
 */
export interface OpenSnackBarEventDetails {
  /**
   * Label text in snackbar
   */
  label: string;
  buttons: {
    action: {
      /**
       * Boolean to enable the action button. Defaults to false
       */
      enabled: boolean;
      /**
       * Text inside the action button. This will only work if
       * buttons.action.enabled is true
       */
      text?: string;
      /**
       * Function triggered when action button is clicked. This will only work if
       * buttons.action.enabled is true
       */
      handleAction?: () => void;
    };
    /**
     * Boolean to enable the dismiss button of the snackbar. Defaults to false
     */
    enableDismiss: boolean;
  };
}
