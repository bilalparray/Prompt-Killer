"use client";

import React, { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { Spinner } from "../common/Spinner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <TopNav />
      <main className="flex-grow-1">{children}</main>
      <Footer />
      <Spinner />
    </div>
  );
}
