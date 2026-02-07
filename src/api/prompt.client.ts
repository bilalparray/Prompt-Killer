import { AppConstants } from "@/constants/app-constants";
import {
  AdditionalRequestDetails,
  Authentication,
} from "@/models/service/foundation/api-contracts/additional-request-details";
import { BaseApiClient } from "./base/base-api.client";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "./helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "./helpers/common-response-code-handler.helper";

export class PromptClient extends BaseApiClient {
  constructor(
    storageService: StorageService,
    storageCache: StorageCache,
    commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super(storageService, storageCache, commonResponseCodeHandler);
  }

  // Get all prompts (paginated)
  GetPrompts = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptSM[]>> => {
    const resp = await this.GetResponseAsync<null, PromptSM[]>(
      `${AppConstants.API_ENDPOINTS.PROMPT}?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompt count
  GetPromptsCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompt by ID
  GetPromptById = async (id: number): Promise<ApiResponse<PromptSM>> => {
    const resp = await this.GetResponseAsync<null, PromptSM>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/${id}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptSM>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompts by category (paginated)
  GetPromptsByCategory = async (
    categoryId: number,
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptSM[]>> => {
    const resp = await this.GetResponseAsync<null, PromptSM[]>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/category/${categoryId}?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompts count by category
  GetPromptsCountByCategory = async (
    categoryId: number
  ): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/category/count/${categoryId}`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Get most liked prompts (paginated)
  GetMostLikedPrompts = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptSM[]>> => {
    const resp = await this.GetResponseAsync<null, PromptSM[]>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/most-liked?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get most liked prompts count
  GetMostLikedPromptsCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/most-liked/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Create prompt
  CreatePrompt = async (
    categoryId: number,
    prompt: ApiRequest<PromptSM>
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<PromptSM, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/${categoryId}`,
      "POST",
      prompt,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update prompt
  UpdatePrompt = async (
    id: number,
    prompt: ApiRequest<PromptSM>
  ): Promise<ApiResponse<PromptSM>> => {
    const resp = await this.GetResponseAsync<PromptSM, PromptSM>(
      `${AppConstants.API_ENDPOINTS.PROMPT}?id=${id}`,
      "PUT",
      prompt,
      new AdditionalRequestDetails<PromptSM>(false, Authentication.true)
    );
    return resp;
  };

  // Delete prompt
  DeletePrompt = async (id: number): Promise<ApiResponse<DeleteResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, DeleteResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}?id=${id}`,
      "DELETE",
      null,
      new AdditionalRequestDetails<DeleteResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update prompt status
  UpdatePromptStatus = async (
    id: number,
    status: boolean
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT}/status?id=${id}&status=${status}`,
      "PUT",
      null,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };
}
