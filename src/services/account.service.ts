import { AppConstants } from "@/constants/app-constants";
import { AccountsClient } from "@/api/accounts.client";
import { BaseService } from "./base.service";
import { StorageService } from "./storage.service";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { TokenRequestSM } from "@/models/service/app/token/token-request-s-m";
import { TokenResponseSM } from "@/models/service/app/token/token-response-s-m";
import { ClientUserSM } from "@/models/service/app/v1/app-users/client-user-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";
import { ForgotPasswordSM } from "@/models/service/app/v1/app-users/forgot-password-s-m";
import { ResetPasswordRequestSM } from "@/models/service/app/v1/app-users/reset-password-request-s-m";
import { VerifyEmailRequestSM } from "@/models/service/app/v1/app-users/verify-email-request-s-m";

export class AccountService extends BaseService {
  constructor(
    private accountClient: AccountsClient,
    private storageService: StorageService
  ) {
    super();
  }

  async generateToken(
    tokenReq: TokenRequestSM,
    rememberUser: boolean
  ): Promise<ApiResponse<TokenResponseSM>> {
    if (!tokenReq || !tokenReq.loginId) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<TokenRequestSM>();
    apiRequest.reqData = tokenReq;
    const resp = await this.accountClient.GenerateToken(apiRequest);

    if (!resp.isError && resp.successData != null) {
      await this.storageService.saveToStorage(
        AppConstants.DATABASE_KEYS.REMEMBER_PWD,
        rememberUser
      );

      if (rememberUser) {
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.ACCESS_TOKEN,
          resp.successData.accessToken
        );
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.USER,
          tokenReq
        );
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.LOGIN_USER,
          resp.successData.loginUserDetails
        );
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.COMPANY_CODE,
          tokenReq.companyCode
        );
        // Save login credentials for remember me
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.SAVED_LOGIN_ID,
          tokenReq.loginId
        );
        await this.storageService.saveToStorage(
          AppConstants.DATABASE_KEYS.SAVED_PASSWORD,
          tokenReq.password
        );
      } else {
        // Clear saved credentials if remember me is false
        await this.storageService.removeFromStorage(
          AppConstants.DATABASE_KEYS.SAVED_LOGIN_ID
        );
        await this.storageService.removeFromStorage(
          AppConstants.DATABASE_KEYS.SAVED_PASSWORD
        );
        await this.storageService.saveToSessionStorage(
          AppConstants.DATABASE_KEYS.LOGIN_USER,
          resp.successData.loginUserDetails
        );
        await this.storageService.saveToSessionStorage(
          AppConstants.DATABASE_KEYS.COMPANY_CODE,
          tokenReq.companyCode
        );
        await this.storageService.saveToSessionStorage(
          AppConstants.DATABASE_KEYS.ACCESS_TOKEN,
          resp.successData.accessToken
        );
      }
    } else {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
    }

    return resp;
  }

  async logoutUser() {
    try {
      await this.storageService.removeFromSessionStorage(
        AppConstants.DATABASE_KEYS.ACCESS_TOKEN
      );
      await this.storageService.removeFromSessionStorage(
        AppConstants.DATABASE_KEYS.LOGIN_USER
      );
      await this.storageService.removeFromSessionStorage(
        AppConstants.DATABASE_KEYS.COMPANY_CODE
      );
    } catch (err) {
      await this.storageService.clearSessionStorage();
    }

    try {
      // Check if remember me was enabled before clearing
      const rememberMe = await this.storageService.getFromStorage(
        AppConstants.DATABASE_KEYS.REMEMBER_PWD
      );
      
      // Clear authentication tokens and user data
      await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.ACCESS_TOKEN);
      await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.LOGIN_USER);
      await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.COMPANY_CODE);
      
      // If remember me was enabled, keep the flag and credentials for next login
      // If remember me was not enabled, clear everything including saved credentials
      if (!rememberMe) {
        await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.REMEMBER_PWD);
        await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.SAVED_LOGIN_ID);
        await this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.SAVED_PASSWORD);
      }
      // If rememberMe was true, we keep REMEMBER_PWD, SAVED_LOGIN_ID, and SAVED_PASSWORD
    } catch (error) {
      await this.storageService.clearStorage();
    }
  }

  async Register(register: ClientUserSM): Promise<ApiResponse<BoolResponseRoot>> {
    if (register == null) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<ClientUserSM>();
    apiRequest.reqData = register;
    const resp = await this.accountClient.Register(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
    }

    return resp;
  }

  async VerifyEmail(verifyEmail: VerifyEmailRequestSM): Promise<ApiResponse<VerifyEmailRequestSM>> {
    if (verifyEmail == null) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<VerifyEmailRequestSM>();
    apiRequest.reqData = verifyEmail;
    const resp = await this.accountClient.VerifyEmail(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
    }

    return resp;
  }

  async resetPassword(
    resetPasswordRequestSM: ResetPasswordRequestSM
  ): Promise<ApiResponse<ResetPasswordRequestSM>> {
    if (resetPasswordRequestSM == null) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<ResetPasswordRequestSM>();
    apiRequest.reqData = resetPasswordRequestSM;
    const resp = await this.accountClient.ResetPassword(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
    }

    return resp;
  }

  async forgotPassword(forgotPassword: ForgotPasswordSM): Promise<ApiResponse<IntResponseRoot>> {
    if (forgotPassword.userName == null) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<ForgotPasswordSM>();
    apiRequest.reqData = forgotPassword;
    const resp = await this.accountClient.ForgotPassword(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unknown_Error);
    }

    return resp;
  }
}
