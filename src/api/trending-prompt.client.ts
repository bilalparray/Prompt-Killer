import { AppConstants } from "@/constants/app-constants";
import {
  AdditionalRequestDetails,
  Authentication,
} from "@/models/service/foundation/api-contracts/additional-request-details";
import { BaseApiClient } from "./base/base-api.client";
import { TrendingPromptSM } from "@/models/service/app/v1/prompt/trending-prompt-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "./helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "./helpers/common-response-code-handler.helper";

export class TrendingPromptClient extends BaseApiClient {
  constructor(
    storageService: StorageService,
    storageCache: StorageCache,
    commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super(storageService, storageCache, commonResponseCodeHandler);
  }

  // Get all trending prompts (paginated)
  GetTrendingPrompts = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<TrendingPromptSM[]>> => {
    const resp = await this.GetResponseAsync<null, TrendingPromptSM[]>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<TrendingPromptSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get trending prompt count
  GetTrendingPromptsCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Get trending prompt by ID
  GetTrendingPromptById = async (id: number): Promise<ApiResponse<TrendingPromptSM>> => {
    const resp = await this.GetResponseAsync<null, TrendingPromptSM>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}/${id}`,
      "GET",
      null,
      new AdditionalRequestDetails<TrendingPromptSM>(false, Authentication.true)
    );
    return resp;
  };

  // Get most liked trending prompts (paginated)
  GetMostLikedTrendingPrompts = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<TrendingPromptSM[]>> => {
    const resp = await this.GetResponseAsync<null, TrendingPromptSM[]>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}/most-liked?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<TrendingPromptSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get most liked trending prompts count
  GetMostLikedTrendingPromptsCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}/most-liked/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Create trending prompt
  CreateTrendingPrompt = async (
    trendingPrompt: ApiRequest<TrendingPromptSM>
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<TrendingPromptSM, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}`,
      "POST",
      trendingPrompt,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update trending prompt
  UpdateTrendingPrompt = async (
    id: number,
    trendingPrompt: ApiRequest<TrendingPromptSM>
  ): Promise<ApiResponse<TrendingPromptSM>> => {
    const resp = await this.GetResponseAsync<TrendingPromptSM, TrendingPromptSM>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}?id=${id}`,
      "PUT",
      trendingPrompt,
      new AdditionalRequestDetails<TrendingPromptSM>(false, Authentication.true)
    );
    return resp;
  };

  // Delete trending prompt
  DeleteTrendingPrompt = async (id: number): Promise<ApiResponse<DeleteResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, DeleteResponseRoot>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}?id=${id}`,
      "DELETE",
      null,
      new AdditionalRequestDetails<DeleteResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update trending prompt status
  UpdateTrendingPromptStatus = async (
    id: number,
    status: boolean
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.TRENDING_PROMPT}/status?id=${id}&status=${status}`,
      "PUT",
      null,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };
}
