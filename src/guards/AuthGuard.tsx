"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { AppConstants } from "@/constants/app-constants";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleTypeSM[];
  redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const loginRoute = redirectTo || `/${AppConstants.WEB_ROUTES.ADMIN.LOGIN}`;
      router.push(loginRoute);
      return;
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const hasAllowedRole = allowedRoles.some((role) => hasRole(role));
      if (!hasAllowedRole) {
        console.warn("AuthGuard: User does not have required role", {
          userRoleType: user?.roleType,
          allowedRoles,
          user
        });
        router.push(redirectTo || `/${AppConstants.WEB_ROUTES.ADMIN.DASHBOARD}`);
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, hasRole, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => hasRole(role));
    if (!hasAllowedRole) {
      return null;
    }
  }

  return <>{children}</>;
}
