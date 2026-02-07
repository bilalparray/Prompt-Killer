import { AppConstants } from "@/constants/app-constants";
import {
  AdditionalRequestDetails,
  Authentication,
} from "@/models/service/foundation/api-contracts/additional-request-details";
import { BaseApiClient } from "./base/base-api.client";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "./helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "./helpers/common-response-code-handler.helper";

export class PromptImageClient extends BaseApiClient {
  constructor(
    storageService: StorageService,
    storageCache: StorageCache,
    commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super(storageService, storageCache, commonResponseCodeHandler);
  }

  // Get prompt images (paginated)
  GetPromptImages = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptImageSM[]>> => {
    const resp = await this.GetResponseAsync<null, PromptImageSM[]>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/prompts?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptImageSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompt images count
  GetPromptImagesCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/prompts/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Get trending prompt images (paginated)
  GetTrendingPromptImages = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<PromptImageSM[]>> => {
    const resp = await this.GetResponseAsync<null, PromptImageSM[]>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/trending?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptImageSM[]>(false, Authentication.true)
    );
    return resp;
  };

  // Get trending prompt images count
  GetTrendingPromptImagesCount = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/trending/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Get prompt image by ID
  GetPromptImageById = async (id: number): Promise<ApiResponse<PromptImageSM>> => {
    const resp = await this.GetResponseAsync<null, PromptImageSM>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/${id}`,
      "GET",
      null,
      new AdditionalRequestDetails<PromptImageSM>(false, Authentication.true)
    );
    return resp;
  };

  // Create prompt image for a prompt
  CreatePromptImage = async (
    promptId: number,
    image: ApiRequest<PromptImageSM>
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<PromptImageSM, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/prompt/${promptId}`,
      "POST",
      image,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Create prompt image for a trending prompt
  CreateTrendingPromptImage = async (
    trendingPromptId: number,
    image: ApiRequest<PromptImageSM>
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<PromptImageSM, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}/trending-prompt/${trendingPromptId}`,
      "POST",
      image,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update prompt image
  UpdatePromptImage = async (
    id: number,
    image: ApiRequest<PromptImageSM>
  ): Promise<ApiResponse<PromptImageSM>> => {
    const resp = await this.GetResponseAsync<PromptImageSM, PromptImageSM>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}?id=${id}`,
      "PUT",
      image,
      new AdditionalRequestDetails<PromptImageSM>(false, Authentication.true)
    );
    return resp;
  };

  // Delete prompt image
  DeletePromptImage = async (id: number): Promise<ApiResponse<DeleteResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, DeleteResponseRoot>(
      `${AppConstants.API_ENDPOINTS.PROMPT_IMAGES}?id=${id}`,
      "DELETE",
      null,
      new AdditionalRequestDetails<DeleteResponseRoot>(false, Authentication.true)
    );
    return resp;
  };
}
