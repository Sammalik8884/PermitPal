import { Link } from "react-router-dom";
import { blogPosts } from "./blogData";

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Compliance":     { bg: "#fff0ef", text: "#c13515" },
  "Tax & Finance":  { bg: "#f0f7ff", text: "#1a5fab" },
  "Software & Tools":{ bg: "#f0faf4", text: "#1a7a40" },
  "Licensing & Permits":{ bg: "#fdf6e3", text: "#b25c00" },
  "Regulations":    { bg: "#f5f0ff", text: "#6b21a8" },
  "Operations":     { bg: "#fef2f2", text: "#991b1b" },
};

export default function BlogPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "72px" }}>
        <h1 style={{
          fontSize: "52px",
          fontWeight: 800,
          color: "#222222",
          letterSpacing: "-2px",
          marginBottom: "20px",
          lineHeight: 1.1,
        }}>
          PermitPal Blog
        </h1>
        <p style={{
          fontSize: "20px",
          color: "#6a6a6a",
          lineHeight: 1.6,
          maxWidth: "600px",
          margin: "0 auto",
        }}>
          Expert guides on STR compliance, taxes, permits, and regulations — written by 30-year industry veterans.
        </p>
      </div>

      {/* Article Count */}
      <p style={{ fontSize: "14px", color: "#929292", marginBottom: "32px", fontWeight: 500 }}>
        {blogPosts.length} articles
      </p>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: "40px",
      }}>
        {blogPosts.map((post) => {
          const catStyle = categoryColors[post.category] || { bg: "#f7f7f7", text: "#222222" };
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: "1px solid #ebebeb",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  backgroundColor: "#ffffff",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.10)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: "100%", height: "200px", overflow: "hidden", flexShrink: 0 }}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>

                {/* Body */}
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Category + Read time */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      backgroundColor: catStyle.bg,
                      color: catStyle.text,
                      padding: "3px 10px",
                      borderRadius: "9999px",
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "13px", color: "#929292" }}>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#222222",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p style={{
                    fontSize: "15px",
                    color: "#6a6a6a",
                    lineHeight: 1.55,
                    marginBottom: "20px",
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "auto", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "#ff385c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#ffffff",
                      flexShrink: 0,
                    }}>
                      {post.author.avatarInitials}
                    </div>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#222222", margin: 0 }}>{post.author.name}</p>
                      <p style={{ fontSize: "12px", color: "#929292", margin: 0 }}>{post.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
