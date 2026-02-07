"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: "bi-lightning-charge",
      title: "Innovation",
      description: "We continuously curate and update our prompt collection to stay ahead of AI trends.",
      color: "#667eea",
    },
    {
      icon: "bi-people",
      title: "Community",
      description: "Built for creators, developers, and artists who want to unlock AI's full potential.",
      color: "#f5576c",
    },
    {
      icon: "bi-gift",
      title: "Free Access",
      description: "We believe AI tools should be accessible to everyone. That's why we're 100% free.",
      color: "#4facfe",
    },
    {
      icon: "bi-star",
      title: "Quality",
      description: "Every prompt is carefully selected and tested to ensure the best results.",
      color: "#fa709a",
    },
  ];

  const team = [
    {
      name: "AI Enthusiasts",
      role: "Curators",
      description: "Our team of AI experts carefully selects and organizes prompts to help you find exactly what you need.",
    },
    {
      name: "Developers",
      role: "Builders",
      description: "We build and maintain the platform to ensure a smooth experience for all users.",
    },
    {
      name: "Community",
      role: "Contributors",
      description: "Our growing community of users helps us improve and expand our prompt collection.",
    },
  ];

  return (
    <UserLayout>
      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        <div className="container position-relative z-2">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-3 fw-bold mb-4">About Prompt Killer</h1>
              <p className="lead" style={{ opacity: 0.95 }}>
                Your trusted source for discovering and using powerful AI prompts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-sm h-100 hover-lift"
                style={{ borderRadius: "20px" }}
              >
                <div
                  className="card-body p-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  }}
                >
                  <div
                    className="mb-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  >
                    <i className="bi bi-bullseye fs-2"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Our Mission</h3>
                  <p className="text-muted mb-0" style={{ lineHeight: "1.8" }}>
                    At Prompt Killer, we&apos;re dedicated to making AI prompts accessible to everyone.
                    Our mission is to provide a curated collection of high-quality prompts that
                    help creators, developers, and artists unlock the full potential of AI tools.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="card border-0 shadow-sm h-100 hover-lift"
                style={{ borderRadius: "20px" }}
              >
                <div
                  className="card-body p-5"
                  style={{
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  }}
                >
                  <div
                    className="mb-4 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  >
                    <i className="bi bi-eye fs-2"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Our Vision</h3>
                  <p className="text-muted mb-0" style={{ lineHeight: "1.8" }}>
                    We envision a future where anyone can easily discover and use AI prompts to
                    enhance their creativity and productivity. We&apos;re building a platform that
                    grows with our community and adapts to the evolving landscape of AI technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">Our Values</h2>
              <p className="lead text-muted">What drives us every day</p>
            </div>
          </div>
          <div className="row g-4">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div
                  className="card border-0 shadow-sm h-100 hover-lift text-center"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="card-body p-4">
                    <div
                      className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "80px",
                        height: "80px",
                        background: `${value.color}15`,
                        color: value.color,
                      }}
                    >
                      <i className={`bi ${value.icon}`} style={{ fontSize: "2.5rem" }}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{value.title}</h5>
                    <p className="text-muted mb-0">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-4 fw-bold mb-3">Who We Are</h2>
              <p className="lead text-muted">Meet the people behind Prompt Killer</p>
            </div>
          </div>
          <div className="row g-4">
            {team.map((member, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card border-0 shadow-sm h-100 hover-lift text-center"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="card-body p-4">
                    <div
                      className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "100px",
                        height: "100px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontSize: "2.5rem",
                      }}
                    >
                      {index === 0 && "🤖"}
                      {index === 1 && "💻"}
                      {index === 2 && "👥"}
                    </div>
                    <h5 className="fw-bold mb-2">{member.name}</h5>
                    <span
                      className="badge mb-3 px-3 py-2"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                      }}
                    >
                      {member.role}
                    </span>
                    <p className="text-muted mb-0">{member.description}</p>
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
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4" style={{ opacity: 0.95 }}>
                Explore our collection of AI prompts and discover what you can create
              </p>
              <Link
                href="/categories"
                className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-semibold shadow-lg"
                style={{ fontSize: "1.1rem" }}
              >
                <i className="bi bi-folder me-2"></i>
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2) !important;
        }
      `}</style>
    </UserLayout>
  );
}
