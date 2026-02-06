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

      // Load categories and count in parallel
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

  // Calculate pagination
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
      <div className="container mt-5 mb-5">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-4">Browse Categories</h1>
            <p className="lead">Explore our collection of prompt categories</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="col-lg-4 col-md-6">
                  <div className="card shadow-sm h-100 hover-lift">
                    {category.imageBase64 && (
                      <img
                        src={`data:image/png;base64,${category.imageBase64}`}
                        className="card-img-top"
                        alt={category.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{category.name}</h5>
                      <p className="card-text text-muted flex-grow-1">
                        {category.description || "No description available"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="badge bg-primary">
                          {category.prompts?.length || 0} Prompts
                        </span>
                        <Link
                          href={`/categories/${category.slug || category.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Prompts
                          <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  No categories available at the moment.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalCount > 0 && (
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
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous"
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
                        aria-label="Next"
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
      </div>
    </UserLayout>
  );
}
