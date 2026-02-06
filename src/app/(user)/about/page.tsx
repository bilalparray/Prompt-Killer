"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";

export default function AboutPage() {
  return (
    <UserLayout>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4">About Us</h1>
            <p className="lead">Learn more about Boilerplate and our mission</p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-3">
                  <i className="bi bi-bullseye text-primary me-2"></i>
                  Our Mission
                </h3>
                <p className="card-text">
                  At Boilerplate, we're dedicated to providing cutting-edge solutions that
                  empower businesses to thrive in the digital age. Our mission is to deliver
                  high-quality, scalable applications that meet the evolving needs of our clients.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-3">
                  <i className="bi bi-eye text-primary me-2"></i>
                  Our Vision
                </h3>
                <p className="card-text">
                  We envision a future where technology seamlessly integrates with business
                  operations, creating efficient, secure, and user-friendly experiences. Our
                  vision drives us to continuously innovate and improve our platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <i className="bi bi-star text-primary me-2"></i>
                  Why Choose Us?
                </h3>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <h5>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Reliable
                    </h5>
                    <p>99.9% uptime guarantee with robust infrastructure</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h5>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Secure
                    </h5>
                    <p>Enterprise-grade security with encrypted data storage</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <h5>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Scalable
                    </h5>
                    <p>Built to grow with your business needs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <i className="bi bi-people text-primary me-2"></i>
                  Our Team
                </h3>
                <p className="card-text">
                  Our team consists of experienced developers, designers, and engineers who are
                  passionate about creating exceptional digital experiences. We combine technical
                  expertise with creative problem-solving to deliver solutions that exceed
                  expectations.
                </p>
                <p className="card-text">
                  With years of experience in modern web technologies, we stay at the forefront
                  of industry trends and best practices to ensure our clients receive the most
                  advanced and reliable solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
