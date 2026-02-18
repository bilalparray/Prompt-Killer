"use client";

import React, { useState, useId } from "react";

type Props = {
  promptText: string;
  label?: string;
};

export function PromptBlock({ promptText, label = "Prompt" }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const id = useId();
  const preId = `prompt-block-${id}`;

  const copy = async () => {
    setCopyError(false);
    if (!promptText?.trim()) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const isEmpty = !promptText?.trim();

  return (
    <div className="library-prompt-block">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <label id={`${preId}-label`} className="form-label fw-semibold text-muted small text-uppercase mb-0">
          {label}
        </label>
        {!isEmpty && (
          <button
            type="button"
            className="btn btn-sm library-btn-outline"
            onClick={copy}
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
            aria-live="polite"
          >
            <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"} me-1`} aria-hidden />
            {copyError ? "Copy failed" : copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <pre
        id={preId}
        className="library-prompt-pre p-3 rounded border bg-light"
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontSize: "0.9rem",
          maxHeight: "400px",
          overflowY: "auto",
        }}
        aria-labelledby={`${preId}-label`}
        role="region"
      >
        {isEmpty ? (
          <span className="text-muted fst-italic">No prompt text.</span>
        ) : (
          promptText
        )}
      </pre>
      {copyError && (
        <p className="small text-danger mt-2 mb-0" role="alert">
          Copy failed. Select the text above and copy manually.
        </p>
      )}
    </div>
  );
}
