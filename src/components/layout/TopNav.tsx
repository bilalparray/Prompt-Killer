"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useTheme } from "@/hooks/useTheme";

export function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const { showNav } = useCommon();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!showNav) return null;

  // Determine if we're on admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await logout();
      router.push(isAdminRoute ? "/admin/auth/login" : "/");
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
        <Link className="navbar-brand d-flex align-items-center fw-bold" href={isAdminRoute ? "/admin/dashboard" : "/home"}>
          <i className="bi bi-lightning-charge-fill me-2 fs-4"></i>
          <span className="fs-4">Boilerplate</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAdminRoute ? (
              // Admin Navigation
              isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" href="/admin/dashboard">
                      <i className="bi bi-speedometer2 me-1"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" href="/admin/profile">
                      <i className="bi bi-person me-1"></i>
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" href="/admin/settings">
                      <i className="bi bi-gear me-1"></i>
                      <span>Settings</span>
                    </Link>
                  </li>
                </>
              ) : null
            ) : (
              // User/Public Navigation
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/home">
                    <i className="bi bi-house-door me-1"></i>
                    <span>Home</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/about">
                    <i className="bi bi-info-circle me-1"></i>
                    <span>About</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/contact">
                    <i className="bi bi-envelope me-1"></i>
                    <span>Contact</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {/* Theme Toggle */}
            <li className="nav-item me-3">
              <button
                className="btn btn-link nav-link text-white p-0"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                style={{ 
                  border: "none", 
                  background: "none",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(15deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(0deg)";
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
            ) : (
              <>
                {isAdminRoute ? (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" href="/admin/auth/login">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      <span>Admin Login</span>
                    </Link>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link d-flex align-items-center" href="/admin/auth/login">
                        <i className="bi bi-box-arrow-in-right me-1"></i>
                        <span>Admin Login</span>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="btn btn-light btn-sm ms-2"
                        href="/admin/auth/register"
                        style={{ borderRadius: "6px" }}
                      >
                        <i className="bi bi-person-plus me-1"></i>
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          backdrop-filter: blur(10px);
        }
        .nav-link {
          transition: all 0.3s ease;
          border-radius: 6px;
          margin: 0 4px;
        }
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        .dropdown-menu {
          margin-top: 8px;
          border-radius: 8px;
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #f8f9fa;
          padding-left: 1.5rem;
        }
        .navbar-brand {
          transition: transform 0.3s ease;
        }
        .navbar-brand:hover {
          transform: scale(1.05);
        }
      `}</style>
    </nav>
  );
}
