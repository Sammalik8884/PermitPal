import { Outlet, Link } from "react-router-dom";
import { Globe2 } from "lucide-react";
import { PermitPalWordmark } from "@/components/ui/logo";

export default function MarketingLayout() {
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
      <main style={{ flex: 1 }}>
        <Outlet />
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
                <li><Link to="/contact" style={{ color: "inherit", textDecoration: "none" }}>Contact</Link></li>
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
