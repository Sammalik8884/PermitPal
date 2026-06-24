import { Link } from "react-router-dom";
import { Users, Globe2, ShieldCheck, Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "64px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222222", letterSpacing: "-1.5px", marginBottom: "24px" }}>
          Compliance doesn't have to be complicated
        </h1>
        <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5 }}>
          We built PermitPal because we experienced firsthand the nightmare of tracking permits, taxes, and constantly changing regulations for our own short-term rentals.
        </p>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", marginBottom: "80px" }}>
        <div style={{ backgroundColor: "#f7f7f7", padding: "40px", borderRadius: "16px" }}>
          <ShieldCheck style={{ width: "32px", height: "32px", color: "#ff385c", marginBottom: "24px" }} />
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginBottom: "16px" }}>Our Mission</h3>
          <p style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: 1.6 }}>
            To empower hosts and property managers with the tools they need to stay compliant, avoid fines, and focus on delivering exceptional hospitality.
          </p>
        </div>
        <div style={{ backgroundColor: "#f7f7f7", padding: "40px", borderRadius: "16px" }}>
          <Globe2 style={{ width: "32px", height: "32px", color: "#ff385c", marginBottom: "24px" }} />
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginBottom: "16px" }}>Global Reach</h3>
          <p style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: 1.6 }}>
            We monitor regulations across the US, EU, and AU, ensuring our platform adapts to local laws and reporting requirements automatically.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#222222", marginBottom: "32px" }}>Join us on our journey</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
          <Link to="/careers">
            <button style={{ backgroundColor: "#ffffff", color: "#222222", border: "1px solid #dddddd", borderRadius: "8px", padding: "14px 24px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
              View open roles
            </button>
          </Link>
          <Link to="/register">
            <button style={{ backgroundColor: "#ff385c", color: "#ffffff", border: "none", borderRadius: "8px", padding: "14px 24px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
              Try PermitPal free
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
