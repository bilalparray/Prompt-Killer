import { AppConstants } from "@/constants/app-constants";
import { PromptImageClient } from "@/api/prompt-image.client";
import { BaseService } from "./base.service";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";

export class PromptImageService extends BaseService {
  constructor(private promptImageClient: PromptImageClient) {
    super();
  }

  async getPromptImages(skip: number = 0, top: number = 100): Promise<ApiResponse<PromptImageSM[]>> {
    const resp = await this.promptImageClient.GetPromptImages(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptImagesCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptImageClient.GetPromptImagesCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptImages(skip: number = 0, top: number = 100): Promise<ApiResponse<PromptImageSM[]>> {
    const resp = await this.promptImageClient.GetTrendingPromptImages(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptImagesCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptImageClient.GetTrendingPromptImagesCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptImageById(id: number): Promise<ApiResponse<PromptImageSM>> {
    const resp = await this.promptImageClient.GetPromptImageById(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async createPromptImage(promptId: number, image: PromptImageSM): Promise<ApiResponse<BoolResponseRoot>> {
    if (!image || !image.imageBase64) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<PromptImageSM>();
    apiRequest.reqData = image;
    const resp = await this.promptImageClient.CreatePromptImage(promptId, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async createTrendingPromptImage(
    trendingPromptId: number,
    image: PromptImageSM
  ): Promise<ApiResponse<BoolResponseRoot>> {
    if (!image || !image.imageBase64) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<PromptImageSM>();
    apiRequest.reqData = image;
    const resp = await this.promptImageClient.CreateTrendingPromptImage(trendingPromptId, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async updatePromptImage(id: number, image: PromptImageSM): Promise<ApiResponse<PromptImageSM>> {
    if (!image || !image.imageBase64) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<PromptImageSM>();
    apiRequest.reqData = image;
    const resp = await this.promptImageClient.UpdatePromptImage(id, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async deletePromptImage(id: number): Promise<ApiResponse<DeleteResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.promptImageClient.DeletePromptImage(id);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Delete_Data_Error);
    }

    return resp;
  }
}
