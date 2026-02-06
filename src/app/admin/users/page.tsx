"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import Link from "next/link";

export default function AdminUsersPage() {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // This would typically come from an API call
  const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: RoleTypeSM.ClientEmployee,
      status: "Active",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      role: RoleTypeSM.ClientAdmin,
      status: "Active",
    },
  ];

  const getRoleName = (roleType: RoleTypeSM) => {
    switch (roleType) {
      case RoleTypeSM.SuperAdmin:
        return "Super Admin";
      case RoleTypeSM.SystemAdmin:
        return "System Admin";
      case RoleTypeSM.ClientAdmin:
        return "Admin";
      case RoleTypeSM.ClientEmployee:
        return "Employee";
      default:
        return "User";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5">User Management</h1>
                <p className="lead">Manage users and their permissions</p>
              </div>
              <Link href="/admin/dashboard" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search users by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <button className="btn btn-primary">
                        <i className="bi bi-person-plus me-2"></i>
                        Add New User
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id}>
                              <td>
                                {user.firstName} {user.lastName}
                              </td>
                              <td>{user.email}</td>
                              <td>
                                <span className="badge bg-primary">{getRoleName(user.role)}</span>
                              </td>
                              <td>
                                <span className="badge bg-success">{user.status}</span>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button className="btn btn-sm btn-outline-primary" title="Edit">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger" title="Delete">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
