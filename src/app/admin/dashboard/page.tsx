"use client";

import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.ClientEmployee, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1 className="display-5">Admin Dashboard</h1>
              <p className="lead">Welcome back, {user?.firstName}!</p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-person-circle text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">Profile</h5>
                      <p className="text-muted small mb-0">Manage your account</p>
                    </div>
                  </div>
                  <Link href="/admin/profile" className="btn btn-outline-primary btn-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-gear text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">Settings</h5>
                      <p className="text-muted small mb-0">Configure preferences</p>
                    </div>
                  </div>
                  <Link href="/admin/settings" className="btn btn-outline-primary btn-sm">
                    Open Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-graph-up text-primary fs-1 me-3"></i>
                    <div>
                      <h5 className="card-title mb-0">Analytics</h5>
                      <p className="text-muted small mb-0">View statistics</p>
                    </div>
                  </div>
                  <Link href="/admin/analytics" className="btn btn-outline-primary btn-sm">
                    View Analytics
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
                    <Link href="/admin/profile" className="btn btn-primary">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                    <Link href="/admin/settings" className="btn btn-outline-primary">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Link>
                    <Link href="/home" className="btn btn-outline-secondary">
                      <i className="bi bi-house me-2"></i>
                      Public Site
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 mt-4">
            {(hasRole(RoleTypeSM.ClientAdmin) || hasRole(RoleTypeSM.SuperAdmin) || hasRole(RoleTypeSM.SystemAdmin)) && (
              <>
                <div className="col-md-4">
                  <div className="card shadow-sm h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-folder text-primary fs-1 me-3"></i>
                        <div>
                          <h5 className="card-title mb-0">Categories</h5>
                          <p className="text-muted small mb-0">Manage prompt categories</p>
                        </div>
                      </div>
                      <Link href="/admin/categories" className="btn btn-outline-primary btn-sm">
                        Manage Categories
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-lightning-charge text-primary fs-1 me-3"></i>
                        <div>
                          <h5 className="card-title mb-0">Prompts</h5>
                          <p className="text-muted small mb-0">Manage AI prompts</p>
                        </div>
                      </div>
                      <Link href="/admin/prompts" className="btn btn-outline-primary btn-sm">
                        Manage Prompts
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-image text-primary fs-1 me-3"></i>
                        <div>
                          <h5 className="card-title mb-0">Images</h5>
                          <p className="text-muted small mb-0">Manage prompt images</p>
                        </div>
                      </div>
                      <Link href="/admin/prompt-images" className="btn btn-outline-primary btn-sm">
                        Manage Images
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-fire text-warning fs-1 me-3"></i>
                        <div>
                          <h5 className="card-title mb-0">Trending Prompts</h5>
                          <p className="text-muted small mb-0">Manage trending prompts</p>
                        </div>
                      </div>
                      <Link href="/admin/trending-prompts" className="btn btn-outline-primary btn-sm">
                        Manage Trending
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm h-100 hover-lift">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <i className="bi bi-people text-primary fs-1 me-3"></i>
                        <div>
                          <h5 className="card-title mb-0">User Management</h5>
                          <p className="text-muted small mb-0">Manage users and permissions</p>
                        </div>
                      </div>
                      <Link href="/admin/users" className="btn btn-outline-primary btn-sm">
                        Manage Users
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
