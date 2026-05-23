// src/pages/OwnerApplicationsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Alert, Box, Typography, Skeleton, MenuItem, Select, FormControl,
  TextField,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  ClipboardList, User, Mail, Phone, MessageSquare, Building2, Clock,
  Hourglass, CheckCircle, XCircle, Eye, Filter, Search, Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import EmptyState from "../components/ui/EmptyState";
import { getOwnerApplications, updateApplicationStatus } from "../api/applicationApi";
import useTokens from "../hooks/useTokens";

const STATUS_CONFIG = {
  new:       { label: "New",       icon: Hourglass,   color: "#3b82f6", bg: "rgba(59,130,246,0.10)" },
  pending:   { label: "Pending",   icon: Hourglass,   color: "#b45309", bg: "rgba(245,158,11,0.10)" },
  in_review: { label: "In Review", icon: Eye,         color: "#7c3aed", bg: "rgba(168,85,247,0.10)" },
  reviewed:  { label: "Reviewed",  icon: Eye,         color: "#E65100", bg: "rgba(230,81,0,0.10)" },
  approved:  { label: "Approved",  icon: CheckCircle, color: "#15803d", bg: "rgba(34,197,94,0.10)" },
  rejected:  { label: "Rejected",  icon: XCircle,     color: "#dc2626", bg: "rgba(239,68,68,0.10)" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status || "Unknown",
    icon: Clock,
    color: "#616161",
    bg: alpha("#000", 0.05),
  };
  const Icon = cfg.icon;
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.25,
        py: 0.4,
        borderRadius: "8px",
        background: cfg.bg,
        color: cfg.color,
        fontWeight: 700,
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        border: `1px solid ${cfg.color}22`,
      }}
    >
      <Icon size={12} />
      {cfg.label}
    </Box>
  );
}

/* ───────────────────────────────────────────────────────────────────── */

function ApplicationCard({ application, onStatusChange, index }) {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  const property = application.propertyId || application.property || {};
  const client   = application.clientId || application.client || {};

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(application._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box
      sx={{
        background: "background.paper",
        borderRadius: `${tokens.radius.lg}px`,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: tokens.shadow.sm,
        overflow: "hidden",
        transition: `all 0.25s ${tokens.ease.out}`,
        animation: `fade-up 0.5s ${tokens.ease.out} both`,
        animationDelay: `${Math.min(index, 6) * 60}ms`,
        "&:hover": {
          boxShadow: tokens.shadow.md,
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      {/* Property header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2.5,
          background: alpha(theme.palette.primary.main, 0.03),
          borderBottom: "1px solid",
          borderColor: "divider",
          cursor: property._id ? "pointer" : "default",
          transition: `background 0.2s ${tokens.ease.out}`,
          "&:hover": property._id ? { background: alpha(theme.palette.primary.main, 0.06) } : {},
        }}
        onClick={() => property._id && navigate(`/properties/${property._id}`)}
      >
        <Box
          sx={{
            width: 44, height: 44,
            borderRadius: `${tokens.radius.sm}px`,
            background: property.images?.[0]
              ? `url(${property.images[0]}) center/cover`
              : alpha(theme.palette.text.primary, 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: theme.palette.text.disabled,
          }}
        >
          {!property.images?.[0] && <Building2 size={20} />}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.95rem", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
            {property.title || "Property"}
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "text.disabled", textAlign: "left" }}>
            {property.city ? `${property.city} • ` : ""}
            ${property.price?.toLocaleString() || "—"}
          </Typography>
        </Box>
        <StatusBadge status={application.status} />
      </Box>

      {/* Client info */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <User size={14} color={theme.palette.text.disabled} />
          <Typography sx={{ fontSize: "0.72rem", color: "text.disabled", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Applicant
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
            gap: 2,
            mb: application.message ? 3 : 1,
          }}
        >
          {/* name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32, height: 32,
                borderRadius: `${tokens.radius.sm}px`,
                background: tokens.gradient.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={14} color="#fff" />
            </Box>
            <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>
                Name
              </Typography>
              <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.88rem", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                {client.name || "—"}
              </Typography>
            </Box>
          </Box>

          {/* email */}
          {client.email && (
            <Box
              component="a"
              href={`mailto:${client.email}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
                "&:hover .email-text": { color: "primary.main" },
              }}
            >
              <Box
                sx={{
                  width: 32, height: 32,
                  borderRadius: `${tokens.radius.sm}px`,
                  background: alpha("#3b82f6", 0.12),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#3b82f6",
                  flexShrink: 0,
                }}
              >
                <Mail size={14} />
              </Box>
              <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>
                  Email
                </Typography>
                <Typography
                  className="email-text"
                  sx={{
                    fontWeight: 600, color: "text.primary", fontSize: "0.85rem", textAlign: "left",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%",
                    transition: "color 0.15s",
                  }}
                >
                  {client.email}
                </Typography>
              </Box>
            </Box>
          )}

          {/* phone */}
          {application.phone && (
            <Box
              component="a"
              href={`tel:${application.phone}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "inherit",
                "&:hover .phone-text": { color: "primary.main" },
              }}
            >
              <Box
                sx={{
                  width: 32, height: 32,
                  borderRadius: `${tokens.radius.sm}px`,
                  background: alpha("#22c55e", 0.12),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#22c55e",
                  flexShrink: 0,
                }}
              >
                <Phone size={14} />
              </Box>
              <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>
                  Phone
                </Typography>
                <Typography className="phone-text" sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.85rem", textAlign: "left", transition: "color 0.15s" }}>
                  {application.phone}
                </Typography>
              </Box>
            </Box>
          )}

          {/* date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32, height: 32,
                borderRadius: `${tokens.radius.sm}px`,
                background: alpha("#a855f7", 0.12),
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#a855f7",
                flexShrink: 0,
              }}
            >
              <Clock size={14} />
            </Box>
            <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "left" }}>
                Applied
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.85rem", textAlign: "left" }}>
                {application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Message */}
        {application.message && (
          <Box
            sx={{
              background: alpha(theme.palette.text.primary, 0.03),
              borderRadius: `${tokens.radius.sm}px`,
              p: 2,
              mb: 2,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
              <MessageSquare size={12} color={theme.palette.text.disabled} />
              <Typography sx={{ fontSize: "0.7rem", color: "text.disabled", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                Message
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", lineHeight: 1.65, textAlign: "left" }}>
              {application.message}
            </Typography>
          </Box>
        )}

        {/* status dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", fontWeight: 600, textAlign: "left" }}>
            Update status:
          </Typography>
          <FormControl size="small" sx={{ width: 180 }}>
            <Select
              value={application.status?.toLowerCase() || "new"}
              onChange={(e) => handleStatus(e.target.value)}
              disabled={updating}
              sx={{
                borderRadius: `${tokens.radius.sm}px`,
                fontSize: "0.85rem",
                fontWeight: 600,
                textAlign: "left", // Текст всередині dropdown
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha(theme.palette.primary.main, 0.4) },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.primary.main },
              }}
              SelectProps={{
                MenuProps: { disableScrollLock: true },
              }}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="in_review">In Review</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main page
   ──────────────────────────────────────────────────────────────────────── */
export default function OwnerApplicationsPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOwnerApplications();
      setApplications(Array.isArray(data) ? data : data?.applications || []);
    } catch (err) {
      if (err?.response?.status !== 401) {
        setError("Failed to load applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      setError("Failed to update application status");
    }
  };

  const filtered = applications.filter((a) => {
    if (filter !== "all" && a.status?.toLowerCase() !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const t = (a.propertyId?.title || a.property?.title || "").toLowerCase();
      const n = (a.clientId?.name    || a.client?.name    || "").toLowerCase();
      const e = (a.clientId?.email   || a.client?.email   || "").toLowerCase();
      if (!t.includes(q) && !n.includes(q) && !e.includes(q)) return false;
    }
    return true;
  });

  const counts = {
    all:       applications.length,
    new:       applications.filter((a) => a.status?.toLowerCase() === "new").length,
    in_review: applications.filter((a) => a.status?.toLowerCase() === "in_review").length,
    approved:  applications.filter((a) => a.status?.toLowerCase() === "approved").length,
    rejected:  applications.filter((a) => a.status?.toLowerCase() === "rejected").length,
  };

  const FILTERS = [
    { key: "all",       label: "All" },
    { key: "new",       label: "New" },
    { key: "in_review", label: "In Review" },
    { key: "approved",  label: "Approved" },
    { key: "rejected",  label: "Rejected" },
  ];

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 4, animation: tokens.anim.fadeUp }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: `${tokens.radius.md}px`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ClipboardList size={18} color={theme.palette.primary.main} />
            </Box>
            <Typography variant="h4" sx={{ color: "text.primary", fontWeight: 700, lineHeight: 1.15, textAlign: "left" }}>
              Applications
            </Typography>
          </Box>
          <Typography sx={{ color: "text.disabled", fontSize: "0.9rem", pl: "58px", textAlign: "left" }}>
            {loading ? "Loading…" : `${applications.length} total • ${counts.new + counts.in_review} need review`}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>{error}</Alert>}

        {/* Filters + search */}
        {!loading && applications.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
              mb: 3,
              animation: tokens.anim.fadeUp,
              animationDelay: "80ms",
              animationFillMode: "both",
            }}
          >
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", justifyContent: "flex-start" }}>
              {FILTERS.map((f) => {
                const active = filter === f.key;
                return (
                  <Box
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "99px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      background: active ? tokens.gradient.accent : "background.paper",
                      color: active ? "#fff" : theme.palette.text.secondary,
                      border: "1px solid",
                      borderColor: active ? "transparent" : "divider",
                      boxShadow: active ? tokens.shadow.accent : "none",
                      transition: `all 0.2s ${tokens.ease.out}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      "&:hover": {
                        background: active ? tokens.gradient.accent : alpha(theme.palette.primary.main, 0.04),
                        borderColor: active ? "transparent" : alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    {f.label}
                    <Box
                      sx={{
                        background: active ? "rgba(255,255,255,0.25)" : alpha(theme.palette.text.primary, 0.06),
                        color: active ? "#fff" : theme.palette.text.disabled,
                        px: 0.85,
                        py: 0.05,
                        borderRadius: "99px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {counts[f.key]}
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <TextField
              size="small"
              placeholder="Search applicant or property…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ ml: { md: "auto" }, minWidth: { md: 280 } }}
              InputProps={{
                startAdornment: (
                  <Search
                    size={15}
                    color={theme.palette.text.disabled}
                    style={{ marginRight: 8, flexShrink: 0 }}
                  />
                ),
              }}
            />
          </Box>
        )}

        {/* body */}
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={260} sx={{ borderRadius: `${tokens.radius.lg}px` }} animation="wave" />
            ))}
          </Box>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={36} color={theme.palette.primary.main} strokeWidth={1.5} />}
            title="No applications yet"
            description="When clients apply to your properties, they'll appear here."
            actionLabel="Browse Catalog"
            onAction={() => navigate("/properties")}
          />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
              background: "background.paper",
              borderRadius: `${tokens.radius.lg}px`,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Filter size={32} color={theme.palette.text.disabled} style={{ marginBottom: 12 }} />
            <Typography sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              No applications match your filters
            </Typography>
            <Typography sx={{ color: "text.disabled", fontSize: "0.88rem" }}>
              Try adjusting the filter or search query.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((app, i) => (
              <ApplicationCard
                key={app._id}
                application={app}
                index={i}
                onStatusChange={handleStatusChange}
              />
            ))}
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}