"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useRouter } from "next/navigation";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import Link from "next/link";

const SEARCH_DEBOUNCE_MS = 350;

export default function AdminCategoriesPage() {
  const { hasRole } = useAuth();
  const { commonService } = useCommon();
  const router = useRouter();
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [apiSearchResults, setApiSearchResults] = useState<CategorySM[]>([]);
  const [apiSearchLoading, setApiSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadCategories();
  }, [currentPage]);

  const runApiSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setApiSearchResults([]);
      return;
    }
    setApiSearchLoading(true);
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);
      const resp = await categoryService.searchCategoriesForAdmin(query);
      setApiSearchResults(resp.successData ?? []);
      setShowSearchDropdown(true);
    } catch {
      setApiSearchResults([]);
    } finally {
      setApiSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!apiSearchQuery.trim()) {
      setApiSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      runApiSearch(apiSearchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [apiSearchQuery, runApiSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDelete = async (id: number, name: string) => {
    const result = await commonService.showSweetAlertConfirmation({
      title: "Are you sure?",
      text: `You are about to delete "${name}". This action cannot be undone!`,
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

        const countResponse = await categoryService.getCategoriesCountForAdmin();
        if (countResponse.successData) {
          const newTotalCount = countResponse.successData.value;
          const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);

          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else {
            await loadCategories();
          }
        } else {
          await loadCategories();
        }

        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Deleted!",
          text: "Category has been deleted successfully.",
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

  const handleToggleStatus = async (id: number, currentStatus: boolean, name: string) => {
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
        text: `Category "${name}" has been ${!currentStatus ? "activated" : "deactivated"}.`,
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

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = totalCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">Category Management</h1>
                  <p className="text-muted mb-0">Manage and organize your prompt categories</p>
                </div>
                <Link
                  href="/admin/dashboard"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Quick jump: API search */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="position-relative d-inline-block" ref={searchDropdownRef} style={{ minWidth: "280px" }}>
                <label className="form-label small text-muted mb-1">Quick find category (by name)</label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. how to deal..."
                    value={apiSearchQuery}
                    onChange={(e) => setApiSearchQuery(e.target.value)}
                    onFocus={() => apiSearchResults.length > 0 && setShowSearchDropdown(true)}
                    aria-label="Search categories by API"
                  />
                </div>
                {showSearchDropdown && (apiSearchQuery.trim() || apiSearchResults.length > 0) && (
                  <div
                    className="position-absolute start-0 top-100 mt-1 rounded shadow border overflow-hidden z-3 bg-white"
                    style={{ minWidth: "100%", maxHeight: "260px", overflowY: "auto" }}
                  >
                    {apiSearchLoading ? (
                      <div className="p-3 text-center text-muted small">
                        <span className="spinner-border spinner-border-sm me-2" /> Searching...
                      </div>
                    ) : apiSearchResults.length === 0 ? (
                      <div className="p-3 text-muted small">
                        {apiSearchQuery.trim() ? "No categories found." : "Type to search."}
                      </div>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {apiSearchResults.map((cat) => (
                          <li key={cat.id}>
                            <button
                              type="button"
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center w-100 border-0 text-start"
                              onClick={() => {
                                setShowSearchDropdown(false);
                                setApiSearchQuery("");
                                router.push(`/admin/categories/${cat.id}/prompts`);
                              }}
                            >
                              <span className="fw-medium">{(cat as { name?: string; title?: string }).name ?? (cat as { name?: string; title?: string }).title ?? "Category"}</span>
                              <span className="badge bg-secondary">ID {cat.id}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Actions Bar */}
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "16px" }}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center g-3">
                    <div className="col-md-8">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Filter list by name, slug, or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <Link
                        href="/admin/categories/create"
                        className="btn btn-primary btn-lg rounded-pill px-4"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Category
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="col-lg-4 col-md-6">
                    <div
                      className="card border-0 shadow-sm h-100 hover-lift"
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                    >
                      {category.imageBase64 ? (
                        <div
                          className="position-relative"
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${category.imageBase64}`}
                            className="w-100 h-100"
                            alt={category.name}
                            style={{ objectFit: "cover" }}
                          />
                          <div
                            className="position-absolute top-0 end-0 m-2"
                          >
                            <span
                              className={`badge px-3 py-2 ${
                                category.isActive ? "bg-success" : "bg-secondary"
                              }`}
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
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "200px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}
                        >
                          <i className="bi bi-folder text-white" style={{ fontSize: "4rem", opacity: 0.5 }}></i>
                          <div className="position-absolute top-0 end-0 m-2">
                            <span
                              className={`badge px-3 py-2 ${
                                category.isActive ? "bg-success" : "bg-secondary"
                              }`}
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
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="card-body p-4 d-flex flex-column">
                        <h5 className="card-title fw-bold mb-2" style={{ fontSize: "1.25rem" }}>
                          {category.name}
                        </h5>
                        <p className="text-muted small mb-2">
                          <code className="text-primary">{category.slug || "N/A"}</code>
                        </p>
                        <p className="card-text text-muted flex-grow-1 mb-3" style={{ fontSize: "0.9rem" }}>
                          {category.description || "No description available"}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mb-3 pt-3 border-top">
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            }}
                          >
                            <i className="bi bi-lightning-charge me-1"></i>
                            {category.prompts?.length || 0} Prompts
                          </span>
                        </div>
                        <div className="btn-group w-100" role="group">
                          <Link
                            href={`/admin/categories/${category.id}/prompts`}
                            className="btn btn-outline-info rounded-pill flex-fill"
                            title="Manage Prompts"
                          >
                            <i className="bi bi-lightning-charge me-1"></i>
                            Prompts
                          </Link>
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="btn btn-outline-primary rounded-pill flex-fill"
                            title="Edit Category"
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Edit
                          </Link>
                          <button
                            className="btn btn-outline-success rounded-pill flex-fill"
                            onClick={() => handleToggleStatus(category.id, category.isActive, category.name)}
                            title={category.isActive ? "Deactivate" : "Activate"}
                          >
                            <i className={`bi ${category.isActive ? "bi-eye-slash" : "bi-eye"} me-1`}></i>
                            {category.isActive ? "Hide" : "Show"}
                          </button>
                          <button
                            className="btn btn-outline-danger rounded-pill flex-fill"
                            onClick={() => handleDelete(category.id, category.name)}
                            title="Delete Category"
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalCount > 0 && (
                <div className="row mt-4">
                  <div className="col-12">
                    <div
                      className="card border-0 shadow-sm"
                      style={{ borderRadius: "16px" }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                          <div className="text-muted">
                            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{" "}
                            <strong>{totalCount}</strong> categories
                          </div>
                          <nav>
                            <ul className="pagination mb-0">
                              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button
                                  className="page-link border-0 rounded-pill me-2"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  aria-label="Previous"
                                  style={{ minWidth: "40px" }}
                                >
                                  <i className="bi bi-chevron-left"></i>
                                </button>
                              </li>

                              {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((page) => {
                                  return (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                  );
                                })
                                .map((page, index, array) => {
                                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                                  return (
                                    <React.Fragment key={page}>
                                      {showEllipsisBefore && (
                                        <li className="page-item disabled">
                                          <span className="page-link border-0">...</span>
                                        </li>
                                      )}
                                      <li className={`page-item ${currentPage === page ? "active" : ""}`}>
                                        <button
                                          className={`page-link border-0 rounded-pill ${
                                            currentPage === page ? "text-white" : ""
                                          }`}
                                          onClick={() => handlePageChange(page)}
                                          style={{
                                            minWidth: "40px",
                                            background:
                                              currentPage === page
                                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                : "transparent",
                                          }}
                                        >
                                          {page}
                                        </button>
                                      </li>
                                    </React.Fragment>
                                  );
                                })}

                              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button
                                  className="page-link border-0 rounded-pill ms-2"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                  aria-label="Next"
                                  style={{ minWidth: "40px" }}
                                >
                                  <i className="bi bi-chevron-right"></i>
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-12">
              <div
                className="card border-0 shadow-sm text-center py-5"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: "4rem" }}></i>
                  <h5 className="mt-3 mb-2">No categories found</h5>
                  <p className="text-muted mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Get started by creating your first category"}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/admin/categories/create"
                      className="btn btn-primary rounded-pill px-4"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create First Category
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          .hover-lift {
            transition: all 0.3s ease;
          }

          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2) !important;
          }

          .page-link {
            transition: all 0.3s ease;
          }

          .page-link:hover:not(.disabled) {
            transform: translateY(-2px);
          }
        `}</style>
      </AdminLayout>
    </AuthGuard>
  );
}
