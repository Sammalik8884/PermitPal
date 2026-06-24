export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  category: string;
  imageUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "navigating-night-caps-eu",
    title: "Navigating Night Caps in the European Union",
    excerpt: "Cities like Paris, London, and Amsterdam have strict night caps. Learn how to automate your tracking to avoid hefty fines.",
    content: `
      <p>Short-term rentals have fundamentally changed how people travel. But with this rapid growth, major European cities have introduced strict regulations to protect housing markets.</p>
      <h2>London's 90-Day Rule</h2>
      <p>In Greater London, you cannot rent out your entire property on a short-term basis for more than 90 nights in a calendar year without planning permission. If you exceed this limit, you could face enforcement action from your local council, which often results in fines of up to £20,000.</p>
      <h2>Paris' 120-Day Limit</h2>
      <p>Paris allows primary residences to be rented out for a maximum of 120 days per year. The city requires hosts to register their property and display a registration number on their listing. Exceeding the cap can result in fines reaching €50,000 per property.</p>
      <h2>Amsterdam's 30-Day Limit</h2>
      <p>Amsterdam has some of the strictest rules in the world. You can only rent your home for a maximum of 30 nights a year to no more than four people at a time. A permit is mandatory.</p>
      <h2>How PermitPal Helps</h2>
      <p>Tracking these nights manually via spreadsheets is risky. By syncing your Airbnb and Vrbo iCals directly into PermitPal, we calculate your total nights booked and alert you well before you hit your local limit.</p>
    `,
    date: "May 12, 2026",
    readTime: "4 min read",
    author: {
      name: "Emma Richards",
      role: "Compliance Expert",
      avatarInitials: "ER"
    },
    category: "Regulations",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "us-str-tax-compliance-2026",
    title: "The 2026 Guide to US STR Tax Compliance",
    excerpt: "An overview of Transient Occupancy Taxes (TOT) and how property managers can ensure they are fully compliant.",
    content: `
      <p>When operating a short-term rental in the United States, federal income tax is just the beginning. Local municipalities rely heavily on Transient Occupancy Taxes (TOT), lodging taxes, or hotel taxes.</p>
      <h2>What is Transient Occupancy Tax (TOT)?</h2>
      <p>TOT is a tax charged to travelers when they rent accommodations for short periods (usually under 30 days). The host or property manager is responsible for collecting this tax from the guest and remitting it to the local tax authority.</p>
      <h2>Does Airbnb collect it for me?</h2>
      <p>In many jurisdictions, platforms like Airbnb and Vrbo have agreements to automatically collect and remit these taxes. However, this is not universal. You must verify whether your specific city or county is covered. If you accept direct bookings, you are entirely responsible for collection and remittance.</p>
      <h2>Penalties for Non-Compliance</h2>
      <p>Failing to remit TOT can result in severe penalties, including back taxes, interest, and the revocation of your operating permit.</p>
      <h2>Automating Your Records</h2>
      <p>PermitPal's US Tax module allows you to securely store your tax remittance receipts and tracks your upcoming filing deadlines, ensuring you never miss a payment.</p>
    `,
    date: "April 28, 2026",
    readTime: "5 min read",
    author: {
      name: "Michael Chen",
      role: "Tax Specialist",
      avatarInitials: "MC"
    },
    category: "Tax & Finance",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
  },
  {
    slug: "how-to-manage-multiple-jurisdictions",
    title: "Scaling Your Property Management Agency Across Borders",
    excerpt: "Managing properties in different cities means different rules. Here is how top agencies manage the compliance chaos.",
    content: `
      <p>As your property management company grows, you'll inevitably expand into new cities or even new countries. While scaling revenue is exciting, scaling compliance is often a nightmare.</p>
      <h2>The Fragmented Regulatory Landscape</h2>
      <p>There is no universal standard for short-term rental laws. City A might require a fire inspection and a $500 annual permit fee. City B might have a 90-day night cap. City C might ban STRs in certain zoning districts entirely.</p>
      <h2>Building a Compliance Standard Operating Procedure (SOP)</h2>
      <p>Top agencies assign a dedicated compliance officer. Their job is to:</p>
      <ul>
        <li>Research zoning laws before taking on new properties.</li>
        <li>Maintain a centralized calendar of permit expiration dates.</li>
        <li>Ensure listing platforms display the correct registration numbers.</li>
      </ul>
      <h2>Centralizing with Technology</h2>
      <p>Spreadsheets break down when you reach 20+ properties. PermitPal provides a centralized dashboard where you can see the compliance status of your entire global portfolio at a glance.</p>
    `,
    date: "April 15, 2026",
    readTime: "6 min read",
    author: {
      name: "Sarah Jenkins",
      role: "Operations Lead",
      avatarInitials: "SJ"
    },
    category: "Operations",
    imageUrl: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=800&q=80"
  }
];
