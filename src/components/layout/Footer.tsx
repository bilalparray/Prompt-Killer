"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Updates", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Licenses", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status", href: "#" },
      { name: "Report a Bug", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: "bi-facebook", href: "#", label: "Facebook" },
    { icon: "bi-twitter", href: "#", label: "Twitter" },
    { icon: "bi-linkedin", href: "#", label: "LinkedIn" },
    { icon: "bi-github", href: "#", label: "GitHub" },
    { icon: "bi-instagram", href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-dark text-white mt-auto" style={{ color: "#ffffff !important" }}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-lightning-charge-fill me-2 fs-3 text-primary"></i>
              <span className="fs-4 fw-bold text-white">Prompt Killer</span>
            </div>
            <p className="mb-3" style={{ color: "#b0b0b0" }}>
              Advanced prompt management platform with authentication,
              API client architecture, and encrypted storage.
            </p>
            <div className="d-flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-white text-decoration-none"
                  aria-label={social.label}
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <i className={`bi ${social.icon} fs-5`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-semibold mb-3 text-white">Product</h5>
            <ul className="list-unstyled">
              {footerLinks.product.map((link) => (
                <li key={link.name} className="mb-2">
                  <Link
                    href={link.href}
                    className="text-decoration-none"
                    style={{ 
                      color: "#b0b0b0",
                      transition: "color 0.3s ease" 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-semibold mb-3 text-white">Company</h5>
            <ul className="list-unstyled">
              {footerLinks.company.map((link) => (
                <li key={link.name} className="mb-2">
                  <Link
                    href={link.href}
                    className="text-decoration-none"
                    style={{ 
                      color: "#b0b0b0",
                      transition: "color 0.3s ease" 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-semibold mb-3 text-white">Legal</h5>
            <ul className="list-unstyled">
              {footerLinks.legal.map((link) => (
                <li key={link.name} className="mb-2">
                  <Link
                    href={link.href}
                    className="text-decoration-none"
                    style={{ 
                      color: "#b0b0b0",
                      transition: "color 0.3s ease" 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="fw-semibold mb-3 text-white">Support</h5>
            <ul className="list-unstyled">
              {footerLinks.support.map((link) => (
                <li key={link.name} className="mb-2">
                  <Link
                    href={link.href}
                    className="text-decoration-none"
                    style={{ 
                      color: "#b0b0b0",
                      transition: "color 0.3s ease" 
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#b0b0b0")}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="row mt-5 pt-4 border-top" style={{ borderColor: "#495057 !important" }}>
          <div className="col-lg-6 mb-3 mb-lg-0">
            <h5 className="fw-semibold mb-3 text-white">Subscribe to our newsletter</h5>
            <p className="mb-3" style={{ color: "#b0b0b0" }}>
              Get the latest updates, news, and exclusive offers delivered to your inbox.
            </p>
            <div className="input-group" style={{ maxWidth: "400px" }}>
              <input
                type="email"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Enter your email"
                aria-label="Email address"
                style={{ borderRadius: "6px 0 0 6px" }}
              />
              <button
                className="btn btn-primary"
                type="button"
                style={{ borderRadius: "0 6px 6px 0" }}
              >
                <i className="bi bi-send me-1"></i>
                Subscribe
              </button>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-end justify-content-lg-end">
            <div className="text-center text-lg-end">
              <div className="d-flex align-items-center justify-content-center justify-content-lg-end mb-2">
                <i className="bi bi-shield-check text-primary me-2 fs-5"></i>
                <span className="fw-semibold text-white">Secure & Trusted</span>
              </div>
              <p className="small mb-0" style={{ color: "#b0b0b0" }}>
                Your data is encrypted and secure with us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-top" style={{ borderColor: "#495057 !important" }}>
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0" style={{ color: "#b0b0b0" }}>
                © {currentYear} <span className="fw-semibold text-white">Prompt Killer</span>. All rights
                reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-3">
                <span className="small" style={{ color: "#b0b0b0" }}>Made with</span>
                <i className="bi bi-heart-fill text-danger"></i>
                <span className="small" style={{ color: "#b0b0b0" }}>by Prompt Killer Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
