"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { PromptCard } from "@/components/user/PromptCard";
import { TrendingImageCard } from "@/components/user/TrendingImageCard";

export default function TrendingPage() {
  const [trendingPrompts, setTrendingPrompts] = useState<PromptSM[]>([]);
  const [trendingImages, setTrendingImages] = useState<PromptImageSM[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"prompts" | "images">("prompts");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);

        const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
        const promptService = new PromptService(promptClient);
        const imageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
        const imageService = new PromptImageService(imageClient);

        const [promptsResp, imagesResp] = await Promise.all([
          promptService.getPromptsForUser(0, 500),
          imageService.getTrendingPromptImagesForUser(0, 24),
        ]);
        if (promptsResp.successData) {
          setTrendingPrompts(promptsResp.successData.filter((p) => p.isTrending && p.isActive));
        }
        if (imagesResp.successData) setTrendingImages(imagesResp.successData);
      } catch {
        setTrendingPrompts([]);
        setTrendingImages([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <UserLayout>
      <section className="library-hero pb-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">Trending</li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-white mb-2">
            <i className="bi bi-fire text-warning me-2" />
            Trending
          </h1>
          <p className="text-white-50 mb-0 small">Popular prompts and featured images</p>
        </div>
      </section>

      <section className="py-5 library-page-bg" style={{ minHeight: "50vh" }}>
        <div className="container">
          <ul className="nav nav-pills gap-2 mb-4">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-3 py-2 ${activeTab === "prompts" ? "active" : ""}`}
                style={
                  activeTab === "prompts"
                    ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", color: "#fff" }
                    : { background: "#fff", color: "#4a5568" }
                }
                onClick={() => setActiveTab("prompts")}
              >
                <i className="bi bi-lightning-charge me-2" /> Prompts
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link rounded-pill px-3 py-2 ${activeTab === "images" ? "active" : ""}`}
                style={
                  activeTab === "images"
                    ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none", color: "#fff" }
                    : { background: "#fff", color: "#4a5568" }
                }
                onClick={() => setActiveTab("images")}
              >
                <i className="bi bi-image me-2" /> Images
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p className="mt-3 text-muted small">Loading...</p>
            </div>
          ) : activeTab === "images" ? (
            trendingImages.length > 0 ? (
              <div className="row g-3 g-md-4">
                {trendingImages.map((img) => (
                  <div key={img.id} className="col-6 col-md-4 col-lg-3">
                    <TrendingImageCard image={img} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-image text-muted" style={{ fontSize: "3rem" }} />
                <p className="mt-3 text-muted mb-0">No trending images yet.</p>
                <Link href="/categories" className="btn library-btn-primary btn-sm mt-3">Browse library</Link>
              </div>
            )
          ) : trendingPrompts.length > 0 ? (
            <div className="row g-3 g-md-4">
              {trendingPrompts.map((p) => (
                <div key={p.id} className="col-md-6 col-lg-4">
                  <PromptCard prompt={p} showTrendingBadge={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-lightning-charge text-muted" style={{ fontSize: "3rem" }} />
              <p className="mt-3 text-muted mb-0">No trending prompts yet.</p>
              <Link href="/categories" className="btn library-btn-primary btn-sm mt-3">Browse library</Link>
            </div>
          )}
        </div>
      </section>
    </UserLayout>
  );
}
