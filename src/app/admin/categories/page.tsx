"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const { hasRole } = useAuth();
  const { commonService } = useCommon();
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategorySM | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadCategories();
  }, [currentPage]);

  useEffect(() => {
    // Reset to page 1 when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading categories...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const skip = (currentPage - 1) * itemsPerPage;
      const top = itemsPerPage;

      // Load categories and count in parallel
      const [categoriesResponse, countResponse] = await Promise.all([
        categoryService.getCategoriesForAdmin(skip, top),
        categoryService.getCategoriesCountForAdmin(),
      ]);

      if (categoriesResponse.successData) {
        setCategories(categoriesResponse.successData);
      }

      if (countResponse.successData) {
        setTotalCount(countResponse.successData.value);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load categories",
      });
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await commonService.showSweetAlertConfirmation({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await commonService.presentLoading("Deleting category...");

        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
        const categoryService = new CategoryService(categoryClient);

        await categoryService.deleteCategory(id);

        // Check if we need to adjust page after deletion
        const countResponse = await categoryService.getCategoriesCountForAdmin();
        if (countResponse.successData) {
          const newTotalCount = countResponse.successData.value;
          const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);

          // If current page is beyond available pages, go to last page
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else {
            // Reload current page
            await loadCategories();
          }
        } else {
          await loadCategories();
        }

        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted.",
        });
      } catch (error: any) {
        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete category",
        });
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await commonService.presentLoading("Updating status...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      await categoryService.updateCategoryStatus(id, !currentStatus);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Updated!",
        text: "Category status has been updated.",
      });
      loadCategories();
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update status",
      });
    }
  };

  // Filter categories based on search term (client-side filtering for current page)
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-5">Category Management</h1>
                <p className="lead">Manage prompt categories</p>
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
                          placeholder="Search categories by name or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <Link href="/admin/categories/create" className="btn btn-primary">
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Category
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Prompts</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <tr key={category.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {category.imageBase64 && (
                                      <img
                                        src={`data:image/png;base64,${category.imageBase64}`}
                                        alt={category.name}
                                        className="rounded me-2"
                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                      />
                                    )}
                                    <strong>{category.name}</strong>
                                  </div>
                                </td>
                                <td>
                                  <code className="text-muted">{category.slug || "N/A"}</code>
                                </td>
                                <td>
                                  <span className="text-muted" style={{ maxWidth: "300px", display: "inline-block" }}>
                                    {category.description || "No description"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className={`btn btn-sm ${category.isActive ? "btn-success" : "btn-secondary"}`}
                                    onClick={() => handleToggleStatus(category.id, category.isActive)}
                                    title={category.isActive ? "Click to deactivate" : "Click to activate"}
                                  >
                                    {category.isActive ? (
                                      <>
                                        <i className="bi bi-check-circle me-1"></i>
                                        Active
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-x-circle me-1"></i>
                                        Inactive
                                      </>
                                    )}
                                  </button>
                                </td>
                                <td>
                                  <span className="badge bg-info">
                                    {category.prompts?.length || 0} prompts
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <Link
                                      href={`/admin/categories/edit/${category.id}`}
                                      className="btn btn-sm btn-outline-primary"
                                      title="Edit"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDelete(category.id)}
                                      title="Delete"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center text-muted py-4">
                                {searchTerm ? "No categories found matching your search" : "No categories found"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalCount > 0 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                          Showing {startItem} to {endItem} of {totalCount} categories
                        </div>
                        <nav>
                          <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                <i className="bi bi-chevron-left"></i>
                              </button>
                            </li>

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter((page) => {
                                // Show first page, last page, current page, and pages around current
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  (page >= currentPage - 1 && page <= currentPage + 1)
                                );
                              })
                              .map((page, index, array) => {
                                // Add ellipsis if there's a gap
                                const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                                return (
                                  <React.Fragment key={page}>
                                    {showEllipsisBefore && (
                                      <li className="page-item disabled">
                                        <span className="page-link">...</span>
                                      </li>
                                    )}
                                    <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                      <button
                                        className="page-link"
                                        onClick={() => handlePageChange(page)}
                                      >
                                        {page}
                                      </button>
                                    </li>
                                  </React.Fragment>
                                );
                              })}

                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
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
