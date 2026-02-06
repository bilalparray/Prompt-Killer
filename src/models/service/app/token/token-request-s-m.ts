import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";

export class TokenRequestSM {
  companyCode!: string;
  loginId!: string;
  password!: string;
  roleType!: RoleTypeSM;
}
