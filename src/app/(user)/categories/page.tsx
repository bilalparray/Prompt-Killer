"use client";

import React, { useState, useEffect } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import Link from "next/link";
import { useCommon } from "@/hooks/useCommon";
import { CategoryCard } from "@/components/user/CategoryCard";

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

      if (categoriesResponse.successData) setCategories(categoriesResponse.successData);
      if (countResponse.successData) setTotalCount(countResponse.successData.value);
    } catch (error: unknown) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to load categories",
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
      <section className="library-hero pb-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">Library</li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-white mb-2">Library</h1>
          <p className="text-white-50 mb-4 small">Browse prompts by category.</p>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-white">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search categories"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 library-page-bg" style={{ minHeight: "50vh" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p className="mt-3 text-muted small">Loading categories...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <>
              <div className="row g-3 g-md-4 mb-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="col-md-6 col-lg-4 col-xl-3">
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="text-muted small">
                    {startItem}–{endItem} of {totalCount}
                  </span>
                  <nav aria-label="Category pagination">
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 rounded"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          aria-label="Previous"
                        >
                          <i className="bi bi-chevron-left" />
                        </button>
                      </li>
                      <li className="page-item disabled">
                        <span className="page-link border-0 bg-transparent">
                          Page {currentPage} of {totalPages}
                        </span>
                      </li>
                      <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 rounded"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          aria-label="Next"
                        >
                          <i className="bi bi-chevron-right" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "3rem" }} />
              <p className="mt-3 text-muted mb-0">
                {searchTerm ? "No categories match your search." : "No categories available."}
              </p>
            </div>
          )}
        </div>
      </section>
    </UserLayout>
  );
}
