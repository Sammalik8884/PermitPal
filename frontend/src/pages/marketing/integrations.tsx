import { Link } from "react-router-dom";
import { Link as LinkIcon, Database, Key } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222222", letterSpacing: "-1.5px", marginBottom: "24px" }}>
          Connect your tools
        </h1>
        <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5 }}>
          PermitPal integrates with the platforms you already use to sync reservations, night caps, and property details automatically.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", marginBottom: "80px" }}>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "16px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#ff385c", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LinkIcon style={{ width: "24px", height: "24px", color: "#ffffff" }} />
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#222222" }}>Airbnb iCal</h3>
          </div>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "24px" }}>
            Sync your Airbnb calendars via iCal to automatically track your booked nights against local night caps (e.g., London's 90-day limit).
          </p>
          <span style={{ backgroundColor: "#e5f4f5", color: "#006a70", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}>Available now</span>
        </div>

        <div style={{ border: "1px solid #ebebeb", borderRadius: "16px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#000034", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LinkIcon style={{ width: "24px", height: "24px", color: "#ffffff" }} />
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#222222" }}>Vrbo iCal</h3>
          </div>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "24px" }}>
            Import your Vrbo reservations alongside Airbnb to ensure you have a unified view of your property's occupancy compliance.
          </p>
          <span style={{ backgroundColor: "#e5f4f5", color: "#006a70", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}>Available now</span>
        </div>

        <div style={{ border: "1px solid #ebebeb", borderRadius: "16px", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Database style={{ width: "24px", height: "24px", color: "#222222" }} />
            </div>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#222222" }}>PMS Connect</h3>
          </div>
          <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "24px" }}>
            Direct API integrations with Guesty, Hostaway, and other leading Property Management Systems for deep compliance sync.
          </p>
          <span style={{ backgroundColor: "#fff8e6", color: "#b25c00", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}>Coming soon</span>
        </div>
      </div>

      <div style={{ backgroundColor: "#222222", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
        <Key style={{ width: "32px", height: "32px", color: "#ffffff", margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", marginBottom: "16px" }}>Need a custom integration?</h2>
        <p style={{ fontSize: "16px", color: "#929292", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 32px" }}>
          Our enterprise plans include access to our robust GraphQL API so your developers can build custom compliance workflows.
        </p>
        <Link to="/contact">
          <button style={{ backgroundColor: "#ffffff", color: "#222222", border: "none", borderRadius: "8px", padding: "14px 24px", fontSize: "16px", fontWeight: 600, cursor: "pointer" }}>
            Contact Sales
          </button>
        </Link>
      </div>
    </div>
  );
}
