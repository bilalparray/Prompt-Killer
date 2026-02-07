"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import Link from "next/link";

export default function AdminPromptsPage() {
  const { commonService } = useCommon();
  const [prompts, setPrompts] = useState<PromptSM[]>([]);
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [currentPage, selectedCategory]);

  const loadCategories = async () => {
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const response = await categoryService.getCategoriesForAdmin(0, 1000);
      if (response.successData) {
        setCategories(response.successData);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadPrompts = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading prompts...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      const skip = (currentPage - 1) * itemsPerPage;
      const top = itemsPerPage;

      let promptsResponse;
      let countResponse;

      if (selectedCategory) {
        [promptsResponse, countResponse] = await Promise.all([
          promptService.getPromptsByCategory(selectedCategory, skip, top),
          promptService.getPromptsCountByCategory(selectedCategory),
        ]);
      } else {
        [promptsResponse, countResponse] = await Promise.all([
          promptService.getPrompts(skip, top),
          promptService.getPromptsCount(),
        ]);
      }

      if (promptsResponse.successData) {
        setPrompts(promptsResponse.successData);
      }

      if (countResponse.successData) {
        setTotalCount(countResponse.successData.value);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load prompts",
      });
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    const result = await commonService.showSweetAlertConfirmation({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await commonService.presentLoading("Deleting prompt...");

        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
        const promptService = new PromptService(promptClient);

        await promptService.deletePrompt(id);

        const countResponse = selectedCategory
          ? await promptService.getPromptsCountByCategory(selectedCategory)
          : await promptService.getPromptsCount();

        if (countResponse.successData) {
          const newTotalCount = countResponse.successData.value;
          const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);

          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else {
            await loadPrompts();
          }
        } else {
          await loadPrompts();
        }

        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Deleted!",
          text: "Prompt has been deleted successfully.",
        });
      } catch (error: any) {
        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete prompt",
        });
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean, title: string) => {
    try {
      await commonService.presentLoading("Updating status...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      await promptService.updatePromptStatus(id, !currentStatus);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Updated!",
        text: `Prompt "${title}" has been ${!currentStatus ? "activated" : "deactivated"}.`,
      });
      loadPrompts();
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update status",
      });
    }
  };

  const getPromptTypeLabel = (type: PromptTypeSM): string => {
    switch (type) {
      case PromptTypeSM.Text:
        return "Text";
      case PromptTypeSM.Code:
        return "Code";
      case PromptTypeSM.Image:
        return "Image";
      default:
        return "Unknown";
    }
  };

  const getPromptTypeColor = (type: PromptTypeSM): string => {
    switch (type) {
      case PromptTypeSM.Text:
        return "#667eea";
      case PromptTypeSM.Code:
        return "#4facfe";
      case PromptTypeSM.Image:
        return "#f5576c";
      default:
        return "#6c757d";
    }
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.promptText?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name || "All Categories";

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">Prompt Management</h1>
                  <p className="text-muted mb-0">Manage and organize your AI prompts</p>
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

          {/* Search and Filters Bar */}
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "16px" }}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center g-3">
                    <div className="col-md-4">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search prompts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select form-select-lg"
                        value={selectedCategory || ""}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
                          setCurrentPage(1);
                        }}
                        style={{ borderRadius: "12px" }}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 text-end">
                      <Link
                        href="/admin/prompts/create"
                        className="btn btn-primary btn-lg rounded-pill px-4"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Prompt
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prompts Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading prompts...</p>
            </div>
          ) : filteredPrompts.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {filteredPrompts.map((prompt) => {
                  const category = categories.find((c) => c.id === prompt.categoryId);
                  const typeColor = getPromptTypeColor(prompt.promptType);
                  return (
                    <div key={prompt.id} className="col-lg-4 col-md-6">
                      <div
                        className="card border-0 shadow-sm h-100 hover-lift"
                        style={{ borderRadius: "20px" }}
                      >
                        <div className="card-body p-4 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <h5 className="card-title fw-bold mb-2" style={{ fontSize: "1.25rem" }}>
                                {prompt.title}
                              </h5>
                              {category && (
                                <span className="badge bg-secondary mb-2">{category.name}</span>
                              )}
                            </div>
                            <span
                              className={`badge px-3 py-2 ${prompt.isActive ? "bg-success" : "bg-secondary"}`}
                            >
                              {prompt.isActive ? (
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

                          <p className="text-muted small flex-grow-1 mb-3" style={{ fontSize: "0.9rem" }}>
                            {prompt.description || "No description available"}
                          </p>

                          <div className="d-flex flex-wrap gap-2 mb-3">
                            <span
                              className="badge px-3 py-2"
                              style={{
                                background: `${typeColor}15`,
                                color: typeColor,
                              }}
                            >
                              <i className="bi bi-tag me-1"></i>
                              {getPromptTypeLabel(prompt.promptType)}
                            </span>
                            {prompt.isTrending && (
                              <span className="badge px-3 py-2 bg-warning text-dark">
                                <i className="bi bi-fire me-1"></i>
                                Trending
                              </span>
                            )}
                            <span className="badge px-3 py-2 bg-info">
                              <i className="bi bi-heart me-1"></i>
                              {prompt.likesCount || 0} Likes
                            </span>
                          </div>

                          <div className="border-top pt-3">
                            <div className="btn-group w-100" role="group">
                              <Link
                                href={`/admin/prompts/edit/${prompt.id}`}
                                className="btn btn-outline-primary rounded-pill flex-fill"
                                title="Edit Prompt"
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </Link>
                              <button
                                className="btn btn-outline-success rounded-pill flex-fill"
                                onClick={() => handleToggleStatus(prompt.id, prompt.isActive, prompt.title)}
                                title={prompt.isActive ? "Deactivate" : "Activate"}
                              >
                                <i className={`bi ${prompt.isActive ? "bi-eye-slash" : "bi-eye"} me-1`}></i>
                                {prompt.isActive ? "Hide" : "Show"}
                              </button>
                              <button
                                className="btn btn-outline-danger rounded-pill flex-fill"
                                onClick={() => handleDelete(prompt.id, prompt.title)}
                                title="Delete Prompt"
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                            <strong>{totalCount}</strong> prompts
                            {selectedCategory && (
                              <span className="ms-2">
                                in <strong>{selectedCategoryName}</strong>
                              </span>
                            )}
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
                  <h5 className="mt-3 mb-2">No prompts found</h5>
                  <p className="text-muted mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : selectedCategory
                      ? `No prompts in "${selectedCategoryName}"`
                      : "Get started by creating your first prompt"}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/admin/prompts/create"
                      className="btn btn-primary rounded-pill px-4"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create First Prompt
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
