"use client";

import React from "react";
import Link from "next/link";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";

export function TrendingImageCard({ image }: { image: PromptImageSM }) {
  return (
    <Link
      href={`/view/image/${image.id}`}
      className="text-decoration-none d-block h-100 library-image-card"
    >
      <div className="card border-0 h-100 overflow-hidden">
        {image.imageBase64 ? (
          <div className="library-image-wrap">
            <img
              src={`data:image/png;base64,${image.imageBase64}`}
              className="w-100 h-100"
              alt={image.description || "Trending prompt"}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="library-image-placeholder d-flex align-items-center justify-content-center">
            <i className="bi bi-image text-white" style={{ fontSize: "2.5rem" }} />
          </div>
        )}
        <div className="card-body p-3">
          <p className="text-muted small mb-1 text-truncate">
            {image.description || "View prompt"}
          </p>
          <span className="badge library-badge-trending">
            <i className="bi bi-fire me-1" /> Trending
          </span>
        </div>
      </div>
    </Link>
  );
}
