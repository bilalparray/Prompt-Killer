"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: "bi-envelope",
      title: "Email",
      content: "contact@promptkiller.com",
      link: "mailto:contact@promptkiller.com",
      color: "#667eea",
    },
    {
      icon: "bi-github",
      title: "GitHub",
      content: "github.com/promptkiller",
      link: "https://github.com",
      color: "#f5576c",
    },
    {
      icon: "bi-twitter",
      title: "Twitter",
      content: "@promptkiller",
      link: "https://twitter.com",
      color: "#4facfe",
    },
    {
      icon: "bi-discord",
      title: "Discord",
      content: "Join our community",
      link: "https://discord.com",
      color: "#fa709a",
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
              <h1 className="display-3 fw-bold mb-4">Get In Touch</h1>
              <p className="lead" style={{ opacity: 0.95 }}>
                Have a question or suggestion? We&apos;d love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <div className="row g-4">
            {/* Contact Form */}
            <div className="col-lg-8">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4">
                    <i className="bi bi-chat-dots me-2" style={{ color: "#667eea" }}></i>
                    Send us a Message
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "20px" }}
              >
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4">
                    <i className="bi bi-info-circle me-2" style={{ color: "#667eea" }}></i>
                    Contact Information
                  </h3>
                  <div className="d-flex flex-column gap-4">
                    {contactInfo.map((info, index) => (
                      <a
                        key={index}
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none hover-lift"
                        style={{ color: "inherit" }}
                      >
                        <div className="d-flex align-items-start">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                            style={{
                              width: "50px",
                              height: "50px",
                              background: `${info.color}15`,
                              color: info.color,
                            }}
                          >
                            <i className={`bi ${info.icon} fs-5`}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">{info.title}</h6>
                            <p className="text-muted mb-0 small">{info.content}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-top">
                    <h6 className="fw-bold mb-3">Business Hours</h6>
                    <div className="d-flex flex-column gap-2 small text-muted">
                      <div className="d-flex justify-content-between">
                        <span>Monday - Friday</span>
                        <span className="fw-semibold">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Saturday</span>
                        <span className="fw-semibold">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Sunday</span>
                        <span className="fw-semibold">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold text-center mb-5">Frequently Asked Questions</h2>
              <div className="accordion" id="faqAccordion">
                {[
                  {
                    question: "Is Prompt Killer really free?",
                    answer: "Yes! Prompt Killer is 100% free. We don't require any sign-up or payment. All prompts are available for immediate use.",
                  },
                  {
                    question: "How often are new prompts added?",
                    answer: "We regularly update our collection with new prompts. Our team of curators adds fresh content weekly to keep the collection current and useful.",
                  },
                  {
                    question: "Can I suggest a prompt?",
                    answer: "Absolutely! We love hearing from our community. Use the contact form above to suggest prompts or categories you'd like to see.",
                  },
                  {
                    question: "Which AI tools are compatible?",
                    answer: "Our prompts work with popular AI tools including ChatGPT, Midjourney, DALL-E, Stable Diffusion, Claude, and many others. Most prompts are tool-agnostic and can be adapted.",
                  },
                ].map((faq, index) => (
                  <div key={index} className="accordion-item border-0 shadow-sm mb-3" style={{ borderRadius: "12px" }}>
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#faq${index}`}
                        aria-expanded="false"
                        style={{
                          background: "white",
                          borderRadius: "12px",
                        }}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`faq${index}`}
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-muted">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hover-lift {
          transition: all 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-4px);
        }

        .accordion-button:not(.collapsed) {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </UserLayout>
  );
}
