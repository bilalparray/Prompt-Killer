import { AppConstants } from "@/constants/app-constants";
import {
  AdditionalRequestDetails,
  Authentication,
} from "@/models/service/foundation/api-contracts/additional-request-details";
import { BaseApiClient } from "./base/base-api.client";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "./helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "./helpers/common-response-code-handler.helper";

export class CategoryClient extends BaseApiClient {
  constructor(
    storageService: StorageService,
    storageCache: StorageCache,
    commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super(storageService, storageCache, commonResponseCodeHandler);
  }

  // Admin endpoints
  GetCategoriesForAdmin = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<CategorySM[]>> => {
    const resp = await this.GetResponseAsync<null, CategorySM[]>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/admin?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<CategorySM[]>(false, Authentication.true)
    );
    return resp;
  };

  GetCategoriesCountForAdmin = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/admin/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // User/Public endpoints
  GetCategoriesForUser = async (
    skip: number = 0,
    top: number = 100
  ): Promise<ApiResponse<CategorySM[]>> => {
    const resp = await this.GetResponseAsync<null, CategorySM[]>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/user?skip=${skip}&top=${top}`,
      "GET",
      null,
      new AdditionalRequestDetails<CategorySM[]>(false, Authentication.false)
    );
    return resp;
  };

  GetCategoriesCountForUser = async (): Promise<ApiResponse<IntResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, IntResponseRoot>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/user/count`,
      "GET",
      null,
      new AdditionalRequestDetails<IntResponseRoot>(false, Authentication.false)
    );
    return resp;
  };

  // Get category by ID (requires authentication for admin access)
  GetCategoryById = async (id: number): Promise<ApiResponse<CategorySM>> => {
    const resp = await this.GetResponseAsync<null, CategorySM>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/${id}`,
      "GET",
      null,
      new AdditionalRequestDetails<CategorySM>(false, Authentication.true)
    );
    return resp;
  };

  // Create category
  CreateCategory = async (
    category: ApiRequest<CategorySM>
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<CategorySM, BoolResponseRoot>(
      AppConstants.API_ENDPOINTS.CATEGORY,
      "POST",
      category,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update category
  UpdateCategory = async (
    id: number,
    category: ApiRequest<CategorySM>
  ): Promise<ApiResponse<CategorySM>> => {
    const resp = await this.GetResponseAsync<CategorySM, CategorySM>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}?id=${id}`,
      "PUT",
      category,
      new AdditionalRequestDetails<CategorySM>(false, Authentication.true)
    );
    return resp;
  };

  // Delete category
  DeleteCategory = async (id: number): Promise<ApiResponse<DeleteResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, DeleteResponseRoot>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}?id=${id}`,
      "DELETE",
      null,
      new AdditionalRequestDetails<DeleteResponseRoot>(false, Authentication.true)
    );
    return resp;
  };

  // Update category status
  UpdateCategoryStatus = async (
    id: number,
    status: boolean
  ): Promise<ApiResponse<BoolResponseRoot>> => {
    const resp = await this.GetResponseAsync<null, BoolResponseRoot>(
      `${AppConstants.API_ENDPOINTS.CATEGORY}/status?id=${id}&status=${status}`,
      "PUT",
      null,
      new AdditionalRequestDetails<BoolResponseRoot>(false, Authentication.true)
    );
    return resp;
  };
}
