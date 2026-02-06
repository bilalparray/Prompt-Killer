export const environment = {
  production: false,
  apiResponseCacheTimeoutInMinutes: 5,
  enableResponseCacheProcessing: true,
  applicationVersion: "1.0.1",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://reg-api.renosoftwares.com/",
  apiDefaultTimeout: 1,
  applicationName: "Prompt Killer",
  companyCode: "Company_Code",
  ExternalIntegrations: {
    Google: {
      clientIdForWeb:
        "189252447120-j52to7iveehh7sjcqsb3d1erishap5bb.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    },
    RenoInformation: {
      showRenoAds: true,
      adShuffleTime: 5000,
      roletype: "5",
      userName: "boiler_plate_Automation_Admin",
      password: "boilerPlatePwd",
      privacyUrl: "https://renosoftwares.com/products/boiler-plate/privacypolicy",
      aboutUrl: "https://renosoftwares.com/products/boiler-plate",
    },
  },
  LoggingInfo: {
    LogLocation: "Console,Api",
    ExceptionLocation: "Console,Api",
    cacheLogs: true,
    localLogFilePath: "react-boilerplate.log",
  },
  encryptionKey: "12345678",
};
