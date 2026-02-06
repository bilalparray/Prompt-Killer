"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import Link from "next/link";

export default function UserSettingsPage() {
  return (
    <AuthGuard>
      <UserLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1>Settings</h1>
              <Link href="/user/dashboard" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-gear me-2"></i>
                    General Settings
                  </h5>
                  <div className="mb-3">
                    <label className="form-label">Notification Preferences</label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        Email Notifications
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="smsNotifications" />
                      <label className="form-check-label" htmlFor="smsNotifications">
                        SMS Notifications
                      </label>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Save Settings
                  </button>
                </div>
              </div>

              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">
                    <i className="bi bi-shield-lock me-2"></i>
                    Security Settings
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    <Link href="/admin/auth/resetpassword" className="btn btn-outline-primary">
                      <i className="bi bi-key me-2"></i>
                      Change Password
                    </Link>
                    <Link href="/admin/auth/verifyemail" className="btn btn-outline-primary">
                      <i className="bi bi-envelope-check me-2"></i>
                      Verify Email
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Quick Links</h5>
                  <div className="d-flex flex-column gap-2">
                    <Link href="/user/profile" className="btn btn-outline-secondary">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                    <Link href="/user/dashboard" className="btn btn-outline-secondary">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
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
