import { BaseService } from "./base.service";
import { LoaderInfo, LayoutViewModel } from "@/models/internal/common-models";
import { SweetAlertOptions } from "@/models/internal/custom-sweet-alert-options";

declare var Swal: any;

export class CommonService extends BaseService {
  layoutViewModel: LayoutViewModel = new LayoutViewModel();
  showNav: boolean = true;
  loaderInfo: LoaderInfo = { message: "", showLoader: false };
  /** Set by CommonProvider so loader state triggers React re-render; also used to hide loader before showing toast */
  setLoaderInfo: ((info: LoaderInfo) => void) | null = null;

  handleEnterKey(event: any): void {
    if (event.key === "Enter") {
      (event.target as HTMLElement).blur();
    }
  }

  async presentLoading(message: string = "") {
    this.loaderInfo = { message, showLoader: true };
    this.setLoaderInfo?.(this.loaderInfo);
  }

  /** Dismiss loader and resolve after a short delay so the overlay is gone before caller shows toast/msg */
  async dismissLoader(): Promise<void> {
    this.loaderInfo = { message: "", showLoader: false };
    this.setLoaderInfo?.(this.loaderInfo);
    return new Promise((resolve) => setTimeout(resolve, 120));
  }

  /**Show custom sweet alert*/
  async showSweetAlertConfirmation(alertOptions: SweetAlertOptions) {
    return await Swal.fire(alertOptions);
  }

  /** Show a toast message as per options */
  async showSweetAlertToast(alertOptions: SweetAlertOptions) {
    alertOptions.toast = true;
    if (!alertOptions.position) alertOptions.position = "bottom";
    if (!alertOptions.showConfirmButton) alertOptions.showConfirmButton = false;
    if (!alertOptions.timer) alertOptions.timer = 3000;
    if (!alertOptions.timerProgressBar) alertOptions.timerProgressBar = true;
    alertOptions.didOpen = (toast: any) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    };
    return await Swal.fire(alertOptions);
  }

  /**Change Enum value to string Array*/
  enumToStringArray(enumType: any) {
    const StringIsNumber = (value: any) => isNaN(Number(value)) === false;
    return Object.keys(enumType)
      .filter(StringIsNumber)
      .map((key) => enumType[key]);
  }

  /**Change Enum value to string*/
  singleEnumToString(enumme: any, selectedValue: any) {
    const StringIsNumber = (value: any) => isNaN(Number(value)) === false;
    const x = Object.keys(enumme)
      .filter(StringIsNumber)
      .map((key) => enumme[key])[selectedValue];
    return x;
  }
}
