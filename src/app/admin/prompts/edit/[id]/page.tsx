"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { PromptService } from "@/services/prompt.service";
import { PromptClient } from "@/api/prompt.client";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptSM } from "@/models/service/app/v1/prompt/prompt-s-m";
import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const promptSchema = z.object({
  categoryId: z.number().min(1, "Category is required"),
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  promptText: z.string().min(1, "Prompt text is required").min(10, "Prompt text must be at least 10 characters"),
  promptType: z.nativeEnum(PromptTypeSM),
  bestForAITools: z.string().optional(),
  isTrending: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type PromptFormData = z.infer<typeof promptSchema>;

export default function EditPromptPage() {
  const router = useRouter();
  const params = useParams();
  const { commonService } = useCommon();
  const promptId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategorySM[]>([]);
  const [loadedPrompt, setLoadedPrompt] = useState<PromptSM | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
  });

  useEffect(() => {
    if (promptId) {
      loadCategories();
      loadPrompt();
    }
  }, [promptId]);

  const loadCategories = async () => {
    try {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const response = await categoryService.getCategoriesForAdmin(0, 1000);
      if (response.successData) {
        setCategories(response.successData);
      }
    } catch (error: any) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadPrompt = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading prompt...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      const response = await promptService.getPromptById(promptId);
      if (response.successData) {
        const prompt = response.successData;
        setLoadedPrompt(prompt);
        setValue("categoryId", prompt.categoryId);
        setValue("title", prompt.title);
        setValue("description", prompt.description || "");
        setValue("promptText", prompt.promptText);
        setValue("promptType", prompt.promptType);
        setValue("bestForAITools", prompt.bestForAITools || "");
        setValue("isTrending", prompt.isTrending);
        setValue("isActive", prompt.isActive);
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load prompt",
      });
      router.push("/admin/prompts");
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const onSubmit = async (data: PromptFormData) => {
    try {
      await commonService.presentLoading("Updating prompt...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      const prompt = new PromptSM();
      prompt.id = promptId;
      prompt.categoryId = data.categoryId;
      prompt.title = data.title.trim();
      prompt.description = data.description?.trim() || "";
      prompt.promptText = data.promptText.trim();
      prompt.promptType = data.promptType;
      prompt.bestForAITools = data.bestForAITools?.trim() || "";
      prompt.isTrending = data.isTrending;
      prompt.isActive = data.isActive;
      prompt.likesCount = loadedPrompt?.likesCount || 0;
      prompt.samples = loadedPrompt?.samples || [];

      await promptService.updatePrompt(promptId, prompt);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Prompt updated successfully!",
      });
      router.push("/admin/prompts");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update prompt",
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
          <div className="container mt-5">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading prompt...</p>
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
                  <h1 className="display-5 fw-bold mb-2">Edit Prompt</h1>
                  <p className="text-muted mb-0">Update prompt information</p>
                </div>
                <Link
                  href="/admin/prompts"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Prompts
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
                      {/* Category Selection */}
                      <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label fw-semibold">
                          Category <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select form-select-lg ${errors.categoryId ? "is-invalid" : ""}`}
                          id="categoryId"
                          {...register("categoryId", { valueAsNumber: true })}
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId && (
                          <div className="invalid-feedback">{errors.categoryId.message}</div>
                        )}
                      </div>

                      {/* Prompt Type */}
                      <div className="col-md-6">
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
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "none" }}
                        />
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
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "vertical" }}
                        />
                        {errors.promptText && (
                          <div className="invalid-feedback">{errors.promptText.message}</div>
                        )}
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
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                        />
                      </div>

                      {/* Toggles */}
                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isTrending"
                            {...register("isTrending")}
                            style={{ width: "3rem", height: "1.5rem", cursor: "pointer" }}
                          />
                          <label className="form-check-label fw-semibold ms-2" htmlFor="isTrending">
                            <i className="bi bi-fire me-2 text-warning"></i>
                            Mark as Trending
                          </label>
                        </div>
                      </div>

                      <div className="col-md-6">
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
                      </div>

                      {loadedPrompt && (
                        <div className="col-12">
                          <div className="alert alert-info border-0" style={{ borderRadius: "12px" }}>
                            <i className="bi bi-info-circle me-2"></i>
                            This prompt has <strong>{loadedPrompt.likesCount || 0}</strong> like(s) and{" "}
                            <strong>{loadedPrompt.samples?.length || 0}</strong> sample(s). They will be preserved when you update the prompt.
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
                            <i className="bi bi-save me-2"></i>
                            Update Prompt
                          </>
                        )}
                      </button>
                      <Link
                        href="/admin/prompts"
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
