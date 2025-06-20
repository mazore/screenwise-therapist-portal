import { LogLevel, Configuration } from "@azure/msal-browser";

// TODO: Replace these values with your Azure AD B2C configuration
// Example:
// clientId: "your-client-id",
// authority: "https://your-tenant.b2clogin.com/your-tenant.onmicrosoft.com/B2C_1_signupsignin1",
// knownAuthorities: ["your-tenant.b2clogin.com"],
// redirectUri: window.location.origin,
// postLogoutRedirectUri: window.location.origin + "/login",

const isDevelopment = process.env.NODE_ENV === 'development';

export const msalConfig: Configuration = {
  auth: {
    clientId: "f2a126c8-6201-45a3-a015-0179166e72ab", // e.g. 12345678-aaaa-bbbb-cccc-1234567890ab
    authority: "https://login.screenwiseeating.com/screenwiseeating.onmicrosoft.com/B2C_1_screenwise-therapist-sign-up-sign-in",
    knownAuthorities: ["login.screenwiseeating.com"],
    redirectUri: isDevelopment
      ? "http://localhost:8080/"
      : "https://app.screenwiseeating.com",
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
              return;
        }
      }
    }
  }
};
