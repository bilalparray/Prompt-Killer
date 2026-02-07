"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

const promptImageSchema = z.object({
  description: z.string().optional(),
  imageBase64: z.string().min(1, "Image is required"),
});

type PromptImageFormData = z.infer<typeof promptImageSchema>;

export default function EditPromptImagePage() {
  const router = useRouter();
  const params = useParams();
  const { commonService } = useCommon();
  const imageId = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<PromptImageSM | null>(null);
  const [prompt, setPrompt] = useState<PromptSM | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PromptImageFormData>({
    resolver: zodResolver(promptImageSchema),
  });

  useEffect(() => {
    if (imageId) {
      loadImage();
    }
  }, [imageId]);

  const loadImage = async () => {
    try {
      setLoading(true);
      await commonService.presentLoading("Loading image...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptImageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
      const promptImageService = new PromptImageService(promptImageClient);

      const response = await promptImageService.getPromptImageById(imageId);
      if (response.successData) {
        const image = response.successData;
        setLoadedImage(image);
        setValue("description", image.description || "");
        setValue("imageBase64", image.imageBase64 || "");

        if (image.imageBase64) {
          setImagePreview(`data:image/png;base64,${image.imageBase64}`);
        }

        // Load prompt if it's a prompt image
        if (image.promptId) {
          const promptClient = new PromptClient(storageService, storageCache, commonResponseCodeHandler);
          const promptService = new PromptService(promptClient);
          const promptResponse = await promptService.getPromptById(image.promptId);
          if (promptResponse.successData) {
            setPrompt(promptResponse.successData);
          }
        }
      }
    } catch (error: any) {
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to load image",
      });
      router.push("/admin/prompt-images");
    } finally {
      await commonService.dismissLoader();
      setLoading(false);
    }
  };

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
      await commonService.presentLoading("Updating image...");

      const storageService = new StorageService();
      const storageCache = new StorageCache(storageService);
      const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
      const promptImageClient = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
      const promptImageService = new PromptImageService(promptImageClient);

      const image = new PromptImageSM();
      image.id = imageId;
      image.imageBase64 = data.imageBase64;
      image.description = data.description?.trim() || "";
      image.promptId = loadedImage?.promptId || null;
      image.trendingPromptId = loadedImage?.trendingPromptId || null;
      image.isActive = loadedImage?.isActive ?? true;

      await promptImageService.updatePromptImage(imageId, image);
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Success!",
        text: "Image updated successfully!",
      });
      router.push("/admin/prompt-images");
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update image",
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
              <p className="mt-3 text-muted">Loading image...</p>
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
                  <h1 className="display-5 fw-bold mb-2">Edit Prompt Image</h1>
                  <p className="text-muted mb-0">Update image information</p>
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
                  {loadedImage && (
                    <div className="alert alert-info border-0 mb-4" style={{ borderRadius: "12px" }}>
                      <i className="bi bi-info-circle me-2"></i>
                      This image belongs to:{" "}
                      <strong>
                        {loadedImage.promptId
                          ? prompt
                            ? prompt.title
                            : `Prompt #${loadedImage.promptId}`
                          : `Trending Prompt #${loadedImage.trendingPromptId}`}
                      </strong>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
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
                          Upload a new image to replace the current one (max 5MB)
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
                                  if (loadedImage?.imageBase64) {
                                    setImagePreview(`data:image/png;base64,${loadedImage.imageBase64}`);
                                    setValue("imageBase64", loadedImage.imageBase64);
                                  } else {
                                    setImagePreview(null);
                                    setValue("imageBase64", "");
                                  }
                                }}
                                style={{ width: "30px", height: "30px", padding: 0 }}
                              >
                                <i className="bi bi-arrow-counterclockwise"></i>
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Update Image
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
