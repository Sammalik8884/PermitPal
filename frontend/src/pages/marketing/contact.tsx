import { Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222222", letterSpacing: "-1.5px", marginBottom: "24px" }}>
          Get in touch
        </h1>
        <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5 }}>
          Have questions about pricing, compliance, or our platform? We're here to help.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "64px" }}>
        <div style={{ backgroundColor: "#f7f7f7", padding: "32px", borderRadius: "16px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fff0ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <MessageSquare style={{ width: "24px", height: "24px", color: "#ff385c" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Sales</h3>
          <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "16px" }}>Talk to our enterprise team about bulk pricing.</p>
          <a href="mailto:sales@permitpal.com" style={{ fontSize: "16px", fontWeight: 600, color: "#ff385c", textDecoration: "none" }}>sales@permitpal.com</a>
        </div>

        <div style={{ backgroundColor: "#f7f7f7", padding: "32px", borderRadius: "16px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fff0ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Mail style={{ width: "24px", height: "24px", color: "#ff385c" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Support</h3>
          <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "16px" }}>Need help with your account? Reach out anytime.</p>
          <a href="mailto:support@permitpal.com" style={{ fontSize: "16px", fontWeight: 600, color: "#ff385c", textDecoration: "none" }}>support@permitpal.com</a>
        </div>

        <div style={{ backgroundColor: "#f7f7f7", padding: "32px", borderRadius: "16px", textAlign: "center" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#fff0ef", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Phone style={{ width: "24px", height: "24px", color: "#ff385c" }} />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Press</h3>
          <p style={{ fontSize: "14px", color: "#6a6a6a", marginBottom: "16px" }}>For media inquiries and PR.</p>
          <a href="mailto:press@permitpal.com" style={{ fontSize: "16px", fontWeight: 600, color: "#ff385c", textDecoration: "none" }}>press@permitpal.com</a>
        </div>
      </div>
    </div>
  );
}
