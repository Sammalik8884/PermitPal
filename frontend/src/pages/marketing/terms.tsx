export default function TermsOfServicePage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#222222", letterSpacing: "-1px", marginBottom: "16px" }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: "16px", color: "#6a6a6a", marginBottom: "48px" }}>Last updated: {new Date().toLocaleDateString()}</p>

      <div style={{ fontSize: "16px", color: "#4a4a4a", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: "24px" }}>
        <p>Welcome to PermitPal! By accessing or using our platform, you agree to be bound by these Terms of Service.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>1. Description of Service</h2>
        <p>PermitPal provides compliance monitoring, night cap tracking, and alert services for short-term rental operators. We provide tools to help you manage your regulatory obligations, but <strong>we do not provide legal advice</strong>. It is solely your responsibility to ensure you are complying with your local laws.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>2. User Responsibilities</h2>
        <p>You are responsible for the accuracy of the data you enter into PermitPal, including permit expiration dates, iCal links, and property addresses. We are not liable for fines incurred due to incorrect information provided by the user.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>3. Subscription and Billing</h2>
        <p>By selecting a premium plan, you agree to pay the monthly or annual subscription fees indicated for that service. Payments are charged on a pre-pay basis on the day you sign up and will cover the use of that service for the selected subscription period.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>4. Termination</h2>
        <p>We may terminate your access to all or any part of our Services at any time, with or without cause, with or without notice, effective immediately. If you wish to terminate this Agreement or your PermitPal account, you may simply discontinue using our Services.</p>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginTop: "24px", marginBottom: "16px" }}>5. Limitation of Liability</h2>
        <p>In no event will PermitPal, or its suppliers or licensors, be liable with respect to any subject matter of this Agreement under any contract, negligence, strict liability or other legal or equitable theory for: (i) any special, incidental or consequential damages; (ii) the cost of procurement for substitute products or services; or (iii) any fines, penalties, or legal fees incurred by the user.</p>
      </div>
    </div>
  );
}
