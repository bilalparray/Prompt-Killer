import { AppConstants } from "@/constants/app-constants";
import { TrendingPromptClient } from "@/api/trending-prompt.client";
import { BaseService } from "./base.service";
import { TrendingPromptSM } from "@/models/service/app/v1/prompt/trending-prompt-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";

export class TrendingPromptService extends BaseService {
  constructor(private trendingPromptClient: TrendingPromptClient) {
    super();
  }

  async getTrendingPrompts(skip: number = 0, top: number = 100): Promise<ApiResponse<TrendingPromptSM[]>> {
    const resp = await this.trendingPromptClient.GetTrendingPrompts(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptsCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.trendingPromptClient.GetTrendingPromptsCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptById(id: number): Promise<ApiResponse<TrendingPromptSM>> {
    const resp = await this.trendingPromptClient.GetTrendingPromptById(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptsForUser(skip: number = 0, top: number = 100): Promise<ApiResponse<TrendingPromptSM[]>> {
    const resp = await this.trendingPromptClient.GetTrendingPromptsForUser(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getTrendingPromptByIdForUser(id: number): Promise<ApiResponse<TrendingPromptSM>> {
    const resp = await this.trendingPromptClient.GetTrendingPromptByIdForUser(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getMostLikedTrendingPrompts(skip: number = 0, top: number = 100): Promise<ApiResponse<TrendingPromptSM[]>> {
    const resp = await this.trendingPromptClient.GetMostLikedTrendingPrompts(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getMostLikedTrendingPromptsCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.trendingPromptClient.GetMostLikedTrendingPromptsCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async createTrendingPrompt(trendingPrompt: TrendingPromptSM): Promise<ApiResponse<BoolResponseRoot>> {
    if (!trendingPrompt || !trendingPrompt.title || !trendingPrompt.promptText) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<TrendingPromptSM>();
    apiRequest.reqData = trendingPrompt;
    const resp = await this.trendingPromptClient.CreateTrendingPrompt(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async updateTrendingPrompt(id: number, trendingPrompt: TrendingPromptSM): Promise<ApiResponse<TrendingPromptSM>> {
    if (!trendingPrompt || !trendingPrompt.title || !trendingPrompt.promptText) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const apiRequest = new ApiRequest<TrendingPromptSM>();
    apiRequest.reqData = trendingPrompt;
    const resp = await this.trendingPromptClient.UpdateTrendingPrompt(id, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async deleteTrendingPrompt(id: number): Promise<ApiResponse<DeleteResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.trendingPromptClient.DeleteTrendingPrompt(id);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Delete_Data_Error);
    }

    return resp;
  }

  async updateTrendingPromptStatus(id: number, status: boolean): Promise<ApiResponse<BoolResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.trendingPromptClient.UpdateTrendingPromptStatus(id, status);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }
}
