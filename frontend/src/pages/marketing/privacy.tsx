export default function PrivacyPolicyPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#222222", letterSpacing: "-1px", marginBottom: "16px" }}>
        Privacy Policy
      </h1>
      <p style={{ fontSize: "16px", color: "#6a6a6a", marginBottom: "48px" }}>Last updated: {new Date().toLocaleDateString()}</p>

      <div style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "24px" }}>
        <p>Your privacy is critically important to us. At PermitPal, we have a few fundamental principles:</p>
        <ul style={{ listStylePosition: "inside" }}>
          <li>We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services.</li>
          <li>We store personal information for only as long as we have a reason to keep it.</li>
          <li>We aim to make it as simple as possible for you to control what information on your website is shared publicly (or kept private), indexed by search engines, and permanently deleted.</li>
        </ul>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>Information We Collect</h2>
        <p>We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.</p>
        
        <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#222222", marginTop: "16px", marginBottom: "8px" }}>Information You Provide to Us</h3>
        <p>It's probably no surprise that we collect information that you provide to us. The amount and type of information depends on the context and how we use the information. Here are some examples:</p>
        <ul style={{ listStylePosition: "inside" }}>
          <li><strong>Basic Account Information:</strong> We ask for basic information from you in order to set up your account. For example, we require individuals who sign up for a PermitPal account to provide an email address and password, along with their name and country.</li>
          <li><strong>Property and Compliance Information:</strong> We collect the property details, permit numbers, and calendar feeds (iCal) that you provide to track compliance on your behalf.</li>
        </ul>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>Security</h2>
        <p>While no online service is 100% secure, we work very hard to protect information about you against unauthorized access, use, alteration, or destruction, and take reasonable measures to do so. All sensitive document vaults are encrypted at rest.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>Contact Us</h2>
        <p>If you have a question about this Privacy Policy, please contact us at privacy@permitpal.com.</p>
      </div>
    </div>
  );
}
