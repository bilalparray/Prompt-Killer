import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mt-5 text-center">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/home" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
