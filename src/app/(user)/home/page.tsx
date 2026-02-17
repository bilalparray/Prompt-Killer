"use client";

import React, { useState, useEffect } from "react";
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

export default function HomePage() {
  const [trendingImages, setTrendingImages] = useState<PromptImageSM[]>([]);
  const [trendingPrompts, setTrendingPrompts] = useState<PromptSM[]>([]);
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loading, setLoading] = useState(true);

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
