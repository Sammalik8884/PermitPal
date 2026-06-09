import { Link } from "react-router-dom";
import { Globe2 } from "lucide-react";
import { PermitPalWordmark } from "@/components/ui/logo";

function StaticPageWrapper({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <nav style={{ borderBottom: "1px solid #ebebeb", position: "sticky", top: 0, backgroundColor: "#ffffff", zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "80px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}><PermitPalWordmark size={28} /></Link>
          
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

      {/* Main Content */}
      <main style={{ flex: 1, padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#222222", letterSpacing: "-1px", marginBottom: "32px" }}>
            {title}
          </h1>
          <div style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "24px" }}>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "64px 24px 32px", borderTop: "1px solid #ebebeb", backgroundColor: "#f7f7f7" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
            <div>
              <div style={{ marginBottom: "16px" }}><Link to="/" style={{ textDecoration: "none" }}><PermitPalWordmark size={24} /></Link></div>
              <p style={{ fontSize: "14px", color: "#6a6a6a", lineHeight: 1.5, maxWidth: "240px" }}>
                The all-in-one compliance platform for short-term rental hosts worldwide.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#222222", marginBottom: "16px" }}>Product</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#6a6a6a" }}>
                <li><Link to="/#features" style={{ color: "inherit", textDecoration: "none" }}>Features</Link></li>
                <li><Link to="/#pricing" style={{ color: "inherit", textDecoration: "none" }}>Pricing</Link></li>
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

export function AboutPage() {
  return (
    <StaticPageWrapper title="About PermitPal">
      <p>PermitPal was built by a team of short-term rental operators who experienced firsthand the difficulty of tracking permits, taxes, and constantly changing regulations.</p>
      <p>We are a global team working across the EU, AU, and the US to bring you the best-in-class compliance software.</p>
    </StaticPageWrapper>
  );
}

export function BlogPage() {
  return (
    <StaticPageWrapper title="PermitPal Blog">
      <p>We are currently working on our first set of guides and articles. Check back soon for the latest updates on STR compliance, night cap strategies, and product news!</p>
    </StaticPageWrapper>
  );
}

export function CareersPage() {
  return (
    <StaticPageWrapper title="Careers">
      <p>We're always looking for talented engineers, designers, and compliance experts to join our fully remote team.</p>
      <p>Please reach out to us at <strong>careers@permitpal.com</strong> with your resume if you're interested.</p>
    </StaticPageWrapper>
  );
}

export function IntegrationsPage() {
  return (
    <StaticPageWrapper title="Integrations">
      <p>PermitPal connects seamlessly with your existing tools:</p>
      <ul style={{ listStylePosition: "inside" }}>
        <li>Airbnb iCal synchronization</li>
        <li>Vrbo booking imports</li>
        <li>Direct integration with property management systems (coming soon)</li>
      </ul>
    </StaticPageWrapper>
  );
}

export function PrivacyPolicyPage() {
  return (
    <StaticPageWrapper title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>Your privacy is important to us. PermitPal collects minimal data required to provide you with compliance alerts and dashboard statistics.</p>
      <p>We never sell your property data to third parties. All sensitive document vaults are encrypted at rest.</p>
    </StaticPageWrapper>
  );
}

export function TermsOfServicePage() {
  return (
    <StaticPageWrapper title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>By using PermitPal, you agree to comply with your local jurisdiction's laws. PermitPal provides informational compliance services and alerts, but does not provide legal advice.</p>
      <p>Users are responsible for ensuring the accuracy of the permit details and iCal links they upload to the platform.</p>
    </StaticPageWrapper>
  );
}
