"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AccountService } from "@/services/account.service";
import { AccountsClient } from "@/api/accounts.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { useCommon } from "@/hooks/useCommon";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";

const resetPasswordSchema = z
  .object({
    loginId: z.string().min(1, "Login ID is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    verificationToken: z.string().min(1, "Verification token is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { commonService } = useCommon();
  const [verificationToken, setVerificationToken] = useState<string>("");

  const storageService = new StorageService();
  const storageCache = new StorageCache(storageService);
  const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
  const accountsClient = new AccountsClient(storageService, storageCache, commonResponseCodeHandler);
  const accountService = new AccountService(accountsClient, storageService);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setVerificationToken(token);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (verificationToken) {
      setValue("verificationToken", verificationToken);
    }
  }, [verificationToken, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await commonService.presentLoading("Resetting password...");
      await accountService.resetPassword({
        loginId: data.loginId,
        newPassword: data.newPassword,
        verificationToken: data.verificationToken,
      });
      await commonService.dismissLoader();

      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Password Reset",
        text: "Your password has been reset successfully.",
      });

      router.push("/admin/auth/login");
    } catch (err: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="loginId" className="form-label">
                      Login ID
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.loginId ? "is-invalid" : ""}`}
                      id="loginId"
                      {...register("loginId")}
                    />
                    {errors.loginId && (
                      <div className="invalid-feedback">{errors.loginId.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                      id="newPassword"
                      {...register("newPassword")}
                    />
                    {errors.newPassword && (
                      <div className="invalid-feedback">{errors.newPassword.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      id="confirmPassword"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                    )}
                  </div>

                  <input type="hidden" {...register("verificationToken")} />

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <Link href="/admin/auth/login">Back to Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
