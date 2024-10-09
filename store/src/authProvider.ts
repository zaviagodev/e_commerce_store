import { AuthBindings } from "@refinedev/core";
import { auth } from "./client/api";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthBindings = {
  login: async ({ username, email, password, to }) => {
    try {
      await auth.login({ usr: username ?? email, pwd: password });
      localStorage.setItem(TOKEN_KEY, username ?? email);
      return {
        success: true,
        redirectTo: to ?? "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "Login Error",
          message: "Invalid username or password",
        },
      };
    }
  },
  logout: async () => {
    await auth.logout();
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const response = await auth.whoami();
      return response.message;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  register: async (params) => {
    try {
      if (params.email && params.password) {
        await auth.register(params);
        localStorage.setItem(TOKEN_KEY, params.email);
        return {
          success: true,
        };
      }
      return {
        success: false,
        error: {
          message: "Email or password is missing",
          name: "Register failed",
        },
      };
    } catch (error: any) {
      const errorPayload = error.response?.data._server_messages
        ? JSON.parse(
            JSON.parse(error.response?.data._server_messages || "[]")[0]
          )
        : error.response?.data;
      // throw errorPayload?.message;
      return {
        success: false,
        error: {
          message: error?.message ?? errorPayload?.message ?? "Invalid email",
          name: "Register failed",
        },
      };
    }
  },
  forgotPassword: async (params) => {
    try {
      await auth.forgotPassword(params);
      return {
        success: true,
        successNotification: {
          message: "Forgot password email sent",
        },
      };
    } catch (error: any) {
      const errorPayload = error.response?.data._server_messages
        ? JSON.parse(
            JSON.parse(error.response?.data._server_messages || "[]")[0]
          )
        : error.response?.data;
      return {
        success: false,
        error: {
          message: "Forgot password failed",
          name: errorPayload?.message ?? "Invalid email",
        },
      };
    }
  },
  updatePassword: async (params) => {
    try {
      await auth.updatePassword(params);
      return {
        success: true,
        successNotification: {
          message: "Password updated",
        },
      };
    } catch (error: any) {
      const errorPayload = error.response?.data._server_messages
        ? JSON.parse(
            JSON.parse(error.response?.data._server_messages || "[]")[0]
          )
        : error.response?.data;

      return {
        success: false,
        error: {
          message: "Update password failed",
          name: errorPayload?.message ?? "Invalid password",
        },
      };
    }
  },
};
