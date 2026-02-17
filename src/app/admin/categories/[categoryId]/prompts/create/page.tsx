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
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  promptText: z.string().min(1, "Prompt text is required").min(10, "Prompt text must be at least 10 characters"),
  promptType: z.nativeEnum(PromptTypeSM),
  bestForAITools: z.string().optional(),
  isTrending: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type PromptFormData = z.infer<typeof promptSchema>;

export default function CategoryCreatePromptPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = parseInt(params.categoryId as string);
  const { commonService } = useCommon();
  const [category, setCategory] = useState<CategorySM | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      promptType: PromptTypeSM.Text,
      isTrending: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (categoryId) {
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);
      categoryService.getCategoryById(categoryId).then((r) => {
        if (r.successData) setCategory(r.successData);
      });
    }
  }, [categoryId]);

  const onSubmit = async (data: PromptFormData) => {
    try {
      await commonService.presentLoading("Creating prompt...");
      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
      const promptService = new PromptService(promptClient);

      const prompt = new PromptSM();
      prompt.categoryId = categoryId;
      prompt.title = data.title.trim();
      prompt.description = data.description?.trim() || "";
      prompt.promptText = data.promptText.trim();
      prompt.promptType = data.promptType;
      prompt.bestForAITools = data.bestForAITools?.trim() || "";
      prompt.isTrending = data.isTrending;
      prompt.isActive = data.isActive;
      prompt.likesCount = 0;
      prompt.samples = [];

      await promptService.createPrompt(categoryId, prompt);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Prompt created successfully!",
      });
      router.push(`/admin/categories/${categoryId}/prompts`);
    } catch (error: unknown) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error instanceof Error ? error.message : "Failed to create prompt",
      });
    }
  };

  const getPromptTypeOptions = () => [
    { value: PromptTypeSM.Text, label: "Text", icon: "bi-file-text", color: "#667eea" },
    { value: PromptTypeSM.Code, label: "Code", icon: "bi-code-slash", color: "#4facfe" },
    { value: PromptTypeSM.Image, label: "Image", icon: "bi-image", color: "#f5576c" },
  ];

  const categoryName = category?.name ?? "Category";

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-4 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <Link href="/admin/categories">Categories</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href={`/admin/categories/${categoryId}/prompts`}>{categoryName} – Prompts</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Prompt
                  </li>
                </ol>
              </nav>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h1 className="display-5 fw-bold mb-2">Add Prompt to &quot;{categoryName}&quot;</h1>
                  <p className="text-muted mb-0">Create a new prompt in this category</p>
                </div>
                <Link
                  href={`/admin/categories/${categoryId}/prompts`}
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
              <div className="card border-0 shadow-sm" style={{ borderRadius: "20px" }}>
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="alert alert-light border" style={{ borderRadius: "12px" }}>
                          <i className="bi bi-folder me-2"></i>
                          <strong>Category:</strong> {categoryName}
                        </div>
                      </div>

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
                                watch("promptType") === option.value ? "btn-primary" : "btn-outline-primary"
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
                      </div>

                      <div className="col-12">
                        <label htmlFor="promptText" className="form-label fw-semibold">
                          Prompt Text <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${errors.promptText ? "is-invalid" : ""}`}
                          id="promptText"
                          rows={8}
                          {...register("promptText")}
                          placeholder="Enter the actual prompt text..."
                          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "vertical" }}
                        />
                        {errors.promptText && (
                          <div className="invalid-feedback">{errors.promptText.message}</div>
                        )}
                      </div>

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
                      </div>

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
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Create Prompt
                          </>
                        )}
                      </button>
                      <Link
                        href={`/admin/categories/${categoryId}/prompts`}
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
