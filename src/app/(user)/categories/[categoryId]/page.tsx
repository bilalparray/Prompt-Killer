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
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";

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
    if (!categoryId) return;
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
  const typeLabel = (type: PromptTypeSM) => {
    switch (type) {
      case PromptTypeSM.Text: return "Text";
      case PromptTypeSM.Code: return "Code";
      case PromptTypeSM.Image: return "Image";
      default: return "Prompt";
    }
  };

  const categoryName = category?.name ?? "Category";

  return (
    <UserLayout>
      <section
        className="position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "120px",
          paddingBottom: "60px",
        }}
      >
        <div className="container position-relative z-2">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/categories" className="text-white-50">Categories</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">{categoryName}</li>
            </ol>
          </nav>
          <h1 className="display-4 fw-bold text-white mb-2">{categoryName}</h1>
          <p className="lead text-white mb-0" style={{ opacity: 0.95 }}>
            {category?.description || "Prompts in this category"}
          </p>
        </div>
      </section>

      <section className="py-5" style={{ background: "#f8f9fa", minHeight: "60vh" }}>
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-3 text-muted">Loading prompts...</p>
            </div>
          ) : prompts.length > 0 ? (
            <>
              <div className="row g-4 mb-5">
                {prompts.filter((p) => p.isActive).map((p) => (
                  <div key={p.id} className="col-lg-4 col-md-6">
                    <div className="card border-0 shadow-sm h-100 hover-lift" style={{ borderRadius: "20px" }}>
                      <div className="card-body p-4 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="badge bg-primary">{typeLabel(p.promptType)}</span>
                          {p.isTrending && (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-fire me-1"></i>Trending
                            </span>
                          )}
                        </div>
                        <h5 className="card-title fw-bold mb-2">{p.title}</h5>
                        <p className="text-muted small flex-grow-1 mb-3">
                          {p.description || "No description"}
                        </p>
                        <p className="small text-muted mb-3" style={{ maxHeight: "4em", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.promptText}
                        </p>
                        <div className="mt-auto pt-3 border-top">
                          <Link
                            href={`/prompts/${p.id}`}
                            className="btn btn-primary rounded-pill w-100"
                            style={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                            }}
                          >
                            View & Copy <i className="bi bi-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <span className="align-self-center text-muted">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: "4rem" }}></i>
              <h5 className="mt-3">No prompts in this category</h5>
              <Link href="/categories" className="btn btn-primary rounded-pill mt-3">Browse Categories</Link>
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2) !important; }
      `}</style>
    </UserLayout>
  );
}
