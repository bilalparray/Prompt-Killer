"use client";

import React from "react";
import Link from "next/link";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";

/** Treat empty or API placeholder values as no description. */
function getDisplayDescription(description: string | undefined): string | null {
  const d = description?.trim();
  if (!d) return null;
  if (d.toLowerCase() === "string") return null; // API placeholder
  return d;
}

export function CategoryCard({ category }: { category: CategorySM }) {
  const description = getDisplayDescription(category.description);

  return (
    <Link
      href={`/categories/${category.id}`}
      className="text-decoration-none d-block h-100 library-category-card"
    >
      <div className="card border-0 h-100 library-category-card-inner">
        <div className="card-body d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <span
              className="library-category-icon rounded-circle d-flex align-items-center justify-content-center me-3"
              aria-hidden
            >
              <i className="bi bi-folder2-open text-white" />
            </span>
            <h3 className="h5 fw-bold mb-0 text-body">{category.name}</h3>
          </div>
          {description && (
            <p className="text-muted small mb-0 flex-grow-1">
              {description}
            </p>
          )}
          <span className="mt-3 text-primary small fw-semibold">
            Browse prompts <i className="bi bi-chevron-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
