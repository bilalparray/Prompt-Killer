"use client";

import React, { useState } from "react";

type Props = {
  promptText: string;
  label?: string;
};

export function PromptBlock({ promptText, label = "Prompt" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="library-prompt-block">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label className="form-label fw-semibold text-muted small text-uppercase mb-0">
          {label}
        </label>
        <button
          type="button"
          className="btn btn-sm library-btn-outline"
          onClick={copy}
        >
          <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"} me-1`} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="library-prompt-pre p-3 rounded border bg-light"
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "0.9rem",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {promptText}
      </pre>
    </div>
  );
}
