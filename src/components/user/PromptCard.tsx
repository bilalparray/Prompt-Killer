"use client";

import React from "react";
import Link from "next/link";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";

function typeLabel(type: PromptTypeSM): string {
  switch (type) {
    case PromptTypeSM.Text: return "Text";
    case PromptTypeSM.Code: return "Code";
    case PromptTypeSM.Image: return "Image";
    default: return "Prompt";
  }
}

function excerpt(text: string, maxLen: number): string {
  if (!text?.trim()) return "";
  const t = text.trim();
  return t.length <= maxLen ? t : t.slice(0, maxLen) + "…";
}

export function PromptCard({ prompt, showTrendingBadge = true }: { prompt: PromptSM; showTrendingBadge?: boolean }) {
  return (
    <div className="library-prompt-card card border-0 h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-wrap gap-2 mb-2">
          <span className="badge library-badge-type">{typeLabel(prompt.promptType)}</span>
          {showTrendingBadge && prompt.isTrending && (
            <span className="badge library-badge-trending">
              <i className="bi bi-fire me-1" /> Trending
            </span>
          )}
        </div>
        <h3 className="h6 fw-bold mb-2 library-card-title">
          <Link href={`/prompts/${prompt.id}`} className="text-decoration-none text-body">
            {prompt.title}
          </Link>
        </h3>
        {prompt.description && (
          <p className="text-muted small mb-2 flex-grow-1" style={{ minHeight: "2.5em" }}>
            {prompt.description}
          </p>
        )}
        <p className="small text-secondary mb-3 library-prompt-preview">
          {excerpt(prompt.promptText, 120)}
        </p>
        <div className="mt-auto pt-2 border-top">
          <Link
            href={`/prompts/${prompt.id}`}
            className="btn btn-sm library-btn-primary"
          >
            View & copy <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
