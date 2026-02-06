import { environment } from "@/environments/environment";

export class LogHandlerService {
  logObject(obj: any): void {
    if (environment.LoggingInfo.LogLocation.includes("Console")) {
      console.log(obj);
    }
    // Add API logging if needed
    if (environment.LoggingInfo.LogLocation.includes("Api")) {
      // Implement API logging
    }
  }

  logError(error: any): void {
    if (environment.LoggingInfo.ExceptionLocation.includes("Console")) {
      console.error(error);
    }
    // Add API error logging if needed
    if (environment.LoggingInfo.ExceptionLocation.includes("Api")) {
      // Implement API error logging
    }
  }
}
