"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import Link from "next/link";

export default function AdminPromptImagesPage() {
  const { commonService } = useCommon();
  const [images, setImages] = useState<PromptImageSM[]>([]);
  const [prompts, setPrompts] = useState<PromptSM[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageType, setImageType] = useState<"all" | "prompts" | "trending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadPrompts();
  }, []);

  useEffect(() => {
    loadImages();
  }, [currentPage, imageType]);

  const loadPrompts = async () => {
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      const response = await promptService.getPrompts(0, 1000);
      if (response.successData) {
        setPrompts(response.successData);
      }
    } catch (error) {
      console.error("Failed to load prompts:", error);
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading images...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptImageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
      const promptImageService = new PromptImageService(promptImageClient);

      const skip = (currentPage - 1) * itemsPerPage;
      const top = itemsPerPage;

      let imagesResponse;
      let countResponse;

      if (imageType === "trending") {
        [imagesResponse, countResponse] = await Promise.all([
          promptImageService.getTrendingPromptImages(skip, top),
          promptImageService.getTrendingPromptImagesCount(),
        ]);
      } else if (imageType === "prompts") {
        [imagesResponse, countResponse] = await Promise.all([
          promptImageService.getPromptImages(skip, top),
          promptImageService.getPromptImagesCount(),
        ]);
      } else {
        // Load both and combine
        const [promptsResponse, trendingResponse, promptsCount, trendingCount] = await Promise.all([
          promptImageService.getPromptImages(skip, top),
          promptImageService.getTrendingPromptImages(skip, top),
          promptImageService.getPromptImagesCount(),
          promptImageService.getTrendingPromptImagesCount(),
        ]);

        const allImages = [
          ...(promptsResponse.successData || []),
          ...(trendingResponse.successData || []),
        ];
        setImages(allImages);
        const total = (promptsCount.successData?.value || 0) + (trendingCount.successData?.value || 0);
        setTotalCount(total);
        await commonService.dismissLoader();
        setLoading(false);
        return;
      }

      if (imagesResponse.successData) {
        setImages(imagesResponse.successData);
      }

      if (countResponse.successData) {
        setTotalCount(countResponse.successData.value);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load images",
      });
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await commonService.showSweetAlertConfirmation({
      title: "Are you sure?",
      text: "You are about to delete this image. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await commonService.presentLoading("Deleting image...");

        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const promptImageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
        const promptImageService = new PromptImageService(promptImageClient);

        await promptImageService.deletePromptImage(id);

        const countResponse =
          imageType === "trending"
            ? await promptImageService.getTrendingPromptImagesCount()
            : await promptImageService.getPromptImagesCount();

        if (countResponse.successData) {
          const newTotalCount = countResponse.successData.value;
          const newTotalPages = Math.ceil(newTotalCount / itemsPerPage);

          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          } else {
            await loadImages();
          }
        } else {
          await loadImages();
        }

        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Deleted!",
          text: "Image has been deleted successfully.",
        });
      } catch (error: any) {
        await commonService.dismissLoader();
        await commonService.showSweetAlertToast({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete image",
        });
      }
    }
  };

  const getPromptName = (image: PromptImageSM): string => {
    if (image.promptId) {
      const prompt = prompts.find((p) => p.id === image.promptId);
      return prompt?.title || `Prompt #${image.promptId}`;
    }
    if (image.trendingPromptId) {
      return `Trending Prompt #${image.trendingPromptId}`;
    }
    return "Unknown";
  };

  const filteredImages = images.filter(
    (img) =>
      img.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPromptName(img).toLowerCase().includes(searchTerm.toLowerCase())
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
                  <h1 className="display-5 fw-bold mb-2">Prompt Images</h1>
                  <p className="text-muted mb-0">Manage images for prompts</p>
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
                          placeholder="Search images..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ borderRadius: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <select
                        className="form-select form-select-lg"
                        value={imageType}
                        onChange={(e) => {
                          setImageType(e.target.value as "all" | "prompts" | "trending");
                          setCurrentPage(1);
                        }}
                        style={{ borderRadius: "12px" }}
                      >
                        <option value="all">All Images</option>
                        <option value="prompts">Prompt Images</option>
                        <option value="trending">Trending Prompt Images</option>
                      </select>
                    </div>
                    <div className="col-md-4 text-end">
                      <Link
                        href="/admin/prompt-images/create"
                        className="btn btn-primary btn-lg rounded-pill px-4"
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Image
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading images...</p>
            </div>
          ) : filteredImages.length > 0 ? (
            <>
              <div className="row g-4 mb-4">
                {filteredImages.map((image) => (
                  <div key={image.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div
                      className="card border-0 shadow-sm h-100 hover-lift"
                      style={{ borderRadius: "20px", overflow: "hidden" }}
                    >
                      {image.imageBase64 && (
                        <div
                          className="position-relative"
                          style={{
                            height: "200px",
                            overflow: "hidden",
                            background: "#f8f9fa",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${image.imageBase64}`}
                            className="w-100 h-100"
                            alt={image.description || "Prompt image"}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            {image.promptId && (
                              <span className="badge bg-primary">Prompt</span>
                            )}
                            {image.trendingPromptId && (
                              <span className="badge bg-warning text-dark">Trending</span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="card-body p-3 d-flex flex-column">
                        <h6 className="card-title fw-bold mb-2" style={{ fontSize: "0.95rem" }}>
                          {getPromptName(image)}
                        </h6>
                        <p className="text-muted small flex-grow-1 mb-2" style={{ fontSize: "0.85rem" }}>
                          {image.description || "No description"}
                        </p>
                        <div className="border-top pt-2">
                          <div className="btn-group w-100" role="group">
                            <Link
                              href={`/admin/prompt-images/edit/${image.id}`}
                              className="btn btn-outline-primary btn-sm rounded-pill flex-fill"
                              title="Edit Image"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-pill flex-fill"
                              onClick={() => handleDelete(image.id)}
                              title="Delete Image"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
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
                            <strong>{totalCount}</strong> images
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
                  <i className="bi bi-image text-muted" style={{ fontSize: "4rem" }}></i>
                  <h5 className="mt-3 mb-2">No images found</h5>
                  <p className="text-muted mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Get started by uploading your first prompt image"}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/admin/prompt-images/create"
                      className="btn btn-primary rounded-pill px-4"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Upload First Image
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
