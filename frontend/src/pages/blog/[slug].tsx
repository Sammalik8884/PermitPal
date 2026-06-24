import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";
import { blogPosts } from "./blogData";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div style={{ padding: "40px 24px 80px", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#222222", textDecoration: "none", marginBottom: "32px" }}>
        <ArrowLeft style={{ width: "16px", height: "16px" }} />
        Back to Blog
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#ff385c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {post.category}
        </span>
        <span style={{ fontSize: "12px", color: "#929292" }}>•</span>
        <span style={{ fontSize: "14px", color: "#6a6a6a" }}>{post.readTime}</span>
      </div>

      <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#222222", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "24px" }}>
        {post.title}
      </h1>

      <p style={{ fontSize: "20px", color: "#6a6a6a", lineHeight: 1.5, marginBottom: "32px" }}>
        {post.excerpt}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb", padding: "16px 0", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 600, color: "#222222" }}>
            {post.author.avatarInitials}
          </div>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#222222" }}>{post.author.name}</p>
            <p style={{ fontSize: "14px", color: "#6a6a6a" }}>{post.author.role} • {post.date}</p>
          </div>
        </div>
        <button style={{ background: "none", border: "1px solid #dddddd", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#222222" }}>
          <Share2 style={{ width: "16px", height: "16px" }} />
        </button>
      </div>

      <div style={{ width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", marginBottom: "48px" }}>
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </div>

      <div 
        className="prose prose-lg max-w-none text-[#4a4a4a] prose-headings:text-[#222222] prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-6 prose-p:leading-[1.7]"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
