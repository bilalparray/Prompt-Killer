import axios, { AxiosRequestConfig, Method, AxiosResponse } from "axios";
import { IDictionaryCollection } from "@/models/internal/Idictionary-collection";
import { DictionaryCollection } from "@/models/internal/dictionary-collection";

export abstract class BaseAjaxClient {
  protected GetHttpDataAsync = async <Req>(
    fullReqUrl: string,
    method: Method,
    reqBody: Req | null,
    headers: IDictionaryCollection<string, string>,
    contentType: string
  ): Promise<AxiosResponse> => {
    if (contentType !== "" && contentType !== "application/json") {
      throw new Error("Content Type other than JSON not supported at the moment.");
    }
    if (headers == null) {
      headers = new DictionaryCollection<string, string>();
    }
    headers.Add("Content-Type", contentType);

    const reqBodyTxt = JSON.stringify(reqBody);
    const response = await this.FetchAsync(fullReqUrl, method, headers, reqBodyTxt);
    if (response == null) {
      throw new Error("Response null after api call. Please report the event to administrator.");
    }
    return response;
  };

  private FetchAsync = async (
    fullReqUrl: string,
    reqMethod: Method,
    headersToAdd: IDictionaryCollection<string, string>,
    reqBody: string
  ): Promise<AxiosResponse<any, any> | null> => {
    const hdrs: any = {};
    if (headersToAdd != null && headersToAdd.Count() > 0) {
      headersToAdd.Keys().forEach((key) => {
        hdrs[key] = headersToAdd.Item(key);
      });

      const config: AxiosRequestConfig<string> = this.GetAxiosConfig();
      config.url = fullReqUrl;
      config.method = reqMethod;
      config.headers = hdrs;
      config.data = reqBody;
      const response = await axios.request(config);
      return response;
    }
    return null;
  };

  private GetAxiosConfig = (): AxiosRequestConfig => {
    const config = {
      url: "",
      method: "get" as Method,
      timeout: 0,
      withCredentials: false,
      responseType: "json" as const,
      maxContentLength: 2000,
      validateStatus: (status: number) => {
        return true; // We handle errors in base-api.client
      },
      maxRedirects: 5,
    } as AxiosRequestConfig;
    return config;
  };

  protected IsSuccessCode = (respStatusCode: number): boolean => {
    return respStatusCode >= 200 && respStatusCode < 300;
  };
}
