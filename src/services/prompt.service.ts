import { AppConstants } from "@/constants/app-constants";
import { PromptClient } from "@/api/prompt.client";
import { BaseService } from "./base.service";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";

export class PromptService extends BaseService {
  constructor(private promptClient: PromptClient) {
    super();
  }

  async getPrompts(skip: number = 0, top: number = 100): Promise<ApiResponse<PromptSM[]>> {
    const resp = await this.promptClient.GetPrompts(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsForUser(skip: number = 0, top: number = 100): Promise<ApiResponse<PromptSM[]>> {
    const resp = await this.promptClient.GetPromptsForUser(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptClient.GetPromptsCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptById(id: number): Promise<ApiResponse<PromptSM>> {
    const resp = await this.promptClient.GetPromptById(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptByIdForUser(id: number): Promise<ApiResponse<PromptSM>> {
    const resp = await this.promptClient.GetPromptByIdForUser(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsByCategory(
    categoryId: number,
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptSM[]>> {
    const resp = await this.promptClient.GetPromptsByCategory(categoryId, skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsCountByCategory(categoryId: number): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptClient.GetPromptsCountByCategory(categoryId);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsByCategoryForUser(
    categoryId: number,
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptSM[]>> {
    const resp = await this.promptClient.GetPromptsByCategoryForUser(categoryId, skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getPromptsCountByCategoryForUser(categoryId: number): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptClient.GetPromptsCountByCategoryForUser(categoryId);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getMostLikedPrompts(skip: number = 0, top: number = 100): Promise<ApiResponse<PromptSM[]>> {
    const resp = await this.promptClient.GetMostLikedPrompts(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getMostLikedPromptsCount(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.promptClient.GetMostLikedPromptsCount();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async createPrompt(categoryId: number, prompt: PromptSM): Promise<ApiResponse<BoolResponseRoot>> {
    if (!prompt || !prompt.title || !prompt.promptText) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    // Ensure samples array is initialized
    if (!prompt.samples) {
      prompt.samples = [];
    }

    const apiRequest = new ApiRequest<PromptSM>();
    apiRequest.reqData = prompt;
    const resp = await this.promptClient.CreatePrompt(categoryId, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async updatePrompt(id: number, prompt: PromptSM): Promise<ApiResponse<PromptSM>> {
    if (!prompt || !prompt.title || !prompt.promptText) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    // Ensure samples array is initialized if not present
    if (!prompt.samples) {
      prompt.samples = [];
    }

    const apiRequest = new ApiRequest<PromptSM>();
    apiRequest.reqData = prompt;
    const resp = await this.promptClient.UpdatePrompt(id, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async deletePrompt(id: number): Promise<ApiResponse<DeleteResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.promptClient.DeletePrompt(id);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Delete_Data_Error);
    }

    return resp;
  }

  async updatePromptStatus(id: number, status: boolean): Promise<ApiResponse<BoolResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.promptClient.UpdatePromptStatus(id, status);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }
}
