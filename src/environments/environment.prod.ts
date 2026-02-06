export const environment = {
  production: true,
  apiResponseCacheTimeoutInMinutes: 5,
  enableResponseCacheProcessing: true,
  applicationVersion: "1.0.1",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com/",
  apiDefaultTimeout: 1,
  applicationName: "Prompt Killer",
  companyCode: "Company_Code",
  ExternalIntegrations: {
    Google: {
      clientIdForWeb: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
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
    localLogFilePath: "prompt-killer.log",
  },
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "12345678",
};
