import { Suspense } from "react";
import { VerifyEmailClient } from "./VerifyEmailClient";

export const dynamic = 'force-dynamic';

export default function AdminVerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailClient />
    </Suspense>
  );
}
