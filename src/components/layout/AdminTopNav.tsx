"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useTheme } from "@/hooks/useTheme";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { AppConstants } from "@/constants/app-constants";

export function AdminTopNav() {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const { showNav } = useCommon();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!showNav) return null;

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      router.push(`/${AppConstants.WEB_ROUTES.ADMIN.LOGIN}`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "A";
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return first + last;
  };

  const getRoleName = (roleType?: RoleTypeSM) => {
    switch (roleType) {
      case RoleTypeSM.SuperAdmin:
        return "Super Admin";
      case RoleTypeSM.SystemAdmin:
        return "System Admin";
      case RoleTypeSM.ClientAdmin:
        return "Admin";
      case RoleTypeSM.ClientEmployee:
        return "Employee";
      default:
        return "User";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center fw-bold" href="/admin/dashboard">
          <i className="bi bi-shield-check me-2 fs-4"></i>
          <span className="fs-4">Admin Panel</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center ${
                      pathname === "/admin/dashboard" ? "active" : ""
                    }`}
                    href="/admin/dashboard"
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>

                {(hasRole(RoleTypeSM.ClientAdmin) || hasRole(RoleTypeSM.SuperAdmin) || hasRole(RoleTypeSM.SystemAdmin)) && (
                  <>
                    <li className="nav-item">
                      <Link
                        className={`nav-link d-flex align-items-center ${
                          pathname?.startsWith("/admin/categories") ? "active" : ""
                        }`}
                        href="/admin/categories"
                      >
                        <i className="bi bi-folder me-1"></i>
                        <span>Categories</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link d-flex align-items-center ${
                          pathname?.startsWith("/admin/prompts") ? "active" : ""
                        }`}
                        href="/admin/prompts"
                      >
                        <i className="bi bi-lightning-charge me-1"></i>
                        <span>Prompts</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link d-flex align-items-center ${
                          pathname?.startsWith("/admin/prompt-images") ? "active" : ""
                        }`}
                        href="/admin/prompt-images"
                      >
                        <i className="bi bi-image me-1"></i>
                        <span>Images</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link d-flex align-items-center ${
                          pathname?.startsWith("/admin/users") ? "active" : ""
                        }`}
                        href="/admin/users"
                      >
                        <i className="bi bi-people me-1"></i>
                        <span>Users</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link d-flex align-items-center ${
                          pathname?.startsWith("/admin/settings") ? "active" : ""
                        }`}
                        href="/admin/settings"
                      >
                        <i className="bi bi-gear me-1"></i>
                        <span>Settings</span>
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <Link
                    className={`nav-link d-flex align-items-center ${
                      pathname === "/admin/profile" ? "active" : ""
                    }`}
                    href="/admin/profile"
                  >
                    <i className="bi bi-person me-1"></i>
                    <span>Profile</span>
                  </Link>
                </li>
              </ul>

              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item me-3">
                  <button
                    className="btn btn-link nav-link text-white p-0"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    style={{
                      border: "none",
                      background: "none",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"} fs-5`}></i>
                  </button>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUserMenu(!showUserMenu);
                    }}
                  >
                    <div
                      className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: "32px",
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(user?.firstName, user?.lastName)}
                    </div>
                    <span className="d-none d-md-inline">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ minWidth: "200px" }}>
                    <li>
                      <div className="dropdown-header">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              fontSize: "16px",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(user?.firstName, user?.lastName)}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <small className="text-muted">{user?.emailId}</small>
                            <br />
                            <small className="badge bg-secondary">{getRoleName(user?.roleType)}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center" href="/admin/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center" href="/admin/settings">
                        <i className="bi bi-gear me-2"></i>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item d-flex align-items-center" href="/home">
                        <i className="bi bi-house me-2"></i>
                        Public Site
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a
                        className="dropdown-item d-flex align-items-center text-danger"
                        href="#"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" href={`/${AppConstants.WEB_ROUTES.ADMIN.LOGIN}`}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        .nav-link {
          transition: all 0.3s ease;
          border-radius: 6px;
          margin: 0 4px;
        }
        .nav-link:hover,
        .nav-link.active {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </nav>
  );
}
