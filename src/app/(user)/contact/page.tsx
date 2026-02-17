"use client";

import React from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export default function ContactPage() {
  const contactInfo = [
    { icon: "bi-envelope", title: "Email", content: "contact@promptkiller.com", link: "mailto:contact@promptkiller.com" },
    { icon: "bi-github", title: "GitHub", content: "github.com/promptkiller", link: "https://github.com" },
    { icon: "bi-twitter", title: "Twitter", content: "@promptkiller", link: "https://twitter.com" },
    { icon: "bi-discord", title: "Discord", content: "Join our community", link: "https://discord.com" },
  ];

  const faqs = [
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
  ];

  return (
    <UserLayout>
      <section className="library-hero pb-4">
        <div className="container">
          <nav aria-label="breadcrumb" className="library-breadcrumb mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/home" className="text-white-50">Home</Link></li>
              <li className="breadcrumb-item active text-white" aria-current="page">Contact</li>
            </ol>
          </nav>
          <h1 className="h2 fw-bold text-white mb-2">Get in touch</h1>
          <p className="text-white-50 mb-0 small">Have a question or suggestion? We&apos;d love to hear from you.</p>
        </div>
      </section>

      <div className="library-page-bg">
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card library-content-card border-0">
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="h5 fw-bold mb-4">
                      <i className="bi bi-chat-dots me-2 text-primary" />
                      Send us a message
                    </h3>
                    <ContactForm />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card library-content-card border-0 h-100">
                  <div className="card-body p-4 p-lg-5">
                    <h3 className="h5 fw-bold mb-4">
                      <i className="bi bi-info-circle me-2 text-primary" />
                      Contact information
                    </h3>
                    <div className="d-flex flex-column gap-3">
                      {contactInfo.map((info, index) => (
                        <a
                          key={index}
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none d-flex align-items-start text-body"
                        >
                          <span className="library-category-icon rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: "44px", height: "44px" }}>
                            <i className={`bi ${info.icon} text-white`} />
                          </span>
                          <div>
                            <span className="fw-semibold d-block">{info.title}</span>
                            <span className="text-muted small">{info.content}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                    <hr className="my-4" />
                    <h6 className="fw-bold mb-3">Business hours</h6>
                    <div className="d-flex flex-column gap-2 small text-muted">
                      <div className="d-flex justify-content-between">
                        <span>Monday – Friday</span>
                        <span className="fw-semibold">9:00 AM – 6:00 PM</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Saturday</span>
                        <span className="fw-semibold">10:00 AM – 4:00 PM</span>
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
        </section>

        <section className="py-5 border-top bg-white">
          <div className="container">
            <h2 className="library-section-title mb-4">Frequently asked questions</h2>
            <div className="row">
              <div className="col-lg-8">
                <div className="accordion" id="faqAccordion">
                  {faqs.map((faq, index) => (
                    <div key={index} className="accordion-item border library-content-card mb-2" style={{ borderRadius: "12px", borderColor: "#e2e8f0 !important" }}>
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed fw-semibold py-3"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#faq${index}`}
                          aria-expanded="false"
                          style={{ background: "white", borderRadius: "12px", color: "#2d3748" }}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div id={`faq${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                        <div className="accordion-body text-muted pt-0">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
