import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import { PasswordStrength } from "@/components/password-strength";
import { apiPost, extractApiError } from "@/lib/api";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setApiError(null);
    setIsLoading(true);
    try {
      await apiPost("/auth/reset-password", {
        token: token!,
        newPassword: data.password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setApiError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "32px", textAlign: "center" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "50%", 
            backgroundColor: "#fff0ef", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px" 
          }}>
            <AlertCircle style={{ width: "32px", height: "32px", color: "#c13515" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Invalid reset link
          </h1>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: "1.5" }}>
            This password reset link is invalid or has expired.
          </p>
        </div>

        <Link to="/forgot-password" style={{ textDecoration: "none" }}>
          <button style={{ 
            width: "100%", 
            height: "56px", 
            backgroundColor: "#ffffff", 
            color: "#222222", 
            fontSize: "16px", 
            fontWeight: 600, 
            border: "1px solid #222222", 
            borderRadius: "8px", 
            cursor: "pointer",
            marginBottom: "24px"
          }}>
            Request new link
          </button>
        </Link>

        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
            color: "#222222",
            textDecoration: "none",
          }}
        >
          Back to sign in
        </Link>
      </div>
    );
  }

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
            <CheckCircle2 style={{ width: "32px", height: "32px", color: "#1a7a40" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Password reset successfully!
          </h1>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: "1.5" }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", marginBottom: "8px", letterSpacing: "-0.5px" }}>
          Set new password
        </h1>
        <p style={{ fontSize: "16px", color: "#6a6a6a" }}>
          Enter your new password below.
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
        
        {/* New Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 600, color: "#222222" }}>
            New password
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              style={{
                width: "100%",
                height: "56px",
                padding: "0 48px 0 16px",
                fontSize: "16px",
                color: "#222222",
                backgroundColor: "#ffffff",
                border: errors.password ? "1.5px solid #c13515" : "1px solid #dddddd",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                if (!errors.password) e.target.style.border = "2px solid #222222";
              }}
              onBlur={(e) => {
                if (!errors.password) e.target.style.border = "1px solid #dddddd";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#6a6a6a",
                display: "flex"
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff style={{ width: "20px", height: "20px" }} /> : <Eye style={{ width: "20px", height: "20px" }} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: "12px", color: "#c13515", margin: 0, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <AlertCircle style={{ width: "12px", height: "12px" }} />
              {errors.password.message}
            </p>
          )}
          {passwordValue && <div style={{ marginTop: "8px" }}><PasswordStrength password={passwordValue} /></div>}
        </div>

        {/* Confirm Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label htmlFor="confirmPassword" style={{ fontSize: "14px", fontWeight: 600, color: "#222222" }}>
            Confirm new password
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("confirmPassword")}
              style={{
                width: "100%",
                height: "56px",
                padding: "0 48px 0 16px",
                fontSize: "16px",
                color: "#222222",
                backgroundColor: "#ffffff",
                border: errors.confirmPassword ? "1.5px solid #c13515" : "1px solid #dddddd",
                borderRadius: "8px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                if (!errors.confirmPassword) e.target.style.border = "2px solid #222222";
              }}
              onBlur={(e) => {
                if (!errors.confirmPassword) e.target.style.border = "1px solid #dddddd";
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#6a6a6a",
                display: "flex"
              }}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff style={{ width: "20px", height: "20px" }} /> : <Eye style={{ width: "20px", height: "20px" }} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p style={{ fontSize: "12px", color: "#c13515", margin: 0, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <AlertCircle style={{ width: "12px", height: "12px" }} />
              {errors.confirmPassword.message}
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
            "Reset password"
          )}
        </button>

        {/* Back Link */}
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
            color: "#222222",
            textDecoration: "none",
            marginTop: "8px"
          }}
        >
          Back to sign in
        </Link>
      </form>
    </div>
  );
}
