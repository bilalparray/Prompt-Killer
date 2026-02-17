"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useTheme } from "@/hooks/useTheme";
import { AppConstants } from "@/constants/app-constants";

export function UserTopNav() {
  const { isAuthenticated } = useAuth();
  const { showNav } = useCommon();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!showNav) return null;

  const navLinks = [
    { href: "/home", label: "Home", icon: "bi-house-door" },
    { href: "/categories", label: "Library", icon: "bi-folder2-open" },
    { href: "/trending", label: "Trending", icon: "bi-fire" },
    { href: "/about", label: "About", icon: "bi-info-circle" },
    { href: "/contact", label: "Contact", icon: "bi-envelope" },
  ];

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top transition-all ${
          scrolled ? "navbar-scrolled shadow-lg" : "navbar-transparent"
        }`}
        style={{
          background: scrolled
            ? theme === "dark"
              ? "rgba(26, 26, 46, 0.95)"
              : "rgba(255, 255, 255, 0.95)"
            : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container">
          <Link
            className="navbar-brand d-flex align-items-center fw-bold"
            href="/home"
            style={{ fontSize: "1.5rem" }}
          >
            <span
              className="d-inline-flex align-items-center justify-content-center me-2 rounded"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <i className="bi bi-lightning-charge-fill"></i>
            </span>
            <span className="gradient-text">Prompt Killer</span>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
            style={{ padding: "4px 8px" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
            id="userNavbarNav"
          >
            <ul className="navbar-nav mx-auto">
              {navLinks.map((link) => (
                <li key={link.href} className="nav-item">
                  <Link
                    className={`nav-link position-relative ${
                      pathname === link.href ? "active" : ""
                    }`}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className={`bi ${link.icon} me-1`}></i>
                    {link.label}
                    {pathname === link.href && (
                      <span
                        className="position-absolute bottom-0 start-50 translate-middle-x"
                        style={{
                          width: "30px",
                          height: "3px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "2px",
                        }}
                      ></span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="navbar-nav align-items-center">
              <li className="nav-item me-3">
                <button
                  className="btn btn-link nav-link p-2 rounded-circle"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  style={{
                    border: "none",
                    background: "rgba(0,0,0,0.05)",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
                </button>
              </li>

              {isAuthenticated && (
                <li className="nav-item">
                  <Link
                    className="btn btn-primary rounded-pill px-4"
                    href={`/${AppConstants.WEB_ROUTES.ADMIN.DASHBOARD}`}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                    }}
                  >
                    <i className="bi bi-shield-check me-1"></i>
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar {
          padding: 1rem 0;
          transition: all 0.3s ease;
        }

        .navbar-transparent .nav-link {
          color: white !important;
        }

        .navbar-scrolled .nav-link {
          color: var(--bs-body-color) !important;
        }

        .navbar-scrolled .navbar-brand {
          color: var(--bs-body-color) !important;
        }

        .nav-link {
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin: 0 2px;
        }

        .nav-link:hover {
          background: rgba(102, 126, 234, 0.1) !important;
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: #667eea !important;
          font-weight: 600;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2833, 37, 41, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            background: var(--bs-body-bg);
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 12px;
            backdrop-filter: blur(10px);
          }
        }
      `}</style>
    </>
  );
}
