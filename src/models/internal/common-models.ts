import { RoleTypeSM } from "../enums/role-type-s-m.enum";

export interface LoaderInfo {
  message: string;
  showLoader: boolean;
}

export class LayoutViewModel {
  leftMenuClass!: string;
  rightMenuClass!: string;
  showRightMenu!: boolean;
  showLeftMenu!: boolean;
  showNav!: boolean;
  loggedInUserType = RoleTypeSM;
  updateAvailable!: boolean;
  feedbackTimerStarted: boolean = false;
  feedbackTimerStartTime: number | null = null;
  feedbackIntervalHandle: any = null;
}

export interface MenuItem {
  routePath: string;
  routeName: string;
  isActive: boolean;
  iconName: boolean;
}

export interface InputControlInformation {
  controlName: string;
  hasError: boolean;
  placeHolder: string;
  errorMessage: string;
  isRequired: boolean;
  pattern?: string;
  maxlength?: number;
  minlength?: number;
  validations: ValidationMessageInformation[];
}

export interface ValidationMessageInformation {
  type: string;
  message: string;
}
