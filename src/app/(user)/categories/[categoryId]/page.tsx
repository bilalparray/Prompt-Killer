"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { PromptCard } from "@/components/user/PromptCard";

function getDisplayDescription(description: string | undefined): string | null {
  const d = description?.trim();
  if (!d) return null;
  if (d.toLowerCase() === "string") return null;
  return d;
}

export default function CategoryPromptsPage() {
  const params = useParams();
  const categoryId = parseInt(params.categoryId as string);
  const [category, setCategory] = useState<CategorySM | null>(null);
  const [prompts, setPrompts] = useState<PromptSM[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!categoryId || isNaN(categoryId)) return;
    const load = async () => {
      try {
        setLoading(true);
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
        const categoryService = new CategoryService(categoryClient);
        const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
        const promptService = new PromptService(promptClient);

        const [catResp, promptsResp, countResp] = await Promise.all([
          categoryService.getCategoryByIdForUser(categoryId),
          promptService.getPromptsByCategoryForUser(categoryId, (currentPage - 1) * itemsPerPage, itemsPerPage),
          promptService.getPromptsCountByCategoryForUser(categoryId),
        ]);
        if (catResp.successData) setCategory(catResp.successData);
        if (promptsResp.successData) setPrompts(promptsResp.successData);
        if (countResp.successData) setTotalCount(countResp.successData.value);
      } catch {
        setCategory(null);
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const categoryName = category?.name ?? "Category";
  const categoryDescription = getDisplayDescription(category?.description);

  return (
    <UserLayout>
      <section className="library-hero pb-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/categories" className="text-white-50">Library</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">{categoryName}</li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-white mb-2">{categoryName}</h1>
          <p className="text-white-50 mb-0 small">
            {categoryDescription || "Prompts in this category"}
          </p>
        </div>
      </section>

      <section className="py-5 library-page-bg" style={{ minHeight: "50vh" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p className="mt-3 text-muted small">Loading prompts...</p>
            </div>
          ) : prompts.filter((p) => p.isActive).length > 0 ? (
            <>
              <div className="row g-3 g-md-4 mb-4">
                {prompts.filter((p) => p.isActive).map((p) => (
                  <div key={p.id} className="col-md-6 col-lg-4">
                    <PromptCard prompt={p} showTrendingBadge={true} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="text-muted small">
                    Page {currentPage} of {totalPages}
                  </span>
                  <nav aria-label="Prompts pagination">
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 rounded"
                          onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                          disabled={currentPage <= 1}
                          aria-label="Previous"
                        >
                          <i className="bi bi-chevron-left" />
                        </button>
                      </li>
                      <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                        <button
                          type="button"
                          className="page-link border-0 rounded"
                          onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
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
              <p className="mt-3 text-muted mb-0">No prompts in this category.</p>
              <Link href="/categories" className="btn library-btn-primary btn-sm mt-3">Browse categories</Link>
            </div>
          )}
        </div>
      </section>
    </UserLayout>
  );
}
