"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-auto" style={{ color: "#ffffff !important" }}>
      <div className="container py-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <i className="bi bi-lightning-charge-fill me-2 text-primary" />
              <span className="fw-bold text-white">Prompt Killer</span>
            </div>
            <p className="small mb-0 mt-1" style={{ color: "#b0b0b0" }}>
              Curated prompt library. Browse, copy, use — no sign-up.
            </p>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-3 justify-content-md-end">
              <Link href="/categories" className="text-decoration-none" style={{ color: "#b0b0b0" }}>
                Library
              </Link>
              <Link href="/trending" className="text-decoration-none" style={{ color: "#b0b0b0" }}>
                Trending
              </Link>
              <Link href="/about" className="text-decoration-none" style={{ color: "#b0b0b0" }}>
                About
              </Link>
              <Link href="/contact" className="text-decoration-none" style={{ color: "#b0b0b0" }}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top py-3" style={{ borderColor: "#495057 !important" }}>
        <div className="container">
          <p className="mb-0 small text-center text-md-start" style={{ color: "#b0b0b0" }}>
            © {currentYear} Prompt Killer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
