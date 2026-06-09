import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";

import { apiPost, extractApiError } from "@/lib/api";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError(null);
    setIsLoading(true);
    try {
      await apiPost("/auth/forgot-password", { email: data.email });
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (err: unknown) {
      setApiError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setApiError(null);
  };

  if (isSuccess) {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "50%", 
            backgroundColor: "#f0faf4", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px" 
          }}>
            <Check style={{ width: "32px", height: "32px", color: "#1a7a40" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Check your email
          </h1>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: "1.5" }}>
            We've sent a password reset link to <span style={{ color: "#222222", fontWeight: 600 }}>{submittedEmail}</span>
          </p>
        </div>

        <div style={{ backgroundColor: "#f7f7f7", borderRadius: "12px", padding: "24px", textAlign: "center", marginBottom: "32px" }}>
          <p style={{ fontSize: "14px", color: "#6a6a6a" }}>
            Didn't receive it? Check your spam folder or{" "}
            <button
              onClick={handleTryAgain}
              style={{ background: "none", border: "none", padding: 0, color: "#222222", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
            >
              try again
            </button>
          </p>
        </div>

        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#222222",
            textDecoration: "none",
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          Forgot your password?
        </h1>
        <p style={{ fontSize: "16px", color: "#6a6a6a" }}>
          Enter your email address and we'll send you a reset link.
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", backgroundColor: "#fff0ef", border: "1px solid #ffdcd9", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
          <AlertCircle style={{ width: "20px", height: "20px", color: "#c13515", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ fontSize: "14px", color: "#c13515", margin: 0, lineHeight: 1.5 }}>{apiError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 600, color: "#222222" }}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            {...register("email")}
            style={{
              width: "100%",
              height: "56px",
              padding: "0 16px",
              fontSize: "16px",
              color: "#222222",
              backgroundColor: "#ffffff",
              border: errors.email ? "1.5px solid #c13515" : "1px solid #dddddd",
              borderRadius: "8px",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => {
              if (!errors.email) e.target.style.border = "2px solid #222222";
            }}
            onBlur={(e) => {
              if (!errors.email) e.target.style.border = "1px solid #dddddd";
            }}
          />
          {errors.email && (
            <p style={{ fontSize: "12px", color: "#c13515", margin: 0, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <AlertCircle style={{ width: "12px", height: "12px" }} />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            height: "56px",
            backgroundColor: "#ff385c",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "8px",
            transition: "transform 0.1s ease",
          }}
          onMouseDown={(e) => {
            if (!isLoading) e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {isLoading ? (
            <div style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          ) : (
            "Send reset link"
          )}
        </button>

        {/* Back Link */}
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#222222",
            textDecoration: "none",
            marginTop: "8px"
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
