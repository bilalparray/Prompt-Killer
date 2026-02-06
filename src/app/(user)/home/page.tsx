"use client";

import React from "react";
import Link from "next/link";
import { UserLayout } from "@/components/layout/UserLayout";

export default function HomePage() {
  const features = [
    {
      icon: "bi-shield-check",
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to keep your data safe and secure.",
      color: "text-primary",
    },
    {
      icon: "bi-lightning-charge",
      title: "Lightning Fast",
      description: "Optimized performance with Next.js 14 for instant page loads and smooth interactions.",
      color: "text-warning",
    },
    {
      icon: "bi-code-slash",
      title: "Developer Friendly",
      description: "Built with TypeScript and modern best practices for easy customization.",
      color: "text-info",
    },
    {
      icon: "bi-graph-up-arrow",
      title: "Scalable Architecture",
      description: "Designed to grow with your business needs, from startup to enterprise.",
      color: "text-success",
    },
    {
      icon: "bi-cloud-check",
      title: "Cloud Ready",
      description: "Deploy anywhere with cloud-native architecture and container support.",
      color: "text-primary",
    },
    {
      icon: "bi-headset",
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you whenever you need assistance.",
      color: "text-danger",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Countries" },
    { number: "24/7", label: "Support" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      image: "👩‍💼",
      text: "Prompt Killer has transformed how we manage our operations. The platform is intuitive and powerful.",
    },
    {
      name: "Michael Chen",
      role: "CTO, StartupXYZ",
      image: "👨‍💻",
      text: "The best investment we made. The developer experience is exceptional and the documentation is top-notch.",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager, InnovateCo",
      image: "👩‍💼",
      text: "Our team productivity increased by 40% after switching to Prompt Killer. Highly recommended!",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 5 team members",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "API access",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      features: [
        "Up to 25 team members",
        "100GB storage",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Advanced security",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited team members",
        "Unlimited storage",
        "Custom analytics",
        "Dedicated support",
        "White-label options",
        "SLA guarantee",
      ],
      popular: false,
    },
  ];

  return (
    <UserLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-3 fw-bold mb-4">
                Build Amazing Applications with Prompt Killer
              </h1>
              <p className="lead mb-4">
                A production-ready React/Next.js platform with authentication, API architecture,
                and everything you need to launch fast.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/admin/auth/login" className="btn btn-light btn-lg px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Get Started
                </Link>
                <Link href="/about" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-4">
                <i className="bi bi-lightning-charge-fill" style={{ fontSize: "12rem", opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <h2 className="display-4 fw-bold text-primary mb-2">{stat.number}</h2>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </div>
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
              <h2 className="display-5 fw-bold mb-3">Why Choose Prompt Killer?</h2>
              <p className="lead text-muted">
                Everything you need to build and scale your application
              </p>
            </div>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="card border-0 shadow-sm h-100 hover-lift">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <i className={`bi ${feature.icon} ${feature.color}`} style={{ fontSize: "3rem" }}></i>
                    </div>
                    <h4 className="fw-semibold mb-3">{feature.title}</h4>
                    <p className="text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">Get started in minutes, not days</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="mb-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                  <span className="fs-1 fw-bold">1</span>
                </div>
              </div>
              <h4 className="fw-semibold mb-3">Sign Up</h4>
              <p className="text-muted">
                Create your account in seconds. No credit card required to get started.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="mb-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                  <span className="fs-1 fw-bold">2</span>
                </div>
              </div>
              <h4 className="fw-semibold mb-3">Customize</h4>
              <p className="text-muted">
                Configure your settings, integrate your tools, and customize to your needs.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="mb-4">
                <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: "80px", height: "80px" }}>
                  <span className="fs-1 fw-bold">3</span>
                </div>
              </div>
              <h4 className="fw-semibold mb-3">Launch</h4>
              <p className="text-muted">
                Deploy your application and start growing your business with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">What Our Customers Say</h2>
              <p className="lead text-muted">Trusted by thousands of businesses worldwide</p>
            </div>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "60px", height: "60px", fontSize: "2rem" }}>
                          {testimonial.image}
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-0">{testimonial.name}</h6>
                          <small className="text-muted">{testimonial.role}</small>
                        </div>
                      </div>
                      <div className="text-warning mb-2">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                      </div>
                    </div>
                    <p className="text-muted mb-0">"{testimonial.text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="display-5 fw-bold mb-3">Simple, Transparent Pricing</h2>
              <p className="lead text-muted">Choose the plan that's right for you</p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className={`card border-0 shadow-sm h-100 ${plan.popular ? "border-primary border-2" : ""}`}>
                  {plan.popular && (
                    <div className="bg-primary text-white text-center py-2">
                      <small className="fw-semibold">MOST POPULAR</small>
                    </div>
                  )}
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">{plan.name}</h4>
                    <div className="mb-4">
                      <span className="display-4 fw-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted">{plan.period}</span>}
                    </div>
                    <ul className="list-unstyled mb-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/admin/auth/login"
                      className={`btn w-100 ${plan.popular ? "btn-primary" : "btn-outline-primary"}`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join thousands of businesses already using Prompt Killer to power their applications.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link href="/admin/auth/login" className="btn btn-light btn-lg px-5">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Start Free Trial
                </Link>
                <Link href="/contact" className="btn btn-outline-light btn-lg px-5">
                  <i className="bi bi-envelope me-2"></i>
                  Contact Sales
                </Link>
              </div>
              <p className="mt-4 mb-0">
                <small>No credit card required • 14-day free trial • Cancel anytime</small>
              </p>
            </div>
          </div>
        </div>
      </section>

    </UserLayout>
  );
}
