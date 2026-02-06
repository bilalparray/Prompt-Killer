"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AccountService } from "@/services/account.service";
import { StorageService } from "@/services/storage.service";
import { AccountsClient } from "@/api/accounts.client";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { AppConstants } from "@/constants/app-constants";
import { LoginUserSM } from "@/models/service/app/v1/app-users/login/login-user-s-m";
import { jwtDecode } from "jwt-decode";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";

interface AuthContextType {
  user: LoginUserSM | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasRole: (role: RoleTypeSM) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize services
const storageService = new StorageService();
const storageCache = new StorageCache(storageService);
const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
const accountsClient = new AccountsClient(storageService, storageCache, commonResponseCodeHandler);
const accountService = new AccountService(accountsClient, storageService);

// Helper function to normalize user object, converting string roleType to enum value
const normalizeUser = (user: any): LoginUserSM | null => {
  if (!user) return null;

  // If roleType is a string, convert it to the enum value
  if (user.roleType && typeof user.roleType === 'string') {
    user.roleType = RoleTypeSM[user.roleType as keyof typeof RoleTypeSM] as RoleTypeSM;
  }

  return user as LoginUserSM;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginUserSM | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const storedToken = await storageService.getDataFromAnyStorage(
        AppConstants.DATABASE_KEYS.ACCESS_TOKEN
      );
      const storedUser = await storageService.getDataFromAnyStorage(
        AppConstants.DATABASE_KEYS.LOGIN_USER
      );

      if (storedToken && storedUser) {
        // Check if token is expired
        try {
          const decoded: any = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired
            await logout();
            return;
          }
        } catch (e) {
          // Invalid token
          await logout();
          return;
        }

        setToken(storedToken);
        setUser(normalizeUser(storedUser));
      } else {
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (loginId: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      const { environment } = await import("@/environments/environment");
      const { TokenRequestSM } = await import("@/models/service/app/token/token-request-s-m");
      const { RoleTypeSM } = await import("@/models/enums/role-type-s-m.enum");

      const tokenRequest = new TokenRequestSM();
      tokenRequest.loginId = loginId;
      tokenRequest.password = password;
      tokenRequest.companyCode = '';
      tokenRequest.roleType = RoleTypeSM.SuperAdmin; // Default, adjust as needed

      const response = await accountService.generateToken(tokenRequest, rememberMe);

      if (!response.isError && response.successData) {
        setToken(response.successData.accessToken);
        setUser(normalizeUser(response.successData.loginUserDetails));
      } else {
        throw new Error(response.errorData?.displayMessage || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await accountService.logoutUser();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: RoleTypeSM): boolean => {
    if (!user || user.roleType === undefined || user.roleType === null) {
      return false;
    }

    // Handle case where roleType comes as string from API (e.g., "ClientAdmin")
    let userRoleType: RoleTypeSM;
    if (typeof user.roleType === 'string') {
      // Convert string to enum value
      userRoleType = RoleTypeSM[user.roleType as keyof typeof RoleTypeSM] as RoleTypeSM;
    } else {
      userRoleType = user.roleType;
    }

    return userRoleType === role;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
