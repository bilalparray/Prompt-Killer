"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  return (
    <UserLayout>
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4">Contact Us</h1>
            <p className="lead">We'd love to hear from you. Get in touch with us!</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Contact Information
                </h5>
                <div className="mb-3">
                  <p className="mb-1">
                    <i className="bi bi-envelope text-primary me-2"></i>
                    <strong>Email:</strong>
                  </p>
                  <p className="ms-4">contact@boilerplate.com</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1">
                    <i className="bi bi-telephone text-primary me-2"></i>
                    <strong>Phone:</strong>
                  </p>
                  <p className="ms-4">+1 (555) 123-4567</p>
                </div>
                <div className="mb-3">
                  <p className="mb-1">
                    <i className="bi bi-geo-alt text-primary me-2"></i>
                    <strong>Address:</strong>
                  </p>
                  <p className="ms-4">
                    123 Business Street
                    <br />
                    Suite 100
                    <br />
                    City, State 12345
                  </p>
                </div>
                <div>
                  <p className="mb-1">
                    <i className="bi bi-clock text-primary me-2"></i>
                    <strong>Business Hours:</strong>
                  </p>
                  <p className="ms-4">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
