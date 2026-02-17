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
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";

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

  const typeLabel = (type: PromptTypeSM) => {
    switch (type) {
      case PromptTypeSM.Text: return "Text";
      case PromptTypeSM.Code: return "Code";
      case PromptTypeSM.Image: return "Image";
      default: return "Prompt";
    }
  };

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
        <div className="container position-relative z-2 text-center text-white">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-fire text-warning me-2"></i>
            Trending
          </h1>
          <p className="lead mb-0" style={{ opacity: 0.95 }}>
            Most popular prompts and featured images
          </p>
        </div>
      </section>

      <section className="py-5" style={{ background: "#f8f9fa", minHeight: "60vh" }}>
        <div className="container">
          <ul className="nav nav-pills justify-content-center gap-2 mb-4">
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill px-4 ${activeTab === "images" ? "active" : ""}`}
                style={activeTab === "images" ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" } : {}}
                onClick={() => setActiveTab("images")}
              >
                <i className="bi bi-image me-2"></i>Trending Images
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill px-4 ${activeTab === "prompts" ? "active" : ""}`}
                style={activeTab === "prompts" ? { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" } : {}}
                onClick={() => setActiveTab("prompts")}
              >
                <i className="bi bi-lightning-charge me-2"></i>Trending Prompts
              </button>
            </li>
          </ul>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
              <p className="mt-3 text-muted">Loading...</p>
            </div>
          ) : activeTab === "images" ? (
            trendingImages.length > 0 ? (
              <div className="row g-4">
                {trendingImages.map((img) => (
                  <div key={img.id} className="col-lg-3 col-md-4 col-sm-6">
                    <Link href={`/view/image/${img.id}`} className="text-decoration-none d-block h-100">
                      <div className="card border-0 shadow-sm h-100 hover-lift overflow-hidden" style={{ borderRadius: "20px" }}>
                        {img.imageBase64 ? (
                          <div style={{ height: "220px", overflow: "hidden", background: "#f0f0f0" }}>
                            <img
                              src={`data:image/png;base64,${img.imageBase64}`}
                              className="w-100 h-100"
                              alt={img.description || "Trending"}
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center text-muted"
                            style={{ height: "220px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "rgba(255,255,255,0.8)" }}
                          >
                            <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                          </div>
                        )}
                        <div className="card-body p-3">
                          <p className="text-muted small mb-0 text-truncate">{img.description || "View prompt"}</p>
                          <span className="badge bg-warning text-dark mt-2"><i className="bi bi-fire me-1"></i>Trending</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-image text-muted" style={{ fontSize: "4rem" }}></i>
                <h5 className="mt-3">No trending images yet</h5>
                <Link href="/categories" className="btn btn-primary rounded-pill mt-3">Browse Categories</Link>
              </div>
            )
          ) : trendingPrompts.length > 0 ? (
            <div className="row g-4">
              {trendingPrompts.map((p) => (
                <div key={p.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100 hover-lift" style={{ borderRadius: "20px" }}>
                    <div className="card-body p-4 d-flex flex-column">
                      <span className="badge bg-primary mb-2">{typeLabel(p.promptType)}</span>
                      <span className="badge bg-warning text-dark mb-2"><i className="bi bi-fire me-1"></i>Trending</span>
                      <h5 className="card-title fw-bold mb-2">{p.title}</h5>
                      <p className="text-muted small flex-grow-1 mb-3">{p.description || "No description"}</p>
                      <p className="small text-muted mb-3" style={{ maxHeight: "4em", overflow: "hidden", textOverflow: "ellipsis" }}>{p.promptText}</p>
                      <div className="mt-auto pt-3 border-top">
                        <Link
                          href={`/prompts/${p.id}`}
                          className="btn btn-primary rounded-pill w-100"
                          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", border: "none" }}
                        >
                          View & Copy <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "prompts" ? (
            <div className="text-center py-5">
              <i className="bi bi-lightning-charge text-muted" style={{ fontSize: "4rem" }}></i>
              <h5 className="mt-3">No trending prompts yet</h5>
              <Link href="/categories" className="btn btn-primary rounded-pill mt-3">Browse Categories</Link>
            </div>
          ) : null}
        </div>
      </section>

      <style jsx global>{`
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2) !important; }
      `}</style>
    </UserLayout>
  );
}
