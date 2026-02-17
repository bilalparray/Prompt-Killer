"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
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

export default function ViewPromptPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const [prompt, setPrompt] = useState<PromptSM | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
        const promptService = new PromptService(promptClient);
        const resp = await promptService.getPromptByIdForUser(id);
        if (resp.successData) setPrompt(resp.successData);
      } catch {
        setPrompt(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

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

  if (!prompt) {
    return (
      <UserLayout>
        <div className="library-page-bg min-vh-100 py-5">
          <div className="container">
            <div className="text-center py-5">
              <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: "3rem" }} />
              <h2 className="h5 mt-3">Prompt not found</h2>
              <Link href="/categories" className="btn library-btn-primary btn-sm mt-3">Browse library</Link>
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
              <li className="breadcrumb-item"><Link href="/categories">Library</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{prompt.title}</li>
            </ol>
          </nav>

          <div className="card library-content-card border-0">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge library-badge-type">{typeLabel(prompt.promptType)}</span>
                {prompt.isTrending && (
                  <span className="badge library-badge-trending">
                    <i className="bi bi-fire me-1" /> Trending
                  </span>
                )}
                {prompt.likesCount > 0 && (
                  <span className="badge bg-secondary"><i className="bi bi-heart me-1" />{prompt.likesCount}</span>
                )}
              </div>
              <h1 className="h3 fw-bold mb-3">{prompt.title}</h1>
              {prompt.description && <p className="text-muted mb-4">{prompt.description}</p>}
              <PromptBlock promptText={prompt.promptText} label="Prompt text" />
              {prompt.bestForAITools && (
                <p className="text-muted small mt-3 mb-0"><strong>Best for:</strong> {prompt.bestForAITools}</p>
              )}
              <hr className="my-4" />
              <Link href="/categories" className="btn library-btn-outline btn-sm">
                <i className="bi bi-arrow-left me-2" /> Back to library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
