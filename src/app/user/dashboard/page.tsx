"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function UserDashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <UserLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="display-5">User Dashboard</h1>
              <p className="lead">Welcome back, {user?.firstName}!</p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm h-100 hover-lift">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-person-circle text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">My Profile</h5>
                      <p className="text-muted small mb-0">View and edit your profile</p>
                    </div>
                  </div>
                  <Link href="/user/profile" className="btn btn-outline-primary btn-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100 hover-lift">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-gear text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">Settings</h5>
                      <p className="text-muted small mb-0">Manage your preferences</p>
                    </div>
                  </div>
                  <Link href="/user/settings" className="btn btn-outline-primary btn-sm">
                    Open Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100 hover-lift">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-shield-check text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">Admin Panel</h5>
                      <p className="text-muted small mb-0">Access admin features</p>
                    </div>
                  </div>
                  <Link href="/admin/dashboard" className="btn btn-outline-primary btn-sm">
                    Go to Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Quick Actions</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <Link href="/user/profile" className="btn btn-primary">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                    <Link href="/user/settings" className="btn btn-outline-primary">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                    <Link href="/home" className="btn btn-outline-secondary">
                      <i className="bi bi-house me-2"></i>
                      Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </AuthGuard>
  );
}
