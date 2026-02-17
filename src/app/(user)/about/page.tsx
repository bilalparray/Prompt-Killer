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
    },
    {
      icon: "bi-people",
      title: "Community",
      description: "Built for creators, developers, and artists who want to unlock AI's full potential.",
    },
    {
      icon: "bi-gift",
      title: "Free Access",
      description: "We believe AI tools should be accessible to everyone. That's why we're 100% free.",
    },
    {
      icon: "bi-star",
      title: "Quality",
      description: "Every prompt is carefully selected and tested to ensure the best results.",
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
      <section className="library-hero pb-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">About</li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-white mb-2">About Prompt Killer</h1>
          <p className="text-white-50 mb-0 small">Your trusted source for discovering and using AI prompts</p>
        </div>
      </section>

      <div className="library-page-bg">
        {/* Mission & Vision */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="card library-content-card border-0 h-100">
                  <div className="card-body p-4 p-lg-5">
                    <div className="library-category-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                      <i className="bi bi-bullseye text-white fs-5" />
                    </div>
                    <h3 className="h5 fw-bold mb-3">Our Mission</h3>
                    <p className="text-muted mb-0" style={{ lineHeight: "1.7" }}>
                      At Prompt Killer, we&apos;re dedicated to making AI prompts accessible to everyone.
                      Our mission is to provide a curated collection of high-quality prompts that
                      help creators, developers, and artists unlock the full potential of AI tools.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card library-content-card border-0 h-100">
                  <div className="card-body p-4 p-lg-5">
                    <div className="library-category-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                      <i className="bi bi-eye text-white fs-5" />
                    </div>
                    <h3 className="h5 fw-bold mb-3">Our Vision</h3>
                    <p className="text-muted mb-0" style={{ lineHeight: "1.7" }}>
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

        {/* Values */}
        <section className="py-5 border-top bg-white">
          <div className="container">
            <h2 className="library-section-title mb-4">Our Values</h2>
            <div className="row g-3 g-md-4">
              {values.map((value, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card library-content-card border-0 h-100">
                    <div className="card-body p-4 text-center">
                      <div className="library-category-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                        <i className={`bi ${value.icon} text-white fs-5`} />
                      </div>
                      <h5 className="fw-bold mb-2">{value.title}</h5>
                      <p className="text-muted small mb-0">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-5 border-top">
          <div className="container">
            <h2 className="library-section-title mb-4">Who We Are</h2>
            <div className="row g-3 g-md-4">
              {team.map((member, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card library-content-card border-0 h-100">
                    <div className="card-body p-4 text-center">
                      <div className="library-category-icon rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "56px", height: "56px" }}>
                        <span className="text-white fs-4">
                          {index === 0 && "🤖"}
                          {index === 1 && "💻"}
                          {index === 2 && "👥"}
                        </span>
                      </div>
                      <h5 className="fw-bold mb-2">{member.name}</h5>
                      <span className="badge library-badge-type mb-2">{member.role}</span>
                      <p className="text-muted small mb-0">{member.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-5 library-hero">
          <div className="container text-center text-white">
            <h2 className="h4 fw-bold mb-3">Ready to get started?</h2>
            <p className="text-white-50 mb-4 small">Explore the library and discover prompts you can use right away.</p>
            <Link href="/categories" className="btn btn-light btn-lg rounded-pill px-4 fw-semibold">
              <i className="bi bi-folder2-open me-2" />
              Browse library
            </Link>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
