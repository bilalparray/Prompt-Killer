"use client";

import React, { ReactNode } from "react";
import { UserTopNav } from "./UserTopNav";
import { Footer } from "./Footer";
import { Spinner } from "../common/Spinner";

interface UserLayoutProps {
  children: ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <UserTopNav />
      <main id="main-content" className="flex-grow-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <Spinner />
    </div>
  );
}
