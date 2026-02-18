"use client";

import React from "react";
import { useCommon } from "@/hooks/useCommon";

export function Spinner() {
  const { loaderInfo } = useCommon();
  const { showLoader, message } = loaderInfo;

  if (!showLoader) return null;

  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && <p className="mt-2">{message}</p>}
      </div>
    </div>
  );
}
