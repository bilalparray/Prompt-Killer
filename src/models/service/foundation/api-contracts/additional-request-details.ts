import { AxiosResponse } from "axios";
import { IDictionaryCollection } from "@/models/internal/Idictionary-collection";
import { ApiResponse } from "./base/api-response";

export enum Authentication {
  true,
  false,
  automationToken,
}

export class AdditionalRequestDetails<OutResp> {
  constructor(
    useCacheIfPossible: boolean,
    enableAuth: Authentication = Authentication.true
  ) {
    this.useCacheIfPossible = useCacheIfPossible;
    this.enableAuth = enableAuth;
  }
  enableAuth = Authentication.true;
  useCacheIfPossible = false;
  forceGetResponseFromApi = false;
  headers: IDictionaryCollection<string, string> | null = null;
  contentType = "application/json";
  custRespResolver: ((resp: AxiosResponse) => ApiResponse<OutResp>) | null = null;
}
