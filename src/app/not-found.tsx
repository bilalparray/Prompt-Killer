import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";

export default function NotFound() {
  return (
    <UserLayout>
      <div className="library-page-bg min-vh-100 d-flex align-items-center library-content-offset">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 text-center">
              <div className="card library-content-card border-0 shadow-sm p-4 p-lg-5">
                <div className="card-body">
                  <span className="d-inline-block rounded-circle bg-light text-muted mb-3" style={{ width: "80px", height: "80px", lineHeight: "80px", fontSize: "2.5rem" }}>
                    404
                  </span>
                  <h1 className="h3 fw-bold mb-2">Page not found</h1>
                  <p className="text-muted mb-4">
                    The page you’re looking for doesn’t exist or has been moved.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <Link href="/home" className="btn library-btn-primary">
                      <i className="bi bi-house-door me-2" />
                      Go to Home
                    </Link>
                    <Link href="/categories" className="btn library-btn-outline">
                      <i className="bi bi-folder2-open me-2" />
                      Browse Library
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
