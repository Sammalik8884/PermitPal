import { Outlet } from "react-router-dom";
import { CheckCircle2, Globe2, Bell, FileText, TrendingUp } from "lucide-react";
import { PermitPalWordmark, PermitPalIcon } from "@/components/ui/logo";

const features = [
  { icon: Globe2, text: "Multi-jurisdiction compliance tracking across EU, AU & US" },
  { icon: FileText, text: "Automated permit expiry alerts and renewal reminders" },
  { icon: Bell, text: "Real-time night cap monitoring with iCal integration" },
  { icon: CheckCircle2, text: "Document vault for all your compliance paperwork" },
  { icon: TrendingUp, text: "Compliance scoring and actionable recommendations" },
];

const stats = [
  { value: "10,000+", label: "Properties Managed" },
  { value: "99.9%", label: "Uptime" },
  { value: "50+", label: "Jurisdictions" },
];

function AuthLayout() {
  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Left Panel — White branding side */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between"
        style={{
          backgroundColor: "#ffffff",
          borderRight: "1px solid #dddddd",
          padding: "48px 64px",
        }}
      >
        {/* Logo */}
        <PermitPalWordmark size={32} />

        {/* Middle: Hero */}
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#222222",
              lineHeight: "1.43",
              marginBottom: "16px",
            }}
          >
            Stay Compliant.{" "}
            <span style={{ color: "#ff385c" }}>Rent with Confidence.</span>
          </h1>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#6a6a6a",
              lineHeight: "1.5",
              maxWidth: "420px",
              marginBottom: "40px",
            }}
          >
            The all-in-one platform for short-term rental compliance. Track permits,
            monitor night caps, and stay ahead of regulatory changes.
          </p>

          <ul style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {features.map((feature, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "9999px",
                    border: "1px solid #dddddd",
                    backgroundColor: "#f7f7f7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <feature.icon className="h-3 w-3 text-[#ff385c]" />
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#3f3f3f",
                    lineHeight: "1.5",
                  }}
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Stats */}
        <div style={{ display: "flex", gap: "40px" }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#222222",
                  lineHeight: "1.18",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#6a6a6a",
                  marginTop: "2px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form area */}
      <div
        className="flex w-full lg:w-1/2 xl:w-[45%] flex-col"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        {/* Mobile Logo */}
        <div
          className="flex items-center gap-2 lg:hidden"
          style={{ padding: "24px" }}
        >
          <PermitPalWordmark size={28} />
        </div>

        {/* Centered Form */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #dddddd",
              padding: "40px",
              boxShadow: "rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.1) 0 4px 8px 0",
            }}
          >
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "#929292",
          }}
        >
          © {new Date().getFullYear()} PermitPal. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
