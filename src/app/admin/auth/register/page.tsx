"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { environment } from "@/environments/environment";
import { ClientUserSM } from "@/models/service/app/v1/app-users/client-user-s-m";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    emailId: z.string().email("Invalid email address"),
    loginId: z.string().min(1, "Login ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    companyCode: z.string().default(environment.companyCode),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const { commonService } = useCommon();
  const [error, setError] = useState<string | null>(null);

  const storageService = new StorageService();
  const storageCache = new StorageCache(storageService);
  const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
  const accountsClient = new AccountsClient(storageService, storageCache, commonResponseCodeHandler);
  const accountService = new AccountService(accountsClient, storageService);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await commonService.presentLoading("Registering...");

      const registerData = new ClientUserSM();
      registerData.firstName = data.firstName;
      registerData.lastName = data.lastName;
      registerData.emailId = data.emailId;
      registerData.loginId = data.loginId;
      registerData.password = data.password;
      registerData.phoneNumber = data.phoneNumber || "";
      registerData.companyCode = data.companyCode;
      registerData.dateOfBirth = new Date();

      await accountService.Register(registerData);
      await commonService.dismissLoader();

      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Registration Successful",
        text: "Please check your email to verify your account.",
      });

      router.push("/admin/auth/login");
    } catch (err: any) {
      await commonService.dismissLoader();
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Admin Registration</h2>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                      id="firstName"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                      id="lastName"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName.message}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="emailId" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.emailId ? "is-invalid" : ""}`}
                      id="emailId"
                      {...register("emailId")}
                    />
                    {errors.emailId && (
                      <div className="invalid-feedback">{errors.emailId.message}</div>
                    )}
                  </div>

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
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      id="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password.message}</div>
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

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <Link href="/admin/auth/login">Already have an account? Login</Link>
                </div>
                <div className="mt-2 text-center">
                  <Link href="/home">Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
