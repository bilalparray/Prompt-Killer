import { AxiosResponse } from "axios";
import { AppConstants } from "@/constants/app-constants";
import { IDictionaryCollection } from "@/models/internal/Idictionary-collection";
import { DictionaryCollection } from "@/models/internal/dictionary-collection";
import { StorageService } from "@/services/storage.service";

export class CommonResponseCodeHandler {
  public handlerDict: IDictionaryCollection<string, (resp: AxiosResponse) => string>;

  constructor(private storageService: StorageService) {
    this.handlerDict = new DictionaryCollection<string, (resp: AxiosResponse) => string>();
    this.AddCommonHandlers();
  }

  async AddCommonHandlers() {
    this.handlerDict.Add("401", (resp) => {
      this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.AUTOMATION_TOKEN);
      this.storageService.removeFromStorage(AppConstants.DATABASE_KEYS.ACCESS_TOKEN);
      // Navigation will be handled by the component/guard

      // Extract display message
      const res = resp.request?.response || resp.data;
      const parsed = typeof res === "string" ? JSON.parse(res) : res;
      const displayMessage =
        parsed?.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Unauthorized_User;

      return displayMessage;
    });
  }
}
