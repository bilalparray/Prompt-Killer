"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { useCommon } from "@/hooks/useCommon";
import Link from "next/link";

export default function AdminSettingsPage() {
  const { hasRole } = useAuth();
  const { commonService } = useCommon();
  const [settings, setSettings] = useState({
    siteName: "Boilerplate",
    siteEmail: "admin@boilerplate.com",
    maintenanceMode: false,
    allowRegistration: true,
  });

  const handleSave = async () => {
    try {
      await commonService.presentLoading("Saving settings...");
      // Here you would call your API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success",
        text: "Settings saved successfully!",
      });
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save settings",
      });
    }
  };

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5">Admin Settings</h1>
                <p className="lead">Configure system settings and preferences</p>
              </div>
              <Link href="/admin/dashboard" className="btn btn-outline-secondary">
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
                    <label htmlFor="siteName" className="form-label">
                      Site Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="siteEmail" className="form-label">
                      Site Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="siteEmail"
                      value={settings.siteEmail}
                      onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="maintenanceMode">
                      Maintenance Mode
                    </label>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="allowRegistration"
                      checked={settings.allowRegistration}
                      onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="allowRegistration">
                      Allow User Registration
                    </label>
                  </div>
                  <button className="btn btn-primary" onClick={handleSave}>
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
                  <div className="mb-3">
                    <label className="form-label">Password Policy</label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="requireStrongPassword" defaultChecked />
                      <label className="form-check-label" htmlFor="requireStrongPassword">
                        Require Strong Password
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sessionTimeout" className="form-label">
                      Session Timeout (minutes)
                    </label>
                    <input type="number" className="form-control" id="sessionTimeout" defaultValue={30} />
                  </div>
                  <button className="btn btn-primary">
                    <i className="bi bi-save me-2"></i>
                    Save Security Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Quick Links</h5>
                  <div className="d-flex flex-column gap-2">
                    <Link href="/admin/dashboard" className="btn btn-outline-secondary">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Link>
                    <Link href="/admin/users" className="btn btn-outline-secondary">
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </Link>
                    <Link href="/admin/profile" className="btn btn-outline-secondary">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
