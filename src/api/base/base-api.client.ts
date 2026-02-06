import { Method, AxiosResponse } from "axios";
import { AppConstants } from "@/constants/app-constants";
import {
  AdditionalRequestDetails,
  Authentication,
} from "@/models/service/foundation/api-contracts/additional-request-details";
import { DictionaryCollection } from "@/models/internal/dictionary-collection";
import { IDictionaryCollection } from "@/models/internal/Idictionary-collection";
import { StorageService } from "@/services/storage.service";
import { environment } from "@/environments/environment";
import { CommonResponseCodeHandler } from "../helpers/common-response-code-handler.helper";
import { StorageCache } from "../helpers/storage-cache.helper";
import { BaseAjaxClient } from "./base-ajax.client";
import { ApiRequest } from "@/models/service/foundation/api-contracts/base/api-request";
import { ApiResponse } from "@/models/service/foundation/api-contracts/base/api-response";
import { ErrorData } from "@/models/service/foundation/api-contracts/error-data";
import { QueryFilter } from "@/models/service/foundation/api-contracts/query-filter";
import { ApiErrorTypeSM } from "@/models/enums/api-error-type-s-m.enum";
import { CommonUtils } from "@/utils/common-utils";

export abstract class BaseApiClient extends BaseAjaxClient {
  constructor(
    protected storageService: StorageService,
    protected storageCacheHelper: StorageCache,
    private commonResponseCodeHandler: CommonResponseCodeHandler
  ) {
    super();
  }

  protected GetResponseAsync = async <InReq, OutResp>(
    relativeUrl: string,
    reqMethod: Method = "GET",
    reqBody: ApiRequest<InReq> | null = null,
    additionalRequestDetails: AdditionalRequestDetails<OutResp> = new AdditionalRequestDetails<OutResp>(
      false
    )
  ): Promise<ApiResponse<OutResp>> => {
    let responseEntity: ApiResponse<OutResp> | null = null;
    let axiosResp: AxiosResponse<any> | null = null;

    if (additionalRequestDetails == null) {
      throw new Error("AdditionalRequestDetails cannot be null, do not pass if not required.");
    }

    try {
      const fullUrlToHit = CommonUtils.CombineUrl(environment.apiBaseUrl, relativeUrl);

      // Check cache first
      responseEntity = await this.storageCacheHelper.GetResponseFromDbIfPresent<OutResp>(
        fullUrlToHit,
        reqMethod,
        additionalRequestDetails
      );
      if (responseEntity != null) return responseEntity;

      // Add headers and call base Ajax
      additionalRequestDetails.headers = await this.AddCommonHeaders(
        additionalRequestDetails.headers
      );

      if (additionalRequestDetails.enableAuth === Authentication.true) {
        const token: string = await this.storageService.getDataFromAnyStorage(
          AppConstants.DATABASE_KEYS.ACCESS_TOKEN
        );
        if (token == null || token === "") {
          throw new Error(`Token not found for URL - '${relativeUrl}'.`);
        } else {
          additionalRequestDetails.headers.Add("Authorization", "Bearer " + token);
        }
      } else if (additionalRequestDetails.enableAuth === Authentication.automationToken) {
        const token: string = await this.storageService.getFromStorage(
          AppConstants.DATABASE_KEYS.AUTOMATION_TOKEN
        );
        if (token == null || token === "") {
          throw new Error(`Automation-Token not found for URL - '${relativeUrl}'.`);
        } else {
          additionalRequestDetails.headers.Add("Authorization", "Bearer " + token);
        }
      }

      // Apply query filters to URL if GET request
      let finalUrl = fullUrlToHit;
      if (reqMethod === "GET" && reqBody?.queryFilter) {
        finalUrl = this.ApplyQueryFilterToUrl(fullUrlToHit, reqBody.queryFilter);
      }

      axiosResp = await this.GetHttpDataAsync<ApiRequest<InReq>>(
        finalUrl,
        reqMethod,
        reqBody,
        additionalRequestDetails.headers,
        additionalRequestDetails.contentType
      );

      // Handle response codes
      if (
        this.commonResponseCodeHandler.handlerDict
          .Keys()
          .includes(axiosResp.status.toString())
      ) {
        const errMessage = this.commonResponseCodeHandler.handlerDict.Item(
          axiosResp.status.toString()
        )(axiosResp);
        return this.CreateGenericApiResponseObject(errMessage);
      }

      responseEntity = await this.CreateResponseEntityFromAxiosResp<OutResp>(
        axiosResp,
        additionalRequestDetails.custRespResolver
      );

      if (responseEntity == null) {
        throw new Error("Null Response Formed.");
      }

      // Add response to cache if applicable
      await this.storageCacheHelper.AddOrUpdateResponseInCacheIfApplicable<OutResp>(
        fullUrlToHit,
        reqMethod,
        additionalRequestDetails,
        responseEntity
      );

      return responseEntity;
    } catch (x) {
      let msg = "";
      if (x instanceof Error) msg = x.message;
      else msg = JSON.stringify(x);
      const resp = this.CreateGenericApiResponseObject<OutResp>(msg);
      resp.axiosResponse = axiosResp;
      return resp;
    }
  };

  private CreateResponseEntityFromAxiosResp = async <OutResp>(
    axiosResp: AxiosResponse,
    respResolver: ((resp: AxiosResponse) => ApiResponse<OutResp>) | null
  ): Promise<ApiResponse<OutResp> | null> => {
    let retObject: ApiResponse<OutResp> | null = null;

    if (this.IsSuccessCode(axiosResp.status)) {
      if (respResolver != null) {
        const data = respResolver(axiosResp);
        data.axiosResponse = axiosResp;
        retObject = data;
      } else {
        const data = axiosResp.data as ApiResponse<OutResp>;
        data.axiosResponse = axiosResp;
        retObject = data;
      }
    } else {
      if (axiosResp.data != null && axiosResp.data.isError !== undefined) {
        retObject = axiosResp.data as ApiResponse<OutResp>;
        retObject.axiosResponse = axiosResp;
      }
    }

    if (retObject == null) {
      retObject = this.CreateGenericApiResponseObject<OutResp>(
        `Unknown error occurred - status code '${axiosResp.status}'`
      );
      retObject!.axiosResponse = axiosResp;
    }

    return retObject;
  };

  protected CreateGenericApiResponseObject = <OutResp>(addMsg: string): ApiResponse<OutResp> => {
    const resp = new ApiResponse<OutResp>();
    resp.isError = true;
    resp.errorData = new ErrorData();
    resp.errorData.displayMessage = addMsg;
    resp.errorData.apiErrorType = ApiErrorTypeSM.FrameworkException_Log;
    return resp;
  };

  protected ApplyQueryFilterToUrl(
    currentUrlToHit: string,
    queryFilter?: QueryFilter | null
  ): string {
    if (!queryFilter) return currentUrlToHit;

    const params: string[] = [];

    // Pagination
    if (
      queryFilter &&
      queryFilter.skip != null &&
      queryFilter.top != null &&
      queryFilter.skip >= 0 &&
      queryFilter.top > 0
    ) {
      params.push(`$skip=${queryFilter.skip}`, `$top=${queryFilter.top}`);
    }

    // Order By
    if (queryFilter.orderByCommand?.trim()) {
      params.push(`$orderby=${encodeURIComponent(queryFilter.orderByCommand.trim())}`);
    }

    // Select fields
    if (queryFilter.selectFields?.trim()) {
      params.push(`$select=${encodeURIComponent(queryFilter.selectFields.trim())}`);
    }

    // Expand
    if (queryFilter.expandFields?.trim()) {
      params.push(`$expand=${encodeURIComponent(queryFilter.expandFields.trim())}`);
    }

    // Count
    if (queryFilter.inlineCount === true) {
      params.push(`$count=true`);
    }

    // Build filter expression from searchText & searchColumns
    const dynamicSearchFilter = this.buildFilterExpression(
      queryFilter.searchColumns || "",
      queryFilter.searchText || ""
    );

    // Combine with manual filter if both exist
    const finalFilter = [queryFilter.filterExpression?.trim(), dynamicSearchFilter?.trim()]
      .filter(Boolean)
      .join(" and ");

    if (finalFilter) {
      params.push(`$filter=${encodeURIComponent(finalFilter)}`);
    }

    const paramString = params.join("&");

    return currentUrlToHit.includes("?")
      ? `${currentUrlToHit}&${paramString}`
      : `${currentUrlToHit}?${paramString}`;
  }

  buildFilterExpression(searchColumns: string, searchText: string): string {
    if (!searchColumns || !searchText) return "";

    const columns = searchColumns.split(",").map((c) => c.trim());
    const numericColumns = ["id", "age", "score"]; // Add other numeric fields as needed

    const filters = columns
      .map((col) => {
        const isNumeric = numericColumns.includes(col.toLowerCase());
        let filterExpression = "";

        if (isNumeric) {
          const searchNumber = Number(searchText);
          if (!isNaN(searchNumber)) {
            filterExpression = `${col} eq ${searchNumber}`;
          } else {
            filterExpression = "";
          }
        } else {
          filterExpression = `contains(${col}, '${searchText}')`;
        }

        return filterExpression;
      })
      .filter(Boolean);

    return filters.join(" or ");
  }

  private async AddCommonHeaders(
    commonHeaders: IDictionaryCollection<string, string> | null
  ): Promise<IDictionaryCollection<string, string>> {
    if (commonHeaders == null) {
      commonHeaders = new DictionaryCollection<string, string>();
    }
    commonHeaders.Add(AppConstants.HEADER_NAMES.ApiType, AppConstants.HEADER_VALUES.ApiType);
    commonHeaders.Add(AppConstants.HEADER_NAMES.DevApk, AppConstants.HEADER_VALUES.DevApk);
    commonHeaders.Add(
      AppConstants.HEADER_NAMES.AppVersion,
      AppConstants.HEADER_VALUES.AppVersion
    );
    return commonHeaders;
  }
}
