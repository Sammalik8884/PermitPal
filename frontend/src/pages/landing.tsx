import { Link } from "react-router-dom";
import { Shield, FileText, Bell, Globe2, Clock, CheckCircle2, Star } from "lucide-react";
import { PermitPalWordmark } from "@/components/ui/logo";

const features = [
  { icon: FileText, title: "Permit Tracking", desc: "Track all STR permits with automated expiry alerts across multiple properties." },
  { icon: Clock, title: "Night Cap Monitoring", desc: "Real-time tracking of nightly bookings against local caps via iCal sync." },
  { icon: Globe2, title: "Multi-Jurisdiction", desc: "Stay compliant across EU, AU, and US regulations automatically." },
  { icon: Bell, title: "Automated Alerts", desc: "Email, SMS, and in-app alerts for permits, night caps, and regulatory changes." },
];

const plans = [
  { 
    name: "Starter", 
    price: "Free", 
    period: "", 
    desc: "Perfect for single property hosts starting out.", 
    features: ["1 property", "Basic permit tracking", "Night cap monitoring", "Email alerts", "Community support"], 
    cta: "Get Started Free", 
    isPopular: false 
  },
  { 
    name: "Professional", 
    price: "$29", 
    period: "/mo", 
    desc: "For hosts managing multiple properties.", 
    features: ["Up to 10 properties", "Advanced scoring", "iCal sync", "Document vault", "Multi-jurisdiction", "Priority support"], 
    cta: "Start Free Trial", 
    isPopular: true 
  },
  { 
    name: "Enterprise", 
    price: "$99", 
    period: "/mo", 
    desc: "For property managers & agencies.", 
    features: ["Unlimited properties", "Team collaboration", "API access", "Dedicated manager", "SLA guarantee", "White-label"], 
    cta: "Contact Sales", 
    isPopular: false 
  }
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Navigation */}
      <nav style={{ borderBottom: "1px solid #ebebeb", position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <PermitPalWordmark size={28} />
          
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link to="/login" style={{ fontSize: "14px", fontWeight: 600, color: "#222222", textDecoration: "none" }}>Log in</Link>
            <Link to="/register">
              <button style={{ 
                backgroundColor: "#ff385c", 
                color: "#ffffff", 
                border: "none", 
                borderRadius: "8px", 
                padding: "10px 20px", 
                fontSize: "14px", 
                fontWeight: 600, 
                cursor: "pointer" 
              }}>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: "100px 24px", textAlign: "center", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-[800] text-[#222222] tracking-[-1.5px] leading-[1.1] mb-6">
            The all-in-one platform for short-term rental compliance.
          </h1>
          <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            Track permits, monitor night caps, and stay ahead of regulatory changes across the EU, AU, and US with PermitPal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button style={{ 
                backgroundColor: "#ff385c", 
                color: "#ffffff", 
                border: "none", 
                borderRadius: "8px", 
                padding: "16px 32px", 
                fontSize: "16px", 
                fontWeight: 600, 
                cursor: "pointer",
                width: "100%"
              }}>
                Start for free
              </button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <button style={{ 
                backgroundColor: "#ffffff", 
                color: "#222222", 
                border: "1px solid #222222", 
                borderRadius: "8px", 
                padding: "16px 32px", 
                fontSize: "16px", 
                fontWeight: 600, 
                cursor: "pointer",
                width: "100%"
              }}>
                How it works
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 24px", backgroundColor: "#f7f7f7", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#222222", textAlign: "center", marginBottom: "64px" }}>
            Everything you need to stay compliant
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "16px", border: "1px solid #ebebeb" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fff0ef", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
                  <feature.icon style={{ color: "#ff385c", width: "24px", height: "24px" }} />
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "12px" }}>{feature.title}</h3>
                <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: 1.5 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#222222", textAlign: "center", marginBottom: "64px" }}>
            Simple, transparent pricing
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
            {plans.map((plan, idx) => (
              <div key={idx} style={{ 
                backgroundColor: "#ffffff", 
                padding: "40px 32px", 
                borderRadius: "16px", 
                border: plan.isPopular ? "2px solid #222222" : "1px solid #ebebeb",
                position: "relative"
              }}>
                {plan.isPopular && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#222222", color: "#ffffff", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>{plan.name}</h3>
                <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "24px" }}>{plan.desc}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "32px" }}>
                  <span style={{ fontSize: "40px", fontWeight: 700, color: "#222222", letterSpacing: "-1px" }}>{plan.price}</span>
                  <span style={{ fontSize: "16px", color: "#6a6a6a" }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#222222" }}>
                      <CheckCircle2 style={{ width: "20px", height: "20px", color: "#1a7a40" }} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    width: "100%", 
                    backgroundColor: plan.isPopular ? "#ff385c" : "#ffffff", 
                    color: plan.isPopular ? "#ffffff" : "#222222", 
                    border: plan.isPopular ? "none" : "1px solid #222222", 
                    borderRadius: "8px", 
                    padding: "14px 24px", 
                    fontSize: "16px", 
                    fontWeight: 600, 
                    cursor: "pointer" 
                  }}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "64px 24px 32px", borderTop: "1px solid #ebebeb", backgroundColor: "#f7f7f7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}><PermitPalWordmark size={24} /></div>
              <p style={{ fontSize: "14px", color: "#6a6a6a", lineHeight: 1.5, maxWidth: "240px" }}>
                The all-in-one compliance platform for short-term rental hosts worldwide.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "16px" }}>Product</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#6a6a6a" }}>
                <li><a href="#features" style={{ color: "inherit", textDecoration: "none" }}>Features</a></li>
                <li><a href="#pricing" style={{ color: "inherit", textDecoration: "none" }}>Pricing</a></li>
                <li><Link to="/integrations" style={{ color: "inherit", textDecoration: "none" }}>Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "16px" }}>Company</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#6a6a6a" }}>
                <li><Link to="/about" style={{ color: "inherit", textDecoration: "none" }}>About</Link></li>
                <li><Link to="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link></li>
                <li><Link to="/careers" style={{ color: "inherit", textDecoration: "none" }}>Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "16px" }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#6a6a6a" }}>
                <li><Link to="/privacy-policy" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #dddddd", paddingTop: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "14px", color: "#929292" }}>
            <span>© {new Date().getFullYear()} PermitPal. All rights reserved.</span>
            <div style={{ display: "flex", gap: "16px" }}>
              <Globe2 style={{ width: "20px", height: "20px" }} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
