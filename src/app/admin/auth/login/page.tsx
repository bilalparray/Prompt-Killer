"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useCommon } from "@/hooks/useCommon";
import { useStorage } from "@/hooks/useStorage";
import { AppConstants } from "@/constants/app-constants";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";

const loginSchema = z.object({
  loginId: z.string().min(1, "Login ID is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(true),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { commonService } = useCommon();
  const { getFromStorage } = useStorage();
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCredentials, setIsLoadingCredentials] = useState(true);
  const credentialsLoadedRef = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginId: "",
      password: "",
      rememberMe: true,
    },
  });

  // Load saved credentials only once on component mount
  useEffect(() => {
    // Prevent multiple loads
    if (credentialsLoadedRef.current) return;

    const loadSavedCredentials = async () => {
      try {
        const rememberMe = await getFromStorage(AppConstants.DATABASE_KEYS.REMEMBER_PWD);
        if (rememberMe && !credentialsLoadedRef.current) {
          const savedLoginId = await getFromStorage(AppConstants.DATABASE_KEYS.SAVED_LOGIN_ID);
          const savedPassword = await getFromStorage(AppConstants.DATABASE_KEYS.SAVED_PASSWORD);

          // Only set values once, and only if they exist
          if (savedLoginId) {
            setValue("loginId", savedLoginId, { shouldDirty: false, shouldValidate: false });
          }
          if (savedPassword) {
            setValue("password", savedPassword, { shouldDirty: false, shouldValidate: false });
          }
          setValue("rememberMe", true, { shouldDirty: false });

          credentialsLoadedRef.current = true;
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      } finally {
        setIsLoadingCredentials(false);
        credentialsLoadedRef.current = true;
      }
    };

    loadSavedCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await commonService.presentLoading("Logging in...");
      await login(data.loginId, data.password, data.rememberMe);
      await commonService.dismissLoader();
      router.push("/admin/dashboard");
    } catch (err: any) {
      await commonService.dismissLoader();
      setError(err.message || "Login failed. Please try again.");
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Login failed. Please try again.",
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
                <h2 className="card-title text-center mb-4">Admin Login</h2>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
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

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      {...register("rememberMe")}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="mt-3 text-center">
                  <Link href="/admin/auth/forgotpassword">Forgot Password?</Link>
                </div>
                <div className="mt-2 text-center">
                  <Link href="/admin/auth/register">Don't have an account? Register</Link>
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
