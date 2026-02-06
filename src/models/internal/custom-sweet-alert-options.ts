export interface SweetAlertOptions {
  title?: string;
  titleText?: string;
  text?: string;
  html?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
  iconHtml?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  toast?: boolean;
  position?: "top" | "top-start" | "top-end" | "center" | "center-start" | "center-end" | "bottom" | "bottom-start" | "bottom-end";
  timer?: number;
  timerProgressBar?: boolean;
  customClass?: {
    container?: string;
    popup?: string;
    title?: string;
    closeButton?: string;
    icon?: string;
    image?: string;
    htmlContainer?: string;
    input?: string;
    inputLabel?: string;
    validationMessage?: string;
    actions?: string;
    confirmButton?: string;
    denyButton?: string;
    cancelButton?: string;
    loader?: string;
    footer?: string;
    timerProgressBar?: string;
  };
  didOpen?: (toast: any) => void;
}
