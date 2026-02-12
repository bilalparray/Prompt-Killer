"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { TrendingPromptService } from "@/services/trending-prompt.service";
import { TrendingPromptClient } from "@/api/trending-prompt.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { TrendingPromptSM } from "@/models/service/app/v1/prompt/trending-prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const trendingPromptSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  promptText: z.string().min(1, "Prompt text is required").min(10, "Prompt text must be at least 10 characters"),
  promptType: z.nativeEnum(PromptTypeSM),
  bestForAITools: z.string().optional(),
  isActive: z.boolean().default(true),
});

type TrendingPromptFormData = z.infer<typeof trendingPromptSchema>;

export default function EditTrendingPromptPage() {
  const router = useRouter();
  const params = useParams();
  const { commonService } = useCommon();
  const promptId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [loadedPrompt, setLoadedPrompt] = useState<TrendingPromptSM | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TrendingPromptFormData>({
    resolver: zodResolver(trendingPromptSchema),
  });

  useEffect(() => {
    if (promptId) {
      loadPrompt();
    }
  }, [promptId]);

  const loadPrompt = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading trending prompt...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const trendingPromptClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
      const trendingPromptService = new TrendingPromptService(trendingPromptClient);

      const response = await trendingPromptService.getTrendingPromptById(promptId);
      if (response.successData) {
        const prompt = response.successData;
        setLoadedPrompt(prompt);
        setValue("title", prompt.title);
        setValue("description", prompt.description || "");
        setValue("promptText", prompt.promptText);
        setValue("promptType", prompt.promptType);
        setValue("bestForAITools", prompt.bestForAITools || "");
        setValue("isActive", prompt.isActive);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load trending prompt",
      });
      router.push("/admin/trending-prompts");
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const onSubmit = async (data: TrendingPromptFormData) => {
    try {
      await commonService.presentLoading("Updating trending prompt...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const trendingPromptClient = new TrendingPromptClient(storageService, storageCache, commonResponseCodeHandler);
      const trendingPromptService = new TrendingPromptService(trendingPromptClient);

      const trendingPrompt = new TrendingPromptSM();
      trendingPrompt.id = promptId;
      trendingPrompt.title = data.title.trim();
      trendingPrompt.description = data.description?.trim() || "";
      trendingPrompt.promptText = data.promptText.trim();
      trendingPrompt.promptType = data.promptType;
      trendingPrompt.bestForAITools = data.bestForAITools?.trim() || "";
      trendingPrompt.isActive = data.isActive;
      trendingPrompt.likesCount = loadedPrompt?.likesCount || 0;

      await trendingPromptService.updateTrendingPrompt(promptId, trendingPrompt);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Trending prompt updated successfully!",
      });
      router.push("/admin/trending-prompts");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update trending prompt",
      });
    }
  };

  const getPromptTypeOptions = () => [
    { value: PromptTypeSM.Text, label: "Text", icon: "bi-file-text", color: "#667eea" },
    { value: PromptTypeSM.Code, label: "Code", icon: "bi-code-slash", color: "#4facfe" },
    { value: PromptTypeSM.Image, label: "Image", icon: "bi-image", color: "#f5576c" },
  ];

  if (loading) {
    return (
      <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
        <AdminLayout>
          <div className="container mt-4 mb-5">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading trending prompt...</p>
            </div>
          </div>
        </AdminLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">
                    <i className="bi bi-fire me-2 text-warning"></i>
                    Edit Trending Prompt
                  </h1>
                  <p className="text-muted mb-0">Update trending AI prompt details</p>
                </div>
                <Link
                  href="/admin/trending-prompts"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Trending Prompts
                </Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
                      {/* Prompt Type */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Prompt Type <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex gap-2">
                          {getPromptTypeOptions().map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              className={`btn flex-fill ${
                                watch("promptType") === option.value
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              } rounded-pill`}
                              onClick={() => setValue("promptType", option.value)}
                              style={{
                                background:
                                  watch("promptType") === option.value
                                    ? `linear-gradient(135deg, ${option.color} 0%, ${option.color}dd 100%)`
                                    : "transparent",
                                border: `2px solid ${option.color}`,
                                color: watch("promptType") === option.value ? "white" : option.color,
                              }}
                            >
                              <i className={`bi ${option.icon} me-2`}></i>
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {errors.promptType && (
                          <div className="text-danger small mt-1">{errors.promptType.message}</div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="col-12">
                        <label htmlFor="title" className="form-label fw-semibold">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                          id="title"
                          {...register("title")}
                          placeholder="e.g., Generate Marketing Copy"
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title.message}</div>
                        )}
                      </div>

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
                          placeholder="Brief description of what this prompt does..."
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "none" }}
                        />
                        <small className="form-text text-muted">
                          Optional description to help users understand this prompt
                        </small>
                      </div>

                      {/* Prompt Text */}
                      <div className="col-12">
                        <label htmlFor="promptText" className="form-label fw-semibold">
                          Prompt Text <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.promptText ? "is-invalid" : ""}`}
                          id="promptText"
                          rows={8}
                          {...register("promptText")}
                          placeholder="Enter the actual prompt text that users will copy and use..."
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "vertical" }}
                        />
                        {errors.promptText && (
                          <div className="invalid-feedback">{errors.promptText.message}</div>
                        )}
                        <small className="form-text text-muted">
                          This is the actual prompt that will be displayed to users
                        </small>
                      </div>

                      {/* Best For AI Tools */}
                      <div className="col-12">
                        <label htmlFor="bestForAITools" className="form-label fw-semibold">
                          Best For AI Tools
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          id="bestForAITools"
                          {...register("bestForAITools")}
                          placeholder="e.g., ChatGPT, Midjourney, DALL-E"
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                        />
                        <small className="form-text text-muted">
                          Comma-separated list of AI tools this prompt works best with
                        </small>
                      </div>

                      {/* Active Toggle */}
                      <div className="col-12">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActive"
                            {...register("isActive")}
                            style={{ width: "3rem", height: "1.5rem", cursor: "pointer" }}
                          />
                          <label className="form-check-label fw-semibold ms-2" htmlFor="isActive">
                            <i className="bi bi-eye me-2 text-success"></i>
                            Active (visible to users)
                          </label>
                        </div>
                        <small className="form-text text-muted d-block mt-1">
                          Inactive prompts will be hidden from public view
                        </small>
                      </div>

                      {/* Likes Count Display */}
                      {loadedPrompt && (
                        <div className="col-12">
                          <div className="alert alert-info mb-0" style={{ borderRadius: "12px" }}>
                            <i className="bi bi-heart me-2"></i>
                            <strong>Likes Count:</strong> {loadedPrompt.likesCount || 0}
                            <small className="d-block text-muted mt-1">
                              This value is preserved and cannot be edited here
                            </small>
                          </div>
                        </div>
                      )}
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Trending Prompt
                          </>
                        )}
                      </button>
                      <Link
                        href="/admin/trending-prompts"
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
