import React from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

const Login = () => {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ["openid", "profile"],
      // Ensure we return to the page we were on
      redirectStartPage: window.location.href
    }).catch(e => {
      console.error("Login failed:", e);
    });
  };

  // Show loading state while MSAL is processing authentication
  if (inProgress === "handleRedirect" || (inProgress === "none" && isAuthenticated)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleLogin}
          disabled={inProgress !== "none"}
        >
          {inProgress !== "none" ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Login;
