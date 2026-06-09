import * as React from "react";
import { NavLink } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;  // backwards compat: rendered as actions
  className?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, description, actions, children, className, breadcrumbs }: PageHeaderProps) {
  const rightSlot = actions || children;

  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "8px",
          }}
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#929292]" />}
              {crumb.href ? (
                <NavLink
                  to={crumb.href}
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#6a6a6a",
                    textDecoration: "none",
                  }}
                  className="hover:text-[#222222] transition-colors"
                >
                  {crumb.label}
                </NavLink>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#222222" }}>
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#222222",
              lineHeight: "1.43",
              marginBottom: description ? "4px" : "0",
            }}
          >
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: "16px", fontWeight: 400, color: "#6a6a6a", lineHeight: "1.5" }}>
              {description}
            </p>
          )}
        </div>
        {rightSlot && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
