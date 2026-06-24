import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Clock, Tag } from "lucide-react";
import { getBlogPostBySlug, blogPosts } from "./blogData";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug ?? "");

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const related = blogPosts.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Hero */}
      <div style={{
        width: "100%",
        height: "420px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "0",
      }}>
        <img
          src={post.imageUrl}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
        }} />
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "40px 24px",
          maxWidth: "860px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}>
          <div style={{ maxWidth: "860px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                backgroundColor: "#ff385c",
                color: "#ffffff",
                padding: "4px 12px",
                borderRadius: "9999px",
              }}>
                {post.category}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                <Clock style={{ width: "14px", height: "14px" }} /> {post.readTime}
              </span>
            </div>
            <h1 style={{
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-1px",
              lineHeight: 1.2,
              margin: 0,
            }}>
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Back link */}
        <Link
          to="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#6a6a6a",
            textDecoration: "none",
            marginBottom: "32px",
          }}
        >
          <ArrowLeft style={{ width: "16px", height: "16px" }} />
          Back to Blog
        </Link>

        {/* Author bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #ebebeb",
          borderBottom: "1px solid #ebebeb",
          padding: "16px 0",
          marginBottom: "48px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#ff385c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#ffffff",
              flexShrink: 0,
            }}>
              {post.author.avatarInitials}
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#222222", margin: 0 }}>
                {post.author.name}
              </p>
              <p style={{ fontSize: "14px", color: "#6a6a6a", margin: 0 }}>
                {post.author.role} &middot; {post.date}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            style={{
              background: "none",
              border: "1px solid #dddddd",
              borderRadius: "8px",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              color: "#222222",
            }}
          >
            <Share2 style={{ width: "14px", height: "14px" }} /> Share
          </button>
        </div>

        {/* Article body */}
        <div
          style={{
            fontSize: "17px",
            lineHeight: 1.8,
            color: "#333333",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Divider */}
        <div style={{ borderTop: "1px solid #ebebeb", margin: "64px 0 48px" }} />

        {/* CTA */}
        <div style={{
          backgroundColor: "#222222",
          borderRadius: "16px",
          padding: "48px 40px",
          textAlign: "center",
          marginBottom: "64px",
        }}>
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", marginBottom: "12px" }}>
            Stop worrying about compliance
          </h3>
          <p style={{ fontSize: "16px", color: "#929292", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" }}>
            PermitPal tracks your permits, night caps, and regulatory deadlines automatically — so you never get hit with a surprise fine.
          </p>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button style={{
              backgroundColor: "#ff385c",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "14px 28px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}>
              Start Free — No Credit Card
            </button>
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#222222", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Tag style={{ width: "20px", height: "20px", color: "#ff385c" }} /> Related Articles
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
              {related.map((rel) => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    border: "1px solid #ebebeb",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "none"}
                  >
                    <img src={rel.imageUrl} alt={rel.title} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                    <div style={{ padding: "16px" }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: "#ff385c", textTransform: "uppercase", marginBottom: "6px" }}>{rel.category}</p>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#222222", lineHeight: 1.3 }}>{rel.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
