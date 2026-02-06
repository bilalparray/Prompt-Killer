"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCommon } from "@/hooks/useCommon";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { commonService } = useCommon();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await commonService.presentLoading("Sending message...");
      
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you soon.",
      });
      reset();
    } catch (error: any) {
      await commonService.dismissLoader();
      await commonService.showSweetAlertToast({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name" className="form-label fw-semibold">
          Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
          id="name"
          {...register("name")}
          placeholder="Your full name"
          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="form-label fw-semibold">
          Email <span className="text-danger">*</span>
        </label>
        <input
          type="email"
          className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
          id="email"
          {...register("email")}
          placeholder="your.email@example.com"
          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="subject" className="form-label fw-semibold">
          Subject <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control form-control-lg ${errors.subject ? "is-invalid" : ""}`}
          id="subject"
          {...register("subject")}
          placeholder="What is this regarding?"
          style={{ borderRadius: "12px", border: "2px solid #e9ecef" }}
        />
        {errors.subject && (
          <div className="invalid-feedback">{errors.subject.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="form-label fw-semibold">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          className={`form-control ${errors.message ? "is-invalid" : ""}`}
          id="message"
          rows={6}
          {...register("message")}
          placeholder="Tell us more about your inquiry..."
          style={{ borderRadius: "12px", border: "2px solid #e9ecef", resize: "none" }}
        ></textarea>
        {errors.message && (
          <div className="invalid-feedback">{errors.message.message}</div>
        )}
      </div>

      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg rounded-pill fw-semibold py-3"
          disabled={isSubmitting}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
          }}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Sending...
            </>
          ) : (
            <>
              <i className="bi bi-send me-2"></i>
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
