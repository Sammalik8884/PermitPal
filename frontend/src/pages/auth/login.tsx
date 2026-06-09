import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => () => { clearError(); }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      await login({ email: data.email, password: data.password });
      if (rememberMe) localStorage.setItem("permitpal_remember_me", "true");
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  const { ref: emailFormRef, ...emailRegister } = register("email");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", lineHeight: "1.43", marginBottom: "6px" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "#6a6a6a", lineHeight: "1.5" }}>
          Sign in to your PermitPal account
        </p>
      </div>

      {/* API Error */}
      {apiError && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            backgroundColor: "#fff0ef",
            border: "1px solid #f5c6c0",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "20px",
          }}
          role="alert"
        >
          <AlertCircle style={{ width: "16px", height: "16px", color: "#c13515", flexShrink: 0, marginTop: "2px" }} />
          <span style={{ fontSize: "14px", color: "#c13515", lineHeight: "1.43" }}>{apiError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#222222", marginBottom: "6px" }}
          >
            Email address
          </label>
          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#929292" }} />
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "8px",
                border: errors.email ? "1.5px solid #c13515" : "1px solid #dddddd",
                backgroundColor: "#ffffff",
                paddingLeft: "44px",
                paddingRight: "14px",
                fontSize: "16px",
                color: "#222222",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              {...emailRegister}
              ref={(e) => { emailFormRef(e); emailRef.current = e; }}
              onFocus={(e) => { if (!errors.email) e.target.style.borderColor = "#222222"; e.target.style.borderWidth = "2px"; }}
              onBlur={(e) => { if (!errors.email) { e.target.style.borderColor = "#dddddd"; e.target.style.borderWidth = "1px"; } }}
            />
          </div>
          {errors.email && (
            <p style={{ fontSize: "12px", color: "#c13515", marginTop: "6px" }}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label
              htmlFor="password"
              style={{ fontSize: "14px", fontWeight: 500, color: "#222222" }}
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              style={{ fontSize: "14px", fontWeight: 400, color: "#ff385c", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "#929292" }} />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "8px",
                border: errors.password ? "1.5px solid #c13515" : "1px solid #dddddd",
                backgroundColor: "#ffffff",
                paddingLeft: "44px",
                paddingRight: "48px",
                fontSize: "16px",
                color: "#222222",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              {...register("password")}
              onFocus={(e) => { if (!errors.password) e.target.style.borderColor = "#222222"; e.target.style.borderWidth = "2px"; }}
              onBlur={(e) => { if (!errors.password) { e.target.style.borderColor = "#dddddd"; e.target.style.borderWidth = "1px"; } }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#929292",
                display: "flex",
                alignItems: "center",
                padding: "4px",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword
                ? <EyeOff style={{ width: "18px", height: "18px" }} />
                : <Eye style={{ width: "18px", height: "18px" }} />
              }
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: "12px", color: "#c13515", marginTop: "6px" }}>{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              position: "relative",
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: rememberMe ? "2px solid #ff385c" : "1.5px solid #dddddd",
              backgroundColor: rememberMe ? "#ff385c" : "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            onClick={() => setRememberMe(!rememberMe)}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
            />
            {rememberMe && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <label
            onClick={() => setRememberMe(!rememberMe)}
            style={{ fontSize: "14px", fontWeight: 400, color: "#3f3f3f", cursor: "pointer", userSelect: "none" }}
          >
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            height: "56px",
            borderRadius: "8px",
            backgroundColor: isLoading ? "#ffd1da" : "#ff385c",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 500,
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#e00b41"; }}
          onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = "#ff385c"; }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
        <span style={{ fontSize: "13px", color: "#929292", whiteSpace: "nowrap" }}>New to PermitPal?</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
      </div>

      {/* Register Link */}
      <Link
        to="/register"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "56px",
          borderRadius: "8px",
          border: "1px solid #222222",
          backgroundColor: "#ffffff",
          color: "#222222",
          fontSize: "16px",
          fontWeight: 500,
          textDecoration: "none",
          transition: "background-color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f7f7f7")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
      >
        Create an account
      </Link>
    </div>
  );
}
