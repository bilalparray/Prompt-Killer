import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/app/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { CommonProvider } from "@/contexts/CommonContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Killer",
  description: "Prompt Killer - Advanced prompt management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
          async
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
          async
        ></script>
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <NetworkProvider>
              <CommonProvider>
                <AuthProvider>{children}</AuthProvider>
              </CommonProvider>
            </NetworkProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
