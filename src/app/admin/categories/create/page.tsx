"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  imageBase64: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const router = useRouter();
  const { commonService } = useCommon();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/...;base64, prefix if present
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
    if (!watch("slug")) {
      setValue("slug", generateSlug(name));
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await commonService.presentLoading("Creating category...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const categoryClient = new CategoryClient(storageService, storageCache, commonResponseCodeHandler);
      const categoryService = new CategoryService(categoryClient);

      const category = new CategorySM();
      category.name = data.name;
      category.slug = data.slug;
      category.description = data.description || "";
      category.isActive = data.isActive;
      category.imageBase64 = data.imageBase64 || "";
      category.prompts = []; // Initialize empty prompts array

      await categoryService.createCategory(category);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Category created successfully!",
      });
      router.push("/admin/categories");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create category",
      });
    }
  };

  return (
    <AuthGuard allowedRoles={[RoleTypeSM.ClientAdmin, RoleTypeSM.SuperAdmin, RoleTypeSM.SystemAdmin]}>
      <AdminLayout>
        <div className="container mt-5 mb-5">
          <div className="row mb-4">
            <div className="col-12">
              <h1>Create Category</h1>
              <Link href="/admin/categories" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i>
                Back to Categories
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        id="name"
                        {...register("name")}
                        onChange={handleNameChange}
                        placeholder="e.g., Marketing Prompts"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name.message}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="slug" className="form-label">
                        Slug <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.slug ? "is-invalid" : ""}`}
                        id="slug"
                        {...register("slug")}
                        placeholder="e.g., marketing-prompts"
                      />
                      <small className="form-text text-muted">
                        URL-friendly identifier (auto-generated from name)
                      </small>
                      {errors.slug && (
                        <div className="invalid-feedback">{errors.slug.message}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows={4}
                        {...register("description")}
                        placeholder="Describe what this category is for..."
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        Category Image
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px", maxHeight: "200px" }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        {...register("isActive")}
                      />
                      <label className="form-check-label" htmlFor="isActive">
                        Active (visible to users)
                      </label>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Create Category
                          </>
                        )}
                      </button>
                      <Link href="/admin/categories" className="btn btn-outline-secondary">
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
