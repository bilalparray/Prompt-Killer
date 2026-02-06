"use client";

import React, { useState } from "react";
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

const forgotPasswordSchema = z.object({
  userName: z.string().min(1, "Username is required"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPasswordPage() {
  const { commonService } = useCommon();
  const [success, setSuccess] = useState(false);

  const storageService = new StorageService();
  const storageCache = new StorageCache(storageService);
  const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
  const accountsClient = new AccountsClient(storageService, storageCache, commonResponseCodeHandler);
  const accountService = new AccountService(accountsClient, storageService);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await commonService.presentLoading("Sending reset link...");
      await accountService.forgotPassword({ userName: data.userName });
      await commonService.dismissLoader();
      setSuccess(true);
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Reset Link Sent",
        text: "Please check your email for password reset instructions.",
      });
    } catch (err: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to send reset link. Please try again.",
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
                <h2 className="card-title text-center mb-4">Forgot Password</h2>
                {success ? (
                  <div className="alert alert-success" role="alert">
                    Password reset link has been sent to your email.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="userName" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.userName ? "is-invalid" : ""}`}
                        id="userName"
                        {...register("userName")}
                      />
                      {errors.userName && (
                        <div className="invalid-feedback">{errors.userName.message}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                )}

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
