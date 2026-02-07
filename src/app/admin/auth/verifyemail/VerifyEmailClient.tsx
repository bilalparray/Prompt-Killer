"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AccountService } from "@/services/account.service";
import { AccountsClient } from "@/api/accounts.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { useCommon } from "@/hooks/useCommon";
import { Layout } from "@/components/layout/Layout";
import Link from "next/link";

export function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { commonService } = useCommon();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState<string>("");

  const storageService = new StorageService();
  const storageCache = new StorageCache(storageService);
  const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
  const accountsClient = new AccountsClient(storageService, storageCache, commonResponseCodeHandler);
  const accountService = new AccountService(accountsClient, storageService);

  useEffect(() => {
    const verifyEmail = async () => {
      const userName = searchParams.get("userName");
      const token = searchParams.get("token");

      if (!userName || !token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      try {
        await commonService.presentLoading("Verifying email...");
        await accountService.VerifyEmail({
          userName,
          verificationToken: token,
        });
        await commonService.dismissLoader();
        setStatus("success");
        setMessage("Email verified successfully!");
        await commonService.showSweetAlertToast({
          icon: "success",
          title: "Email Verified",
          text: "Your email has been verified successfully.",
        });
      } catch (err: any) {
        await commonService.dismissLoader();
        setStatus("error");
        setMessage(err.message || "Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams, accountService, commonService]);

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center">
                {status === "verifying" && (
                  <>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Verifying...</span>
                    </div>
                    <h2>Verifying Email...</h2>
                  </>
                )}

                {status === "success" && (
                  <>
                    <i className="bi bi-check-circle text-success" style={{ fontSize: "3rem" }}></i>
                    <h2 className="mt-3 text-success">Email Verified!</h2>
                    <p className="mt-3">{message}</p>
                    <Link href="/admin/auth/login" className="btn btn-primary mt-3">
                      Go to Login
                    </Link>
                  </>
                )}

                {status === "error" && (
                  <>
                    <i className="bi bi-x-circle text-danger" style={{ fontSize: "3rem" }}></i>
                    <h2 className="mt-3 text-danger">Verification Failed</h2>
                    <p className="mt-3">{message}</p>
                    <Link href="/admin/auth/login" className="btn btn-primary mt-3">
                      Go to Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
