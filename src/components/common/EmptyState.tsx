"use client";

import React from "react";
import Link from "next/link";

export interface EmptyStateProps {
  /** Bootstrap icon class (e.g. "bi-inbox", "bi-folder2-open") */
  icon: string;
  /** Short heading */
  title: string;
  /** Optional longer description */
  description?: string;
  /** Primary CTA: { label, href } */
  primaryAction?: { label: string; href: string };
  /** Optional secondary CTA */
  secondaryAction?: { label: string; href: string };
  /** Optional class for the container */
  className?: string;
  /** Icon size in rem */
  iconSize?: number;
}

/**
 * Consistent empty state: icon + title + description + primary/secondary CTAs.
 * Use on list pages when there are no items. Accessible: region + live announcement.
 */
export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
  iconSize = 3,
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-5 ${className}`}
      role="region"
      aria-label={title}
      aria-live="polite"
    >
      <i
        className={`bi ${icon} text-muted`}
        style={{ fontSize: `${iconSize}rem` }}
        aria-hidden
      />
      <h2 className="h5 mt-3 mb-2 text-muted fw-normal">{title}</h2>
      {description && <p className="text-muted mb-4 mb-md-3">{description}</p>}
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="btn library-btn-primary rounded-pill px-4"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="btn library-btn-outline btn-sm rounded-pill px-3"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
