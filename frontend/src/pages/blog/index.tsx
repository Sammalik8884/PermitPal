import { Link } from "react-router-dom";
import { blogPosts } from "./blogData";

export default function BlogPage() {
  return (
    <div style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "64px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#222222", letterSpacing: "-1.5px", marginBottom: "24px" }}>
          PermitPal Blog
        </h1>
        <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5, maxWidth: "600px", margin: "0 auto" }}>
          The latest strategies, regulatory news, and compliance guides for short-term rental operators.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
        {blogPosts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }} className="group">
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ width: "100%", height: "240px", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }} 
                  className="group-hover:scale-105"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ff385c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {post.category}
                </span>
                <span style={{ fontSize: "12px", color: "#929292" }}>•</span>
                <span style={{ fontSize: "14px", color: "#6a6a6a" }}>{post.readTime}</span>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#222222", marginBottom: "12px", lineHeight: 1.3 }}>
                {post.title}
              </h2>
              <p style={{ fontSize: "16px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "24px", flex: 1 }}>
                {post.excerpt}
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, color: "#222222" }}>
                  {post.author.avatarInitials}
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#222222" }}>{post.author.name}</p>
                  <p style={{ fontSize: "14px", color: "#6a6a6a" }}>{post.date}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
