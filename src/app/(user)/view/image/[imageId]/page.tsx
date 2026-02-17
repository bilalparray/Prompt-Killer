"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { TrendingPromptService } from "@/services/trending-prompt.service";
import { TrendingPromptClient } from "@/api/trending-prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { TrendingPromptSM } from "@/models/service/app/v1/prompt/trending-prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import { PromptBlock } from "@/components/user/PromptBlock";

function typeLabel(type: PromptTypeSM): string {
  switch (type) {
    case PromptTypeSM.Text: return "Text";
    case PromptTypeSM.Code: return "Code";
    case PromptTypeSM.Image: return "Image";
    default: return "Prompt";
  }
}

export default function ViewImagePromptPage() {
  const params = useParams();
  const imageId = parseInt(params.imageId as string);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<{ imageBase64: string; description: string } | null>(null);
  const [prompt, setPrompt] = useState<PromptSM | null>(null);
  const [trendingPrompt, setTrendingPrompt] = useState<TrendingPromptSM | null>(null);

  useEffect(() => {
    if (!imageId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);

        const imageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
        const imageService = new PromptImageService(imageClient);
        const imageResp = await imageService.getPromptImageByIdForUser(imageId);
        if (imageResp.isError || !imageResp.successData) {
          setError("Image not found.");
          setLoading(false);
          return;
        }
        const img = imageResp.successData;
        setImage({
          imageBase64: img.imageBase64 || "",
          description: img.description || "",
        });

        if (img.promptId) {
          const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
          const promptService = new PromptService(promptClient);
          const promptResp = await promptService.getPromptByIdForUser(img.promptId);
          if (promptResp.successData) setPrompt(promptResp.successData);
          else setError("Prompt not found.");
        } else if (img.trendingPromptId) {
          const trendingClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
          const trendingService = new TrendingPromptService(trendingClient);
          const trendingResp = await trendingService.getTrendingPromptByIdForUser(img.trendingPromptId);
          if (trendingResp.successData) setTrendingPrompt(trendingResp.successData);
          else setError("Trending prompt not found.");
        } else {
          setError("No prompt linked to this image.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [imageId]);

  const displayPrompt = prompt || trendingPrompt;
  const isTrending = !!trendingPrompt;

  if (loading) {
    return (
      <UserLayout>
        <div className="library-page-bg min-vh-100 py-5">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p className="mt-3 text-muted small">Loading...</p>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (error || !displayPrompt) {
    return (
      <UserLayout>
        <div className="library-page-bg min-vh-100 py-5">
          <div className="container">
            <div className="text-center py-5">
              <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: "3rem" }} />
              <h2 className="h5 mt-3">{error || "Prompt not found"}</h2>
              <Link href="/home" className="btn library-btn-primary btn-sm mt-3">Back to home</Link>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="library-page-bg min-vh-100 py-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home">Home</Link></li>
              <li className="breadcrumb-item"><Link href="/trending">Trending</Link></li>
              <li className="breadcrumb-item active" aria-current="page">View prompt</li>
            </ol>
          </nav>

          <div className="row g-4">
            <div className="col-lg-5">
              {image?.imageBase64 && (
                <div className="card library-content-card border-0 overflow-hidden">
                  <img
                    src={`data:image/png;base64,${image.imageBase64}`}
                    className="w-100"
                    alt={image.description || "Prompt"}
                    style={{ objectFit: "cover", maxHeight: "400px" }}
                  />
                  {image.description && (
                    <div className="card-body py-2">
                      <p className="text-muted small mb-0">{image.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-lg-7">
              <div className="card library-content-card border-0 h-100">
                <div className="card-body p-4 p-lg-5">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge library-badge-type">{typeLabel(displayPrompt.promptType)}</span>
                    {isTrending && (
                      <span className="badge library-badge-trending">
                        <i className="bi bi-fire me-1" /> Trending
                      </span>
                    )}
                    {"likesCount" in displayPrompt && (displayPrompt as PromptSM).likesCount > 0 && (
                      <span className="badge bg-secondary">
                        <i className="bi bi-heart me-1" />{(displayPrompt as PromptSM).likesCount}
                      </span>
                    )}
                  </div>
                  <h1 className="h3 fw-bold mb-3">{displayPrompt.title}</h1>
                  {displayPrompt.description && (
                    <p className="text-muted mb-4">{displayPrompt.description}</p>
                  )}
                  <PromptBlock promptText={displayPrompt.promptText} label="Prompt text" />
                  {displayPrompt.bestForAITools && (
                    <p className="text-muted small mt-3 mb-0"><strong>Best for:</strong> {displayPrompt.bestForAITools}</p>
                  )}
                  <hr className="my-4" />
                  <Link href="/home" className="btn library-btn-outline btn-sm me-2">Back to home</Link>
                  <Link href="/trending" className="btn library-btn-primary btn-sm">More trending</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
