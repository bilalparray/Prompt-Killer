"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";
import { PromptImageService } from "@/services/prompt-image.service";
import { PromptImageClient } from "@/api/prompt-image.client";
import { StorageService } from "@/services/storage.service";
import { StorageCache } from "@/api/helpers/storage-cache.helper";
import { CommonResponseCodeHandler } from "@/api/helpers/common-response-code-handler.helper";
import { PromptImageSM } from "@/models/service/app/v1/prompt/prompt-image-s-m";

export default function HomePage() {
  const [trendingImages, setTrendingImages] = useState<PromptImageSM[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const storageService = new StorageService();
        const storageCache = new StorageCache(storageService);
        const commonResponseCodeHandler = new CommonResponseCodeHandler(storageService);
        const client = new PromptImageClient(storageService, storageCache, commonResponseCodeHandler);
        const service = new PromptImageService(client);
        const resp = await service.getTrendingPromptImagesForUser(0, 12);
        if (resp.successData) setTrendingImages(resp.successData);
      } catch {
        setTrendingImages([]);
      } finally {
        setLoadingTrending(false);
      }
    };
    load();
  }, []);

  const features = [
    {
      icon: "bi-search",
      title: "Discover Prompts",
      description: "Browse through hundreds of carefully curated AI prompts organized by categories.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "bi-lightning-charge",
      title: "Instant Access",
      description: "Copy and use prompts immediately. No sign-up required. Start using powerful AI prompts in seconds.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "bi-folder",
      title: "Organized Categories",
      description: "Prompts are organized into categories like Text, Image, Code, and more. Find what you need quickly.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "bi-star",
      title: "Trending Prompts",
      description: "Discover the most popular and trending prompts that are making waves in the AI community.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: "bi-robot",
      title: "AI Tool Compatible",
      description: "Prompts work with popular AI tools like ChatGPT, Midjourney, DALL-E, and many others.",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
    {
      icon: "bi-heart",
      title: "Community Driven",
      description: "Join a growing community of prompt enthusiasts. Like and share your favorite prompts.",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  const stats = [
    { number: "500+", label: "AI Prompts", icon: "bi-lightning-charge" },
    { number: "50+", label: "Categories", icon: "bi-folder" },
    { number: "10K+", label: "Users", icon: "bi-people" },
    { number: "100%", label: "Free", icon: "bi-gift" },
  ];

  const promptTypes = [
    {
      icon: "bi-file-text",
      title: "Text Prompts",
      description: "Perfect prompts for text generation, writing assistance, and conversational AI.",
      examples: ["Creative Writing", "Email Templates", "Content Generation"],
      color: "#667eea",
    },
    {
      icon: "bi-image",
      title: "Image Prompts",
      description: "Stunning prompts for image generation, art creation, and visual content.",
      examples: ["Digital Art", "Photo Editing", "Concept Art"],
      color: "#f5576c",
    },
    {
      icon: "bi-code-slash",
      title: "Code Prompts",
      description: "Programming prompts for code generation, debugging, and software development.",
      examples: ["Code Generation", "Bug Fixes", "API Documentation"],
      color: "#4facfe",
    },
  ];

  const testimonials = [
    {
      name: "Alex Martinez",
      role: "Content Creator",
      image: "👨‍🎨",
      text: "Prompt Killer has revolutionized my content creation workflow. I find amazing prompts in seconds!",
      rating: 5,
    },
    {
      name: "Sarah Kim",
      role: "Developer",
      image: "👩‍💻",
      text: "The code prompts here are incredible. They've saved me hours of work and helped me learn new patterns.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Digital Artist",
      image: "🎨",
      text: "As an artist, I'm always looking for inspiration. The image prompts produce stunning results.",
      rating: 5,
    },
  ];

  return (
    <UserLayout>
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "80px",
        }}
      >
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="mb-4">
                <span
                  className="badge px-3 py-2 mb-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    fontSize: "0.9rem",
                  }}
                >
                  <i className="bi bi-gift me-2"></i>
                  100% Free • No Sign-up Required
                </span>
              </div>
              <h1
                className="display-3 fw-bold text-white mb-4"
                style={{ lineHeight: "1.2" }}
              >
                Discover & Use Powerful{" "}
                <span style={{ color: "#ffd700" }}>AI Prompts</span>
              </h1>
              <p className="lead text-white mb-4" style={{ opacity: 0.95 }}>
                Browse hundreds of carefully curated AI prompts for text, image, and code generation.
                Find the perfect prompt for your next project. Completely free.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  href="/categories"
                  className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-semibold shadow-lg"
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="bi bi-folder me-2"></i>
                  Browse Categories
                </Link>
                <Link
                  href="/about"
                  className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold"
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <div
                  className="rounded-4 p-5"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <i
                    className="bi bi-lightning-charge-fill text-white"
                    style={{ fontSize: "10rem", opacity: 0.8 }}
                  ></i>
                </div>
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    animation: "pulse 3s ease-in-out infinite",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="position-absolute bottom-0 start-0 w-100"
          style={{
            height: "100px",
            background: "linear-gradient(to top, rgba(255,255,255,0.1), transparent)",
          }}
        ></div>
      </section>

      {/* Trending Prompt Images - Homepage hero section */}
      <section className="py-5" style={{ background: "linear-gradient(180deg, #f8f9fa 0%, #fff 100%)" }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-2">
                <i className="bi bi-fire text-warning me-2"></i>
                Trending Now
              </h2>
              <p className="lead text-muted">Click any image to see the full prompt</p>
            </div>
          </div>
          {loadingTrending ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading trending prompts...</p>
            </div>
          ) : trendingImages.length > 0 ? (
            <div className="row g-4">
              {trendingImages.map((img) => (
                <div key={img.id} className="col-lg-3 col-md-4 col-sm-6">
                  <Link
                    href={`/view/image/${img.id}`}
                    className="text-decoration-none d-block h-100"
                  >
                    <div
                      className="card border-0 shadow-sm h-100 hover-lift overflow-hidden"
                      style={{ borderRadius: "20px" }}
                    >
                      {img.imageBase64 ? (
                        <div
                          style={{
                            height: "220px",
                            overflow: "hidden",
                            background: "#f0f0f0",
                          }}
                        >
                          <img
                            src={`data:image/png;base64,${img.imageBase64}`}
                            className="w-100 h-100"
                            alt={img.description || "Trending prompt"}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center text-muted"
                          style={{
                            height: "220px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "rgba(255,255,255,0.8)",
                          }}
                        >
                          <i className="bi bi-image" style={{ fontSize: "3rem" }}></i>
                        </div>
                      )}
                      <div className="card-body p-3">
                        <p className="text-muted small mb-0 text-truncate">
                          {img.description || "View prompt"}
                        </p>
                        <span className="badge bg-warning text-dark mt-2">
                          <i className="bi bi-fire me-1"></i>Trending
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No trending prompts right now. Check back later!</p>
              <Link href="/categories" className="btn btn-primary rounded-pill mt-3">
                Browse Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div
                  className="card border-0 shadow-sm h-100 text-center p-4 hover-lift"
                  style={{ borderRadius: "16px" }}
                >
                  <div
                    className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  >
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </div>
                  <h2 className="display-5 fw-bold mb-2" style={{ color: "#667eea" }}>
                    {stat.number}
                  </h2>
                  <p className="text-muted mb-0 fw-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">Why Choose Prompt Killer?</h2>
              <p className="lead text-muted">
                Your one-stop destination for discovering and using powerful AI prompts
              </p>
            </div>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card border-0 shadow-sm h-100 hover-lift"
                  style={{ borderRadius: "20px", overflow: "hidden" }}
                >
                  <div
                    className="p-4 text-white"
                    style={{
                      background: feature.gradient,
                      minHeight: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className={`bi ${feature.icon}`} style={{ fontSize: "3.5rem" }}></i>
                  </div>
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">{feature.title}</h4>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prompt Types Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">Explore Prompt Types</h2>
              <p className="lead text-muted">Find prompts for every type of AI task</p>
            </div>
          </div>
          <div className="row g-4">
            {promptTypes.map((type, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card border-0 shadow-sm h-100 hover-lift"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="card-body p-4">
                    <div
                      className="mb-3 rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "70px",
                        height: "70px",
                        background: `${type.color}15`,
                        color: type.color,
                      }}
                    >
                      <i className={`bi ${type.icon}`} style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <h4 className="fw-bold mb-3">{type.title}</h4>
                    <p className="text-muted mb-3">{type.description}</p>
                    <div className="d-flex flex-wrap gap-2">
                      {type.examples.map((example, exampleIndex) => (
                        <span
                          key={exampleIndex}
                          className="badge px-3 py-2"
                          style={{
                            background: `${type.color}15`,
                            color: type.color,
                            fontSize: "0.85rem",
                          }}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">Start using AI prompts in three simple steps</p>
            </div>
          </div>
          <div className="row g-4">
            {[
              {
                step: "1",
                icon: "bi-folder",
                title: "Browse Categories",
                description: "Explore our organized collection of prompt categories. Find prompts for text, image, code, and more.",
              },
              {
                step: "2",
                icon: "bi-search",
                title: "Find Your Prompt",
                description: "Search through hundreds of prompts. Filter by category, type, or popularity to find exactly what you need.",
              },
              {
                step: "3",
                icon: "bi-clipboard-check",
                title: "Copy & Use",
                description: "Copy the prompt and use it with your favorite AI tool. No sign-up required. It's that simple!",
              },
            ].map((item, index) => (
              <div key={index} className="col-md-4 text-center">
                <div className="mb-4 position-relative">
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center position-relative"
                    style={{
                      width: "100px",
                      height: "100px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      zIndex: 2,
                    }}
                  >
                    {item.step}
                  </div>
                  <div
                    className="position-absolute top-50 start-50 translate-middle rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      background: "rgba(102, 126, 234, 0.1)",
                      zIndex: 1,
                    }}
                  ></div>
                </div>
                <div
                  className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "#f8f9fa",
                    color: "#667eea",
                  }}
                >
                  <i className={`bi ${item.icon} fs-4`}></i>
                </div>
                <h4 className="fw-bold mb-3">{item.title}</h4>
                <p className="text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">What Our Users Say</h2>
              <p className="lead text-muted">Trusted by thousands of creators and developers</p>
            </div>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div
                  className="card border-0 shadow-sm h-100 hover-lift"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="text-warning mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <i key={i} className="bi bi-star-fill"></i>
                        ))}
                      </div>
                      <p className="text-muted mb-0" style={{ fontStyle: "italic" }}>
                        &quot;{testimonial.text}&quot;
                      </p>
                    </div>
                    <div className="d-flex align-items-center mt-4 pt-3 border-top">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "50px",
                          height: "50px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "1.5rem",
                        }}
                      >
                        {testimonial.image}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h2 className="display-4 fw-bold mb-4">Ready to Discover Amazing Prompts?</h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Start browsing our collection of AI prompts today. No sign-up required. Completely free.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link
                  href="/categories"
                  className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-semibold shadow-lg"
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="bi bi-folder me-2"></i>
                  Browse Categories
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold"
                  style={{ fontSize: "1.1rem" }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Contact Us
                </Link>
              </div>
              <p className="mt-4 mb-0">
                <small style={{ opacity: 0.9 }}>
                  <i className="bi bi-gift me-1"></i>
                  100% Free • No Sign-up Required • Instant Access
                </small>
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </UserLayout>
  );
}
