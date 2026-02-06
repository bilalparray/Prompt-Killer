"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function UserProfilePage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <UserLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1>My Profile</h1>
              <Link href="/user/dashboard" className="btn btn-outline-secondary btn-sm">
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
                    <h5 className="card-title mb-4">
                      <i className="bi bi-person-circle me-2"></i>
                      Personal Information
                    </h5>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Full Name:</strong>
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
                        {user.isEmailConfirmed ? (
                          <span className="badge bg-success ms-2">
                            <i className="bi bi-check-circle me-1"></i>Verified
                          </span>
                        ) : (
                          <span className="badge bg-warning ms-2">
                            <i className="bi bi-exclamation-circle me-1"></i>Not Verified
                          </span>
                        )}
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
                        {user.phoneNumber || "Not provided"}
                        {user.isPhoneNumberConfirmed && user.phoneNumber && (
                          <span className="badge bg-success ms-2">
                            <i className="bi bi-check-circle me-1"></i>Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Date of Birth:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.dateOfBirth
                          ? new Date(user.dateOfBirth).toLocaleDateString()
                          : "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card shadow-sm mt-4">
                  <div className="card-body">
                    <h5 className="card-title mb-4">
                      <i className="bi bi-shield-check me-2"></i>
                      Account Security
                    </h5>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Account Status:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.loginStatus === 1 ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-warning">Inactive</span>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-4">
                        <strong>Member Since:</strong>
                      </div>
                      <div className="col-sm-8">
                        {user.createdOnUTC
                          ? new Date(user.createdOnUTC).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link href="/admin/auth/resetpassword" className="btn btn-outline-primary">
                        <i className="bi bi-key me-2"></i>
                        Change Password
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body text-center">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{
                        width: "120px",
                        height: "120px",
                        fontSize: "48px",
                        fontWeight: "bold",
                      }}
                    >
                      {user.firstName?.charAt(0).toUpperCase()}
                      {user.lastName?.charAt(0).toUpperCase()}
                    </div>
                    <h5 className="card-title">
                      {user.firstName} {user.lastName}
                    </h5>
                    <p className="text-muted">{user.emailId}</p>
                    <Link href="/user/settings" className="btn btn-primary w-100">
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </UserLayout>
    </AuthGuard>
  );
}
