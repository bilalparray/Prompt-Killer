"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { CategoryCard } from "@/components/user/CategoryCard";
import { PromptCard } from "@/components/user/PromptCard";
import { TrendingImageCard } from "@/components/user/TrendingImageCard";

const SEARCH_DEBOUNCE_MS = 350;

export default function HomePage() {
  const [trendingImages, setTrendingImages] = useState<PromptImageSM[]>([]);
  const [trendingPrompts, setTrendingPrompts] = useState<PromptSM[]>([]);
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);
  const [promptSearchQuery, setPromptSearchQuery] = useState("");
  const [promptSearchResults, setPromptSearchResults] = useState<PromptSM[]>([]);
  const [promptSearchLoading, setPromptSearchLoading] = useState(false);
  const [showPromptSearchDropdown, setShowPromptSearchDropdown] = useState(false);
  const promptSearchRef = useRef<HTMLDivElement>(null);
  const promptSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);

        const imageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
        const imageService = new PromptImageService(imageClient);
        const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
        const categoryService = new CategoryService(categoryClient);
        const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
        const promptService = new PromptService(promptClient);

        const [imagesResp, categoriesResp, promptsResp] = await Promise.all([
          imageService.getTrendingPromptImagesForUser(0, 8),
          categoryService.getCategoriesForUser(0, 8),
          promptService.getPromptsForUser(0, 100),
        ]);

        if (imagesResp.successData) setTrendingImages(imagesResp.successData);
        if (categoriesResp.successData) setCategories(categoriesResp.successData);
        if (promptsResp.successData) {
          setTrendingPrompts(
            promptsResp.successData.filter((p) => p.isTrending && p.isActive).slice(0, 6)
          );
        }
      } catch {
        setTrendingImages([]);
        setTrendingPrompts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const runPromptSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPromptSearchResults([]);
      return;
    }
    setPromptSearchLoading(true);
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);
      const resp = await promptService.searchPromptsForUser(query);
      setPromptSearchResults(resp.successData ?? []);
      setShowPromptSearchDropdown(true);
    } catch {
      setPromptSearchResults([]);
    } finally {
      setPromptSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (promptSearchDebounceRef.current) clearTimeout(promptSearchDebounceRef.current);
    if (!promptSearchQuery.trim()) {
      setPromptSearchResults([]);
      setShowPromptSearchDropdown(false);
      return;
    }
    promptSearchDebounceRef.current = setTimeout(() => {
      runPromptSearch(promptSearchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (promptSearchDebounceRef.current) clearTimeout(promptSearchDebounceRef.current);
    };
  }, [promptSearchQuery, runPromptSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (promptSearchRef.current && !promptSearchRef.current.contains(e.target as Node)) {
        setShowPromptSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <UserLayout>
      {/* Library hero */}
      <section className="library-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold mb-3">
                Prompt Library
              </h1>
              <p className="lead mb-4">
                Browse and copy curated AI prompts. No sign-up. Find prompts by category or see what’s trending.
              </p>
              <Link
                href="/categories"
                className="btn btn-light btn-lg rounded-pill px-4 fw-semibold"
              >
                <i className="bi bi-folder2-open me-2" />
                Browse by category
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="library-page-bg">
        {/* Search prompts */}
        <section className="py-5">
          <div className="container">
            <h2 className="library-section-title d-flex align-items-center">
              <i className="bi bi-search me-2 text-primary" />
              Search prompts
            </h2>
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 position-relative" ref={promptSearchRef}>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-white border-secondary">
                    <i className="bi bi-search text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-secondary"
                    placeholder="e.g. how to generate image..."
                    value={promptSearchQuery}
                    onChange={(e) => setPromptSearchQuery(e.target.value)}
                    onFocus={() => promptSearchResults.length > 0 && setShowPromptSearchDropdown(true)}
                    aria-label="Search prompts"
                  />
                </div>
                {showPromptSearchDropdown && (promptSearchQuery.trim() || promptSearchResults.length > 0) && (
                  <div
                    className="position-absolute start-0 end-0 mt-1 rounded shadow-lg border-0 overflow-hidden z-3 bg-white"
                    style={{ maxWidth: "100%", width: "inherit", maxHeight: "280px", overflowY: "auto" }}
                  >
                    {promptSearchLoading ? (
                      <div className="p-3 text-center text-muted small">
                        <span className="spinner-border spinner-border-sm me-2" /> Searching...
                      </div>
                    ) : promptSearchResults.length === 0 ? (
                      <div className="p-3 text-muted small">
                        {promptSearchQuery.trim() ? "No prompts found." : "Type to search."}
                      </div>
                    ) : (
                      <ul className="list-group list-group-flush">
                        {promptSearchResults.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/prompts/${p.id}`}
                              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-decoration-none"
                              onClick={() => {
                                setShowPromptSearchDropdown(false);
                                setPromptSearchQuery("");
                              }}
                            >
                              <span className="fw-medium text-truncate me-2">{p.title}</span>
                              <span className="badge bg-secondary flex-shrink-0">ID {p.id}</span>
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

        {/* Browse by category */}
        <section className="py-5">
          <div className="container">
            <h2 className="library-section-title d-flex align-items-center">
              <i className="bi bi-grid-3x3-gap me-2 text-primary" />
              Browse by category
            </h2>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
                <p className="mt-3 text-muted small">Loading…</p>
              </div>
            ) : categories.length > 0 ? (
              <div className="row g-3 g-md-4">
                {categories.filter((c) => c.isActive).map((cat) => (
                  <div key={cat.id} className="col-md-6 col-lg-4 col-xl-3">
                    <CategoryCard category={cat} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">No categories yet.</p>
            )}
            {categories.length > 0 && (
              <div className="mt-4">
                <Link href="/categories" className="btn library-btn-outline btn-sm">
                  View all categories <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Trending now */}
        <section className="py-5 border-top bg-white">
          <div className="container">
            <h2 className="library-section-title d-flex align-items-center">
              <i className="bi bi-fire me-2 text-warning" />
              Trending now
            </h2>

            {trendingImages.length > 0 && (
              <>
                <p className="text-muted small mb-3">Featured images — click to view and copy the prompt</p>
                <div className="row g-3 mb-4">
                  {trendingImages.map((img) => (
                    <div key={img.id} className="col-6 col-md-4 col-lg-3">
                      <TrendingImageCard image={img} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {trendingPrompts.length > 0 && (
              <>
                <p className="text-muted small mb-3">Trending prompts</p>
                <div className="row g-3">
                  {trendingPrompts.map((p) => (
                    <div key={p.id} className="col-md-6 col-lg-4">
                      <PromptCard prompt={p} showTrendingBadge={true} />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Link href="/trending" className="btn library-btn-outline btn-sm">
                    All trending <i className="bi bi-arrow-right ms-1" />
                  </Link>
                </div>
              </>
            )}

            {!loading && trendingImages.length === 0 && trendingPrompts.length === 0 && (
              <p className="text-muted mb-0">No trending content yet. Check back later or browse categories.</p>
            )}
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
