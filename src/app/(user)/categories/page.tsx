"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { EmptyState } from "@/components/common/EmptyState";

const SEARCH_DEBOUNCE_MS = 350;

export default function CategoriesPage() {
  const { commonService } = useCommon();
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
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
      const resp = await categoryService.searchCategoriesForUser(query);
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
            <div className="col-md-8 col-lg-6 position-relative" ref={searchDropdownRef}>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-dark border-secondary text-white">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Search categories by name (e.g. how to deal)..."
                  value={apiSearchQuery}
                  onChange={(e) => setApiSearchQuery(e.target.value)}
                  onFocus={() => apiSearchResults.length > 0 && setShowSearchDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSearchDropdown(false);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  aria-label="Search categories"
                  aria-autocomplete="list"
                  aria-expanded={showSearchDropdown}
                  aria-controls="category-search-results"
                />
              </div>
              {showSearchDropdown && (apiSearchQuery.trim() || apiSearchResults.length > 0) && (
                <div
                  id="category-search-results"
                  role="listbox"
                  className="position-absolute start-0 end-0 mx-auto mt-1 rounded shadow-lg border-0 overflow-hidden z-3"
                  style={{
                    maxWidth: "100%",
                    width: "inherit",
                    maxHeight: "280px",
                    overflowY: "auto",
                    background: "var(--bs-body-bg)",
                  }}
                  aria-label="Search results"
                >
                  {apiSearchLoading ? (
                    <div className="p-3 text-center text-muted small" role="status" aria-live="polite">
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden /> Searching...
                    </div>
                  ) : apiSearchResults.length === 0 ? (
                    <div className="p-3 text-muted small" role="status" aria-live="polite">
                      {apiSearchQuery.trim() ? "No categories found." : "Type to search."}
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush" role="group" aria-label={`${apiSearchResults.length} categor${apiSearchResults.length === 1 ? "y" : "ies"} found`}>
                      {apiSearchResults.map((cat) => (
                        <li key={cat.id}>
                          <Link
                            href={`/categories/${cat.id}`}
                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-decoration-none"
                            onClick={() => {
                              setShowSearchDropdown(false);
                              setApiSearchQuery("");
                            }}
                          >
                            <span className="fw-medium">{(cat as { name?: string; title?: string }).name ?? (cat as { name?: string; title?: string }).title ?? "Category"}</span>
                            <span className="badge bg-secondary">ID {cat.id}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 library-page-bg" style={{ minHeight: "50vh" }} aria-busy={loading}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5" role="status" aria-live="polite">
              <div className="spinner-border text-primary" style={{ width: "2.5rem", height: "2.5rem" }} aria-hidden />
              <p className="mt-3 text-muted small">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <>
              <div className="row g-3 g-md-4 mb-4">
                {categories.map((category) => (
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
            <EmptyState
              icon="bi-inbox"
              title="No categories available"
              description="Categories will appear here once they’re added."
              primaryAction={{ label: "Go to Home", href: "/home" }}
            />
          )}
        </div>
      </section>
    </UserLayout>
  );
}
