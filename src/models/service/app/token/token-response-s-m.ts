import { LoginUserSM } from "../v1/app-users/login/login-user-s-m";

export class TokenResponseSM {
  accessToken!: string;
  expiresUtc!: Date;
  loginUserDetails!: LoginUserSM;
  clientCompanyId!: number;
  message!: string;
}
