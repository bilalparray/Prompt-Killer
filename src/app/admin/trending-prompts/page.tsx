"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { TrendingPromptService } from "@/services/trending-prompt.service";
import { TrendingPromptClient } from "@/api/trending-prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { TrendingPromptSM } from "@/models/service/app/v1/prompt/trending-prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import Link from "next/link";

export default function AdminTrendingPromptsPage() {
  const { commonService } = useCommon();
  const [trendingPrompts, setTrendingPrompts] = useState<TrendingPromptSM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadTrendingPrompts();
  }, [currentPage]);

  const loadTrendingPrompts = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading trending prompts...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const trendingPromptClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
      const trendingPromptService = new TrendingPromptService(trendingPromptClient);

      const skip = (currentPage - 1) * itemsPerPage;
      const top = itemsPerPage;

      const [promptsResponse, countResponse] = await Promise.all([
        trendingPromptService.getTrendingPrompts(skip, top),
        trendingPromptService.getTrendingPromptsCount(),
      ]);

      if (promptsResponse.successData) {
        setTrendingPrompts(promptsResponse.successData);
      }

      if (countResponse.successData) {
        setTotalCount(countResponse.successData.value);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load trending prompts",
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
        await commonService.presentLoading("Deleting trending prompt...");

        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const trendingPromptClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
        const trendingPromptService = new TrendingPromptService(trendingPromptClient);

        await trendingPromptService.deleteTrendingPrompt(id);

        const countResponse = await trendingPromptService.getTrendingPromptsCount();

        if (countResponse.successData) {
          const newTotalCount = countResponse.successData.value;
          const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);

          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else {
            await loadTrendingPrompts();
          }
        } else {
          await loadTrendingPrompts();
        }

        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Deleted!",
          text: "Trending prompt has been deleted successfully.",
        });
      } catch (error: any) {
        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete trending prompt",
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
      const trendingPromptClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
      const trendingPromptService = new TrendingPromptService(trendingPromptClient);

      await trendingPromptService.updateTrendingPromptStatus(id, !currentStatus);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Updated!",
        text: `Trending prompt "${title}" has been ${!currentStatus ? "activated" : "deactivated"}.`,
      });
      loadTrendingPrompts();
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

  const filteredTrendingPrompts = trendingPrompts.filter(
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

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">
                    <i className="bi bi-fire me-2 text-warning"></i>
                    Trending Prompts Management
                  </h1>
                  <p className="text-muted mb-0">Manage and organize trending AI prompts</p>
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

          {/* Search Bar */}
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
                          placeholder="Search trending prompts..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 text-end">
                      <Link
                        href="/admin/trending-prompts/create"
                        className="btn btn-primary btn-lg rounded-pill px-4"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Trending Prompt
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Prompts Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading trending prompts...</p>
            </div>
          ) : filteredTrendingPrompts.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {filteredTrendingPrompts.map((prompt) => {
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
                              <span className="badge bg-warning text-dark mb-2">
                                <i className="bi bi-fire me-1"></i>
                                Trending
                              </span>
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
                            <span className="badge px-3 py-2 bg-info">
                              <i className="bi bi-heart me-1"></i>
                              {prompt.likesCount || 0} Likes
                            </span>
                          </div>

                          <div className="border-top pt-3">
                            <div className="btn-group w-100" role="group">
                              <Link
                                href={`/admin/trending-prompts/edit/${prompt.id}`}
                                className="btn btn-outline-primary rounded-pill flex-fill"
                                title="Edit Trending Prompt"
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
                                title="Delete Trending Prompt"
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
                            <strong>{totalCount}</strong> trending prompts
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
                  <i className="bi bi-fire text-muted" style={{ fontSize: "4rem" }}></i>
                  <h5 className="mt-3 mb-2">No trending prompts found</h5>
                  <p className="text-muted mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Get started by creating your first trending prompt"}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/admin/trending-prompts/create"
                      className="btn btn-primary rounded-pill px-4"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create First Trending Prompt
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
