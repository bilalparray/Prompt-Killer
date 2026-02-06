import { AppConstants } from "@/constants/app-constants";
import { CategoryClient } from "@/api/category.client";
import { BaseService } from "./base.service";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { BoolResponseRoot } from "@/models/service/foundation/common-response/bool-response-root";
import { DeleteResponseRoot } from "@/models/service/foundation/common-response/delete-response-root";
import { IntResponseRoot } from "@/models/service/foundation/common-response/int-response-root";

export class CategoryService extends BaseService {
  constructor(private categoryClient: CategoryClient) {
    super();
  }

  async getCategoriesForAdmin(skip: number = 0, top: number = 100): Promise<ApiResponse<CategorySM[]>> {
    const resp = await this.categoryClient.GetCategoriesForAdmin(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getCategoriesCountForAdmin(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.categoryClient.GetCategoriesCountForAdmin();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getCategoriesForUser(skip: number = 0, top: number = 100): Promise<ApiResponse<CategorySM[]>> {
    const resp = await this.categoryClient.GetCategoriesForUser(skip, top);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getCategoriesCountForUser(): Promise<ApiResponse<IntResponseRoot>> {
    const resp = await this.categoryClient.GetCategoriesCountForUser();
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async getCategoryById(id: number): Promise<ApiResponse<CategorySM>> {
    const resp = await this.categoryClient.GetCategoryById(id);
    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Load_Data_Error);
    }
    return resp;
  }

  async createCategory(category: CategorySM): Promise<ApiResponse<BoolResponseRoot>> {
    if (!category || !category.name) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    // Ensure prompts array is initialized
    if (!category.prompts) {
      category.prompts = [];
    }

    const apiRequest = new ApiRequest<CategorySM>();
    apiRequest.reqData = category;
    const resp = await this.categoryClient.CreateCategory(apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async updateCategory(id: number, category: CategorySM): Promise<ApiResponse<CategorySM>> {
    if (!category || !category.name) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    // Ensure prompts array is initialized if not present
    if (!category.prompts) {
      category.prompts = [];
    }

    const apiRequest = new ApiRequest<CategorySM>();
    apiRequest.reqData = category;
    const resp = await this.categoryClient.UpdateCategory(id, apiRequest);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }

  async deleteCategory(id: number): Promise<ApiResponse<DeleteResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.categoryClient.DeleteCategory(id);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Delete_Data_Error);
    }

    return resp;
  }

  async updateCategoryStatus(id: number, status: boolean): Promise<ApiResponse<BoolResponseRoot>> {
    if (!id) {
      throw new Error(AppConstants.ERROR_PROMPTS.Invalid_Input_Data);
    }

    const resp = await this.categoryClient.UpdateCategoryStatus(id, status);

    if (resp.isError) {
      throw new Error(resp.errorData?.displayMessage || AppConstants.ERROR_PROMPTS.Save_Data_Error);
    }

    return resp;
  }
}
