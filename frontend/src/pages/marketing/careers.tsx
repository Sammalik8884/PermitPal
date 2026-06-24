export default function CareersPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222222", letterSpacing: "-1.5px", marginBottom: "24px" }}>
        Join our team
      </h1>
      <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "64px" }}>
        Help us build the compliance infrastructure for the global short-term rental market. We are a fully remote team spanning 3 continents.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ border: "1px solid #ebebeb", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Senior Frontend Engineer</h3>
            <p style={{ fontSize: "14px", color: "#6a6a6a" }}>Remote (Americas / Europe) • Full-time</p>
          </div>
          <a href="mailto:careers@permitpal.com" style={{ backgroundColor: "#222222", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            Apply
          </a>
        </div>

        <div style={{ border: "1px solid #ebebeb", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Compliance Researcher</h3>
            <p style={{ fontSize: "14px", color: "#6a6a6a" }}>Remote (EU / AU) • Full-time</p>
          </div>
          <a href="mailto:careers@permitpal.com" style={{ backgroundColor: "#222222", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            Apply
          </a>
        </div>

        <div style={{ border: "1px solid #ebebeb", borderRadius: "12px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginBottom: "8px" }}>Product Designer</h3>
            <p style={{ fontSize: "14px", color: "#6a6a6a" }}>Remote (Anywhere) • Contract</p>
          </div>
          <a href="mailto:careers@permitpal.com" style={{ backgroundColor: "#222222", color: "#ffffff", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            Apply
          </a>
        </div>
      </div>
    </div>
  );
}
