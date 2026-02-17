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

  const typeLabel = (type: PromptTypeSM) => {
    switch (type) {
      case PromptTypeSM.Text: return "Text";
      case PromptTypeSM.Code: return "Code";
      case PromptTypeSM.Image: return "Image";
      default: return "Prompt";
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }} />
            <p className="mt-3 text-muted">Loading...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  if (!prompt) {
    return (
      <UserLayout>
        <div className="container py-5">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-circle text-muted" style={{ fontSize: "4rem" }}></i>
            <h2 className="mt-3">Prompt not found</h2>
            <Link href="/categories" className="btn btn-primary rounded-pill mt-3">Browse Categories</Link>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="container py-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/home">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/categories">Categories</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{prompt.title}</li>
          </ol>
        </nav>

        <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-primary">{typeLabel(prompt.promptType)}</span>
              {prompt.isTrending && (
                <span className="badge bg-warning text-dark">
                  <i className="bi bi-fire me-1"></i>Trending
                </span>
              )}
              {prompt.likesCount > 0 && (
                <span className="badge bg-info"><i className="bi bi-heart me-1"></i>{prompt.likesCount}</span>
              )}
            </div>
            <h1 className="h2 fw-bold mb-3">{prompt.title}</h1>
            {prompt.description && <p className="text-muted mb-4">{prompt.description}</p>}
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted small">PROMPT TEXT</label>
              <pre
                className="p-4 rounded-3 bg-light border"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.95rem", maxHeight: "400px", overflowY: "auto" }}
              >
                {prompt.promptText}
              </pre>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm mt-2"
                onClick={() => navigator.clipboard.writeText(prompt.promptText)}
              >
                <i className="bi bi-clipboard me-1"></i>Copy prompt
              </button>
            </div>
            {prompt.bestForAITools && (
              <p className="text-muted small mb-0"><strong>Best for:</strong> {prompt.bestForAITools}</p>
            )}
            <hr className="my-4" />
            <Link href="/categories" className="btn btn-primary rounded-pill">
              <i className="bi bi-arrow-left me-2"></i>Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
