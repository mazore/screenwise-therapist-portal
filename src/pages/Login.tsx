import React from "react";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({
      scopes: ["openid", "profile"],
      // Ensure we return to the page we were on
      redirectStartPage: window.location.href
    }).catch(e => {
      console.error("Login failed:", e);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Login;
