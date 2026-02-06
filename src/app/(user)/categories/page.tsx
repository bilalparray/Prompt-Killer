"use client";

import React, { useState, useEffect } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { useCommon } from "@/hooks/useCommon";
import Link from "next/link";

export default function CategoriesPage() {
  const { commonService } = useCommon();
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCategories();
  }, [currentPage]);

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
        categoryService.getCategoriesForUser(skip, top),
        categoryService.getCategoriesCountForUser(),
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

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <UserLayout>
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-3 fw-bold mb-4">Browse Categories</h1>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Explore our collection of prompt categories and discover amazing AI prompts
              </p>
              <div className="row g-3 justify-content-center mt-4">
                <div className="col-md-8">
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-white border-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: "1.1rem" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-5" style={{ background: "#f8f9fa", minHeight: "60vh" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <>
              <div className="row g-4 mb-5">
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
                            height: "220px",
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
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                              background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)",
                            }}
                          ></div>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            height: "220px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          }}
                        >
                          <i className="bi bi-folder text-white" style={{ fontSize: "4rem", opacity: 0.5 }}></i>
                        </div>
                      )}
                      <div className="card-body p-4 d-flex flex-column">
                        <h5 className="card-title fw-bold mb-3" style={{ fontSize: "1.3rem" }}>
                          {category.name}
                        </h5>
                        <p className="card-text text-muted flex-grow-1 mb-3">
                          {category.description || "No description available"}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                          <span
                            className="badge px-3 py-2"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              fontSize: "0.9rem",
                            }}
                          >
                            <i className="bi bi-lightning-charge me-1"></i>
                            {category.prompts?.length || 0} Prompts
                          </span>
                          <Link
                            href={`/categories/${category.slug || category.id}`}
                            className="btn btn-primary rounded-pill px-4"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                            }}
                          >
                            Explore
                            <i className="bi bi-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalCount > 0 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                      <div className="text-muted">
                        Showing {startItem} to {endItem} of {totalCount} categories
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
                                        currentPage === page
                                          ? "text-white"
                                          : ""
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
              )}
            </>
          ) : (
            <div className="col-12">
              <div
                className="alert border-0 shadow-sm text-center py-5"
                style={{
                  background: "white",
                  borderRadius: "20px",
                }}
              >
                <i className="bi bi-inbox text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="mt-3 mb-2">No categories found</h5>
                <p className="text-muted mb-0">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "No categories available at the moment"}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

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
    </UserLayout>
  );
}
