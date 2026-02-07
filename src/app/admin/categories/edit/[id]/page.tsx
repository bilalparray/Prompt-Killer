"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthGuard } from "@/guards/AuthGuard";
import { useCommon } from "@/hooks/useCommon";
import { RoleTypeSM } from "@/models/enums/role-type-s-m.enum";
import { CategoryService } from "@/services/category.service";
import { CategoryClient } from "@/api/category.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { CategorySM } from "@/models/service/app/v1/category/category-s-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  imageBase64: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { commonService } = useCommon();
  const categoryId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadedCategory, setLoadedCategory] = useState<CategorySM | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading category...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const response = await categoryService.getCategoryById(categoryId);
      if (response.successData) {
        const category = response.successData;
        setLoadedCategory(category);
        setValue("name", category.name);
        setValue("slug", category.slug);
        setValue("description", category.description || "");
        setValue("isActive", category.isActive);
        setValue("imageBase64", category.imageBase64 || "");

        if (category.imageBase64) {
          setImagePreview(`data:image/png;base64,${category.imageBase64}`);
        }
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load category",
      });
      router.push("/admin/categories");
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        commonService.showSweetAlertToast({
          icon: "error",
          title: "File too large",
          text: "Image must be less than 2MB",
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    // Only auto-update slug if user hasn't manually edited it
    const currentSlug = watch("slug");
    if (!currentSlug || currentSlug === generateSlug(loadedCategory?.name || "")) {
      setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await commonService.presentLoading("Updating category...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const category = new CategorySM();
      category.id = categoryId;
      category.name = data.name.trim();
      category.slug = data.slug.trim();
      category.description = data.description?.trim() || "";
      category.isActive = data.isActive;
      category.imageBase64 = data.imageBase64 || "";
      category.prompts = loadedCategory?.prompts || [];

      await categoryService.updateCategory(categoryId, category);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Category updated successfully!",
      });
      router.push("/admin/categories");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update category",
      });
    }
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
        <AdminLayout>
          <div className="container mt-5">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading category...</p>
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
                  <h1 className="display-5 fw-bold mb-2">Edit Category</h1>
                  <p className="text-muted mb-0">Update category information</p>
                </div>
                <Link
                  href="/admin/categories"
                  className="btn btn-outline-secondary rounded-pill px-4"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Categories
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
                    <div className="mb-4">
                      <label htmlFor="name" className="form-label fw-semibold">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        {...register("name")}
                        onChange={handleNameChange}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="slug" className="form-label fw-semibold">
                        Slug <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${errors.slug ? "is-invalid" : ""}`}
                        id="slug"
                        {...register("slug")}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                      />
                      {errors.slug && (
                        <div className="invalid-feedback">{errors.slug.message}</div>
                      )}
                      <small className="form-text text-muted">
                        URL-friendly identifier (lowercase letters, numbers, and hyphens only)
                      </small>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="description" className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows={4}
                        {...register("description")}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "none" }}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="image" className="form-label fw-semibold">
                        Category Image
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
                      />
                      <small className="form-text text-muted">
                        Upload a new image to replace the current one (max 2MB)
                      </small>
                      {imagePreview && (
                        <div className="mt-3">
                          <div className="position-relative d-inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="img-thumbnail rounded"
                              style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover" }}
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

                    <div className="mb-4">
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="isActive"
                          {...register("isActive")}
                          style={{ width: "3rem", height: "1.5rem", cursor: "pointer" }}
                        />
                        <label className="form-check-label fw-semibold ms-2" htmlFor="isActive">
                          Active (visible to users)
                        </label>
                      </div>
                      <small className="form-text text-muted d-block mt-1">
                        Inactive categories will be hidden from public view
                      </small>
                    </div>

                    {loadedCategory && loadedCategory.prompts && loadedCategory.prompts.length > 0 && (
                      <div className="mb-4">
                        <div className="alert alert-info border-0" style={{ borderRadius: "12px" }}>
                          <i className="bi bi-info-circle me-2"></i>
                          This category contains <strong>{loadedCategory.prompts.length}</strong> prompt(s).
                          They will be preserved when you update the category.
                        </div>
                      </div>
                    )}

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
                            Update Category
                          </>
                        )}
                      </button>
                      <Link
                        href="/admin/categories"
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
