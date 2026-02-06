"use client";

import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import Link from "next/link";

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.ClientEmployee, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1>Admin Profile</h1>
              <Link href="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
            </div>
          </div>

          {user && (
            <div className="row">
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title mb-4">User Information</h5>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Name:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.firstName} {user.middleName} {user.lastName}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Email:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.emailId}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Login ID:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.loginId}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Phone:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.phoneNumber || "N/A"}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Email Verified:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.isEmailConfirmed ? (
                          <span className="badge bg-success">Yes</span>
                        ) : (
                          <span className="badge bg-warning">No</span>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Role:</strong>
                      </div>
                      <div className="col-sm-8">
                        <span className="badge bg-primary">
                          {user.roleType === 3 ? "Client Admin" : user.roleType === 4 ? "Client Employee" : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
