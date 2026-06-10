import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, Check, Globe, Clock, User, Building2, Mail, Lock } from "lucide-react";
import { PasswordStrength } from "@/components/password-strength";
import { useAuthStore } from "@/stores/auth-store";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "PT", label: "Portugal" },
  { value: "NL", label: "Netherlands" },
  { value: "CA", label: "Canada" },
  { value: "NZ", label: "New Zealand" },
  { value: "IE", label: "Ireland" },
  { value: "AT", label: "Austria" },
  { value: "CH", label: "Switzerland" },
  { value: "BE", label: "Belgium" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "HK", label: "Hong Kong" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "ZA", label: "South Africa" },
  { value: "BR", label: "Brazil" },
  { value: "MX", label: "Mexico" },
  { value: "IN", label: "India" },
  { value: "PK", label: "Pakistan" },
  { value: "GR", label: "Greece" },
  { value: "HR", label: "Croatia" },
];

const TIMEZONES = [
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time" },
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time" },
  { value: "America/Halifax", label: "(UTC-04:00) Atlantic Time" },
  { value: "America/Sao_Paulo", label: "(UTC-03:00) São Paulo" },
  { value: "UTC", label: "(UTC+00:00) UTC" },
  { value: "Europe/London", label: "(UTC+00:00) London" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin" },
  { value: "Europe/Athens", label: "(UTC+02:00) Athens, Helsinki" },
  { value: "Europe/Moscow", label: "(UTC+03:00) Moscow" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Dubai" },
  { value: "Asia/Karachi", label: "(UTC+05:00) Karachi" },
  { value: "Asia/Kolkata", label: "(UTC+05:30) Mumbai, Delhi" },
  { value: "Asia/Dhaka", label: "(UTC+06:00) Dhaka" },
  { value: "Asia/Bangkok", label: "(UTC+07:00) Bangkok" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney" },
  { value: "Pacific/Auckland", label: "(UTC+12:00) Auckland" },
];

function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONES.find((t) => t.value === tz) ? tz : "UTC";
  } catch { return "UTC"; }
}

// ─── Field ────────────────────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#222222", marginBottom: "6px" }}
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p style={{ fontSize: "12px", color: "#c13515", marginTop: "6px" }}>{message}</p>;
}

function StyledInput({
  id,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  hasError,
  prefixIcon,
  suffix,
  ...rest
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  hasError?: boolean;
  prefixIcon?: React.ReactNode;
  suffix?: React.ReactNode;
  [key: string]: unknown;
}) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!hasError) { e.target.style.borderColor = "#222222"; e.target.style.borderWidth = "2px"; }
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!hasError) { e.target.style.borderColor = "#dddddd"; e.target.style.borderWidth = "1px"; }
  };

  return (
    <div style={{ position: "relative" }}>
      {prefixIcon && (
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#929292", display: "flex" }}>
          {prefixIcon}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "8px",
          border: hasError ? "1.5px solid #c13515" : "1px solid #dddddd",
          backgroundColor: "#ffffff",
          paddingLeft: prefixIcon ? "44px" : "14px",
          paddingRight: suffix ? "48px" : "14px",
          fontSize: "16px",
          color: "#222222",
          outline: "none",
          transition: "border-color 0.15s ease",
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {suffix && (
        <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "4px" }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

// ─── Register Page ────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organisationName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      timezone: detectTimezone(),
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const countryValue = watch("country");
  const timezoneValue = watch("timezone");
  const passwordsMatch = confirmPasswordValue.length > 0 && passwordValue === confirmPasswordValue;

  useEffect(() => () => { clearError(); }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerUser({
        organisationName: data.organisationName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        country: data.country,
        timezone: data.timezone,
      });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  const selectTriggerStyle = {
    height: "52px",
    borderRadius: "8px",
    border: "1px solid #dddddd",
    backgroundColor: "#ffffff",
    fontSize: "16px",
    color: "#222222",
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#222222", lineHeight: "1.43", marginBottom: "6px" }}>
          Create an account
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "#6a6a6a", lineHeight: "1.5" }}>
          Get started with PermitPal in minutes
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Organisation Name */}
        <div>
          <FieldLabel htmlFor="organisationName">Organisation name</FieldLabel>
          <StyledInput
            id="organisationName"
            placeholder="Acme Properties"
            autoComplete="organization"
            disabled={isLoading}
            hasError={!!errors.organisationName}
            prefixIcon={<Building2 style={{ width: "16px", height: "16px" }} />}
            {...register("organisationName")}
          />
          <FieldError message={errors.organisationName?.message} />
        </div>

        {/* First + Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="firstName">First name</FieldLabel>
            <StyledInput
              id="firstName"
              placeholder="John"
              autoComplete="given-name"
              disabled={isLoading}
              hasError={!!errors.firstName}
              prefixIcon={<User style={{ width: "16px", height: "16px" }} />}
              {...register("firstName")}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="lastName">Last name</FieldLabel>
            <StyledInput
              id="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              disabled={isLoading}
              hasError={!!errors.lastName}
              {...register("lastName")}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        {/* Email */}
        <div>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <StyledInput
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            disabled={isLoading}
            hasError={!!errors.email}
            prefixIcon={<Mail style={{ width: "16px", height: "16px" }} />}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Country + Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Country</FieldLabel>
            <Select value={countryValue} onValueChange={(v) => setValue("country", v, { shouldValidate: true })}>
              <SelectTrigger style={selectTriggerStyle} className={errors.country ? "border-[#c13515]" : ""}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Globe style={{ width: "16px", height: "16px", color: "#929292", flexShrink: 0 }} />
                  <SelectValue placeholder="Select country" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={errors.country?.message} />
          </div>
          <div>
            <FieldLabel>Timezone</FieldLabel>
            <Select value={timezoneValue} onValueChange={(v) => setValue("timezone", v, { shouldValidate: true })}>
              <SelectTrigger style={selectTriggerStyle} className={errors.timezone ? "border-[#c13515]" : ""}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock style={{ width: "16px", height: "16px", color: "#929292", flexShrink: 0 }} />
                  <SelectValue placeholder="Select timezone" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <FieldError message={errors.timezone?.message} />
          </div>
        </div>

        {/* Password */}
        <div>
          <FieldLabel htmlFor="reg-password">Password</FieldLabel>
          <StyledInput
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
            hasError={!!errors.password}
            prefixIcon={<Lock style={{ width: "16px", height: "16px" }} />}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#929292", padding: "4px", display: "flex" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff style={{ width: "18px", height: "18px" }} /> : <Eye style={{ width: "18px", height: "18px" }} />}
              </button>
            }
            {...register("password")}
          />
          <FieldError message={errors.password?.message} />
          {passwordValue && <div style={{ marginTop: "8px" }}><PasswordStrength password={passwordValue} /></div>}
        </div>

        {/* Confirm Password */}
        <div>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <StyledInput
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            disabled={isLoading}
            hasError={!!errors.confirmPassword}
            prefixIcon={<Lock style={{ width: "16px", height: "16px" }} />}
            suffix={
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {passwordsMatch && (
                  <Check style={{ width: "16px", height: "16px", color: "#1a7a40" }} />
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#929292", padding: "4px", display: "flex" }}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: "18px", height: "18px" }} /> : <Eye style={{ width: "18px", height: "18px" }} />}
                </button>
              </div>
            }
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {/* Terms */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div
            style={{
              position: "relative",
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: acceptTerms ? "2px solid #ff385c" : "1.5px solid #dddddd",
              backgroundColor: acceptTerms ? "#ff385c" : "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "2px",
              transition: "all 0.15s ease",
            }}
            onClick={() => { const next = !acceptTerms; setAcceptTerms(next); setValue("acceptTerms", next, { shouldValidate: true }); }}
          >
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => { setAcceptTerms(e.target.checked); setValue("acceptTerms", e.target.checked, { shouldValidate: true }); }}
              style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer" }}
            />
            {acceptTerms && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <label htmlFor="acceptTerms" style={{ fontSize: "14px", color: "#3f3f3f", lineHeight: "1.5", cursor: "pointer", userSelect: "none" }}>
            I agree to the{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#ff385c", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#ff385c", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.acceptTerms && <FieldError message={errors.acceptTerms.message} />}

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
            marginTop: "4px",
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
              Creating account…
            </>
          ) : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
        <span style={{ fontSize: "13px", color: "#929292", whiteSpace: "nowrap" }}>Already have an account?</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#ebebeb" }} />
      </div>

      {/* Login Link */}
      <Link
        to="/login"
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
        Sign in instead
      </Link>
    </div>
  );
}
