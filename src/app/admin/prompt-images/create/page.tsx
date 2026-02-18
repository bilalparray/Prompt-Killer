"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const SEARCH_DEBOUNCE_MS = 350;

const promptImageSchema = z
  .object({
    imageType: z.enum(["prompt", "trending"]),
    promptId: z.number().optional(),
    trendingPromptId: z.number().optional(),
    description: z.string().optional(),
    imageBase64: z.string().min(1, "Image is required"),
  })
  .refine(
    (data) => {
      if (data.imageType === "prompt") {
        return data.promptId !== undefined && data.promptId !== null;
      } else {
        return data.trendingPromptId !== undefined && data.trendingPromptId !== null;
      }
    },
    {
      message: "Please select a prompt or enter a trending prompt ID",
      path: ["promptId"],
    }
  );

type PromptImageFormData = z.infer<typeof promptImageSchema>;

export default function CreatePromptImagePage() {
  const router = useRouter();
  const { commonService } = useCommon();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [promptSearchQuery, setPromptSearchQuery] = useState("");
  const [promptSearchResults, setPromptSearchResults] = useState<PromptSM[]>([]);
  const [promptSearchLoading, setPromptSearchLoading] = useState(false);
  const [showPromptSearchDropdown, setShowPromptSearchDropdown] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptSM | null>(null);
  const promptSearchRef = useRef<HTMLDivElement>(null);
  const promptSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PromptImageFormData>({
    resolver: zodResolver(promptImageSchema),
    defaultValues: {
      imageType: "prompt",
    },
  });

  const imageType = watch("imageType");

  const runPromptSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPromptSearchResults([]);
      return;
    }
    setPromptSearchLoading(true);
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);
      const resp = await promptService.searchPromptsForAdmin(query);
      setPromptSearchResults(resp.successData ?? []);
      setShowPromptSearchDropdown(true);
    } catch {
      setPromptSearchResults([]);
    } finally {
      setPromptSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (promptSearchDebounceRef.current) clearTimeout(promptSearchDebounceRef.current);
    if (!promptSearchQuery.trim()) {
      setPromptSearchResults([]);
      setShowPromptSearchDropdown(false);
      return;
    }
    promptSearchDebounceRef.current = setTimeout(() => {
      runPromptSearch(promptSearchQuery);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (promptSearchDebounceRef.current) clearTimeout(promptSearchDebounceRef.current);
    };
  }, [promptSearchQuery, runPromptSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (promptSearchRef.current && !promptSearchRef.current.contains(e.target as Node)) {
        setShowPromptSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (imageType !== "prompt") {
      setSelectedPrompt(null);
      setValue("promptId", undefined);
      setPromptSearchQuery("");
      setPromptSearchResults([]);
    }
  }, [imageType, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        commonService.showSweetAlertToast({
          icon: "error",
          title: "File too large",
          text: "Image must be less than 5MB",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        commonService.showSweetAlertToast({
          icon: "error",
          title: "Invalid file type",
          text: "Please upload an image file",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.includes(",") ? base64String.split(",")[1] : base64String;
        setValue("imageBase64", base64);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PromptImageFormData) => {
    try {
      await commonService.presentLoading("Uploading image...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptImageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
      const promptImageService = new PromptImageService(promptImageClient);

      const image = new PromptImageSM();
      image.imageBase64 = data.imageBase64;
      image.description = data.description?.trim() || "";
      image.isActive = true;

      if (data.imageType === "prompt" && data.promptId) {
        image.promptId = data.promptId;
        image.trendingPromptId = null;
        await promptImageService.createPromptImage(data.promptId, image);
      } else if (data.imageType === "trending" && data.trendingPromptId) {
        image.promptId = null;
        image.trendingPromptId = data.trendingPromptId;
        await promptImageService.createTrendingPromptImage(data.trendingPromptId, image);
      } else {
        throw new Error("Please select a prompt or trending prompt");
      }

      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Image uploaded successfully!",
      });
      router.push("/admin/prompt-images");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to upload image",
      });
    }
  };

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">Upload Prompt Image</h1>
                  <p className="text-muted mb-0">Add an image for a prompt or trending prompt</p>
                </div>
                <Link
                  href="/admin/prompt-images"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Images
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
                      {/* Image Type Selection */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Image Type <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className={`btn flex-fill ${
                              imageType === "prompt" ? "btn-primary" : "btn-outline-primary"
                            } rounded-pill`}
                            onClick={() => {
                              setValue("imageType", "prompt");
                              setValue("trendingPromptId", undefined);
                            }}
                            style={{
                              background:
                                imageType === "prompt"
                                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                  : "transparent",
                              border: "2px solid #667eea",
                              color: imageType === "prompt" ? "white" : "#667eea",
                            }}
                          >
                            <i className="bi bi-lightning-charge me-2"></i>
                            Prompt Image
                          </button>
                          <button
                            type="button"
                            className={`btn flex-fill ${
                              imageType === "trending" ? "btn-primary" : "btn-outline-primary"
                            } rounded-pill`}
                            onClick={() => {
                              setValue("imageType", "trending");
                              setValue("promptId", undefined);
                            }}
                            style={{
                              background:
                                imageType === "trending"
                                  ? "linear-gradient(135deg, #f5576c 0%, #fa709a 100%)"
                                  : "transparent",
                              border: "2px solid #f5576c",
                              color: imageType === "trending" ? "white" : "#f5576c",
                            }}
                          >
                            <i className="bi bi-fire me-2"></i>
                            Trending Prompt Image
                          </button>
                        </div>
                      </div>

                      {/* Prompt Selection (search API) */}
                      {imageType === "prompt" && (
                        <div className="col-12">
                          <label className="form-label fw-semibold">
                            Select Prompt <span className="text-danger">*</span>
                          </label>
                          <p className="small text-muted mb-2">Search for a prompt to attach this image to (e.g. how to generate image).</p>
                          {selectedPrompt ? (
                            <div className="d-flex align-items-center gap-2 p-3 rounded border bg-light">
                              <span className="fw-medium flex-grow-1">{selectedPrompt.title}</span>
                              <span className="badge bg-secondary">ID {selectedPrompt.id}</span>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => {
                                  setSelectedPrompt(null);
                                  setValue("promptId", undefined);
                                  setPromptSearchQuery("");
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          ) : (
                            <div className="position-relative" ref={promptSearchRef}>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-white">
                                  <i className="bi bi-search text-muted" />
                                </span>
                                <input
                                  type="text"
                                  className={`form-control ${errors.promptId ? "is-invalid" : ""}`}
                                  placeholder="Search prompts (e.g. how to generate image)..."
                                  value={promptSearchQuery}
                                  onChange={(e) => setPromptSearchQuery(e.target.value)}
                                  onFocus={() => promptSearchResults.length > 0 && setShowPromptSearchDropdown(true)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setShowPromptSearchDropdown(false);
                                      (e.target as HTMLInputElement).blur();
                                    }
                                  }}
                                  style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                                  aria-label="Search prompts"
                                  aria-expanded={showPromptSearchDropdown}
                                  aria-controls="create-prompt-search-results"
                                />
                              </div>
                              {showPromptSearchDropdown && (promptSearchQuery.trim() || promptSearchResults.length > 0) && (
                                <div
                                  id="create-prompt-search-results"
                                  role="listbox"
                                  className="position-absolute start-0 end-0 top-100 mt-1 rounded shadow border overflow-hidden z-3 bg-white"
                                  style={{ maxHeight: "260px", overflowY: "auto" }}
                                  aria-label="Search results"
                                >
                                  {promptSearchLoading ? (
                                    <div className="p-3 text-center text-muted small" role="status" aria-live="polite">
                                      <span className="spinner-border spinner-border-sm me-2" aria-hidden /> Searching...
                                    </div>
                                  ) : promptSearchResults.length === 0 ? (
                                    <div className="p-3 text-muted small" role="status" aria-live="polite">
                                      {promptSearchQuery.trim() ? "No prompts found." : "Type to search."}
                                    </div>
                                  ) : (
                                    <ul className="list-group list-group-flush" role="group" aria-label={`${promptSearchResults.length} prompt${promptSearchResults.length === 1 ? "" : "s"} found`}>
                                      {promptSearchResults.map((p) => (
                                        <li key={p.id}>
                                          <button
                                            type="button"
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center w-100 border-0 text-start"
                                            onClick={() => {
                                              setSelectedPrompt(p);
                                              setValue("promptId", p.id);
                                              setShowPromptSearchDropdown(false);
                                              setPromptSearchQuery("");
                                              setPromptSearchResults([]);
                                            }}
                                          >
                                            <span className="fw-medium text-truncate me-2">{p.title}</span>
                                            <span className="badge bg-secondary flex-shrink-0">ID {p.id}</span>
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {errors.promptId && (
                            <div className="invalid-feedback d-block">{errors.promptId.message}</div>
                          )}
                        </div>
                      )}

                      {/* Trending Prompt ID */}
                      {imageType === "trending" && (
                        <div className="col-12">
                          <label htmlFor="trendingPromptId" className="form-label fw-semibold">
                            Trending Prompt ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            className={`form-control form-control-lg ${errors.trendingPromptId ? "is-invalid" : ""}`}
                            id="trendingPromptId"
                            {...register("trendingPromptId", { valueAsNumber: true })}
                            placeholder="Enter trending prompt ID"
                            style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                          />
                          {errors.trendingPromptId && (
                            <div className="invalid-feedback">{errors.trendingPromptId.message}</div>
                          )}
                          <small className="form-text text-muted">
                            Enter the ID of the trending prompt this image belongs to
                          </small>
                        </div>
                      )}

                      {/* Description */}
                      <div className="col-12">
                        <label htmlFor="description" className="form-label fw-semibold">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          rows={3}
                          {...register("description")}
                          placeholder="Describe this image..."
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "none" }}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="col-12">
                        <label htmlFor="image" className="form-label fw-semibold">
                          Image <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className={`form-control form-control-lg ${errors.imageBase64 ? "is-invalid" : ""}`}
                          id="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                        />
                        {errors.imageBase64 && (
                          <div className="invalid-feedback">{errors.imageBase64.message}</div>
                        )}
                        <small className="form-text text-muted">
                          Upload an image (max 5MB, recommended formats: JPG, PNG, WebP)
                        </small>
                        {imagePreview && (
                          <div className="mt-3">
                            <div className="position-relative d-inline-block">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="img-thumbnail rounded"
                                style={{ maxWidth: "400px", maxHeight: "400px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
                                onClick={() => {
                                  setImagePreview(null);
                                  setValue("imageBase64", "");
                                }}
                                style={{ width: "30px", height: "30px", padding: 0 }}
                              >
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="d-flex gap-3 mt-4 pt-3 border-top">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill px-5 flex-fill"
                        disabled={isSubmitting}
                        style={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-upload me-2"></i>
                            Upload Image
                          </>
                        )}
                      </button>
                      <Link
                        href="/admin/prompt-images"
                        className="btn btn-outline-secondary btn-lg rounded-pill px-5"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}
