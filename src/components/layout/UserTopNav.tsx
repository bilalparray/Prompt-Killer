"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useTheme } from "@/hooks/useTheme";
import { AppConstants } from "@/constants/app-constants";

export function UserTopNav() {
  const { isAuthenticated, user, logout } = useAuth();
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
      router.push(`/${AppConstants.WEB_ROUTES.USER.HOME}`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return first + last;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold" href="/home">
          <i className="bi bi-lightning-charge-fill me-2 fs-4"></i>
          <span className="fs-4">Prompt Killer</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#userNavbarNav"
          aria-controls="userNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="userNavbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center ${pathname === "/home" ? "active" : ""}`}
                href="/home"
              >
                <i className="bi bi-house-door me-1"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center ${pathname === "/about" ? "active" : ""}`}
                href="/about"
              >
                <i className="bi bi-info-circle me-1"></i>
                <span>About</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center ${pathname === "/contact" ? "active" : ""}`}
                href="/contact"
              >
                <i className="bi bi-envelope me-1"></i>
                <span>Contact</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center ${pathname === "/categories" ? "active" : ""}`}
                href="/categories"
              >
                <i className="bi bi-folder me-1"></i>
                <span>Categories</span>
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center ${pathname === "/user/dashboard" ? "active" : ""}`}
                  href="/user/dashboard"
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
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

            {isAuthenticated ? (
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
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" href="/user/dashboard">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" href="/user/profile">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" href="/user/settings">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center" href={`/${AppConstants.WEB_ROUTES.ADMIN.DASHBOARD}`}>
                      <i className="bi bi-shield-check me-2"></i>
                      Admin Panel
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
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href={`/${AppConstants.WEB_ROUTES.ADMIN.LOGIN}`}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    <span>Login</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm ms-2"
                    href={`/${AppConstants.WEB_ROUTES.ADMIN.REGISTER}`}
                    style={{ borderRadius: "6px" }}
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
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
