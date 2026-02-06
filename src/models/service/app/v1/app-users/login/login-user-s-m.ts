import { LoginStatusSM } from "@/models/enums/login-status-s-m.enum";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";

export class LoginUserSM {
  id!: number;
  roleType!: RoleTypeSM;
  loginId!: string;
  firstName!: string;
  middleName!: string;
  lastName!: string;
  emailId!: string;
  passwordHash!: string;
  phoneNumber!: string;
  profilePicturePath!: string;
  isPhoneNumberConfirmed!: boolean;
  isEmailConfirmed!: boolean;
  loginStatus!: LoginStatusSM;
  dateOfBirth!: Date;
  createdBy!: string;
  lastModifiedBy!: string;
  createdOnUTC!: Date;
  lastModifiedOnUTC!: Date;
}
