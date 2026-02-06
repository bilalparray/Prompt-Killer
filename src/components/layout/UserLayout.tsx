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
      <UserTopNav />
      <main className="flex-grow-1">{children}</main>
      <Footer />
      <Spinner />
    </div>
  );
}
