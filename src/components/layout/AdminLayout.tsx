"use client";

import React, { ReactNode } from "react";
import { AdminTopNav } from "./AdminTopNav";
import { Footer } from "./Footer";
import { Spinner } from "../common/Spinner";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminTopNav />
      <main className="flex-grow-1">{children}</main>
      <Footer />
      <Spinner />
    </div>
  );
}
