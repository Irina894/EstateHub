// src/pages/ContactsPage.jsx
import React, { useState } from "react";
import {
  Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Mail, Phone, MapPin, MessageCircle, Send, Sparkles, ArrowRight, ArrowLeft,
  Clock, Globe, User, Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import useTokens from "../hooks/useTokens";

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email us",
    value: "support@estatehub.local",
    href: "mailto:support@estatehub.local",
    description: "We typically reply within 2 hours",
    accent: "#3b82f6",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+380 00 000 00 00",
    href: "tel:+380000000000",
    description: "Mon–Fri, 9:00 – 18:00 (EET)",
    accent: "#22c55e",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Chernivtsi, Ukraine",
    href: null,
    description: "By appointment only",
    accent: "#a855f7",
  },
];

/* ── inline бренд-SVG (lucide прибрав ці іконки у новіших версіях) ── */
const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const SOCIAL = [
  { Icon: FacebookIcon,  label: "Facebook",  href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: XIcon,         label: "X",         href: "#" },
  { Icon: LinkedinIcon,  label: "LinkedIn",  href: "#" },
];

export default function ContactsPage() {
  const theme  = useTheme();
  const tokens = useTokens();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const goBack = () =>
    window.history.length > 1 ? navigate(-1) : navigate("/");

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    // backend endpoint not implemented here — fake success
    setTimeout(() => {
      setSending(false);
      setSuccessOpen(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 900);
  };

  return (
    <MainLayout>
      {/* ════════════ HERO ════════════ */}
      <Box
        sx={{
          position: "relative",
          background: tokens.gradient.hero,
          overflow: "hidden",
          py: { xs: 8, md: 12 },
          px: { xs: 3, md: 5 },
        }}
      >
        {[
          { size: 460, top: -140, right: -120, opacity: 0.22 },
          { size: 320, bottom: -120, left: -80, opacity: 0.16 },
        ].map((o, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: o.size,
              height: o.size,
              top: o.top, right: o.right, bottom: o.bottom, left: o.left,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.palette.primary.main}, transparent 70%)`,
              opacity: o.opacity,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
        ))}

        

        {/* ── Back button ── */}
        <Button
          onClick={goBack}
          startIcon={<ArrowLeft size={15} />}
          sx={{
            position: "absolute",
            top: { xs: 16, md: 24 },
            left: { xs: 16, md: 32 },
            zIndex: 2,
            color: "rgba(255,255,255,0.85)",
            ...tokens.glass.dark,
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "999px",
            px: 2,
            py: 0.85,
            fontSize: "0.82rem",
            fontWeight: 600,
            transition: `all 0.22s ${tokens.ease.out}`,
            "&:hover": {
              background: "rgba(255,255,255,0.16)",
              color: "#fff",
              borderColor: "rgba(255,255,255,0.32)",
              transform: "translateX(-2px)",
            },
          }}
        >
          Back
        </Button>

        <Box sx={{ maxWidth: 820, mx: "auto", position: "relative", zIndex: 1, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.75,
              py: 0.65,
              borderRadius: "99px",
              ...tokens.glass.dark,
              mb: 3,
            }}
          >
            <MessageCircle size={13} color={theme.palette.primary.light} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Get in touch
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.05,
              mb: 2.5,
              letterSpacing: "-0.04em",
            }}
          >
            Let's start a{" "}
            <Box
              component="span"
              sx={{
                background: tokens.gradient.accent,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              conversation.
            </Box>
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              maxWidth: 580,
              mx: "auto",
            }}
          >
            Have questions about a property, our platform, or a partnership? Our team is ready to help.
          </Typography>
        </Box>
      </Box>

      {/* ════════════ CONTACT METHODS ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, mt: { xs: -5, md: -8 }, mb: { xs: 6, md: 10 }, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {CONTACT_METHODS.map((m, i) => {
            const Icon = m.icon;
            const Wrapper = m.href ? "a" : "div";
            return (
              <Box
                key={i}
                component={Wrapper}
                href={m.href || undefined}
                sx={{
                  background: "background.paper",
                  borderRadius: `${tokens.radius.lg}px`,
                  border: "1px solid",
                  borderColor: "divider",
                  p: 3.5,
                  pb: 3.5,
                  boxShadow: tokens.shadow.md,
                  textDecoration: "none",
                  display: "block",
                  cursor: m.href ? "pointer" : "default",
                  transition: `all 0.3s ${tokens.ease.out}`,
                  animation: `fade-up 0.55s ${tokens.ease.out} both`,
                  animationDelay: `${i * 80}ms`,
                  "&:hover": m.href ? {
                    transform: "translateY(-4px)",
                    boxShadow: tokens.shadow.lg,
                    borderColor: alpha(m.accent, 0.3),
                    "& .cm-arrow": { opacity: 1, transform: "translate(2px,-2px)" },
                  } : {},
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2.25 }}>
                  <Box
                    sx={{
                      width: 46, height: 46,
                      borderRadius: `${tokens.radius.md}px`,
                      background: `linear-gradient(135deg, ${alpha(m.accent, 0.18)}, ${alpha(m.accent, 0.04)})`,
                      color: m.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${alpha(m.accent, 0.2)}`,
                    }}
                  >
                    <Icon size={20} />
                  </Box>
                  {m.href && (
                    <ArrowRight
                      size={16}
                      className="cm-arrow"
                      color={theme.palette.text.disabled}
                      style={{ opacity: 0.5, transition: `all 0.3s ${tokens.ease.out}`, transform: "rotate(-45deg)" }}
                    />
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: "text.disabled",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  {m.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "text.primary",
                    mb: 0.75,
                    wordBreak: "break-word",
                  }}
                >
                  {m.value}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", lineHeight: 1.6 }}>
                  {m.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ════════════ FORM + SIDE INFO ════════════ */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 4 }, mb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              background: "background.paper",
              borderRadius: `${tokens.radius.lg}px`,
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3, md: 4 },
              boxShadow: tokens.shadow.sm,
              animation: tokens.anim.fadeUp,
            }}
          >
            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Send size={16} color={theme.palette.primary.main} />
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.05rem", textAlign: "left" }}>
                  Send us a message
                </Typography>
              </Box>
              
              {/* pl: "24px" (16px іконка + 8px gap) вирівнює цей текст точно під верхнім */}
              <Typography sx={{ color: "text.secondary", fontSize: "0.88rem", pl: "24px", textAlign: "left" }}>
                Fill out the form and we'll get back to you within 24 hours.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Your name"
                  name="name"
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={18} color={theme.palette.text.disabled} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Email address"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color={theme.palette.text.disabled} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <TextField
                label="Subject"
                name="subject"
                fullWidth
                required
                value={formData.subject}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MessageCircle size={18} color={theme.palette.text.disabled} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Your message"
                name="message"
                fullWidth
                required
                multiline
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help…"
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={sending}
                endIcon={!sending && <Send size={15} />}
                sx={{
                  py: 1.8,
                  mt: 1,
                  fontSize: "0.95rem",
                  borderRadius: "12px",
                }}
              >
                {sending ? "Sending…" : "Send message"}
              </Button>
            </Box>
          </Box>

          {/* Side info */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              animation: tokens.anim.fadeUp,
              animationDelay: "120ms",
              animationFillMode: "both",
            }}
          >
            {/* Hours card */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid",
                borderColor: "divider",
                p: 2.75,
                boxShadow: tokens.shadow.sm,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Clock size={15} color={theme.palette.text.secondary} />
                <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9rem" }}>
                  Office Hours
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {[
                  ["Monday – Friday", "9:00 – 18:00"],
                  ["Saturday",        "10:00 – 16:00"],
                  ["Sunday",          "Closed"],
                ].map(([day, hours], i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>{day}</Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "text.primary", fontWeight: 600 }}>{hours}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Languages card */}
            <Box
              sx={{
                background: tokens.gradient.accentSoft,
                borderRadius: `${tokens.radius.lg}px`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                p: 2.75,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -30, right: -30,
                  width: 100, height: 100,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.18)}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />
              <Box sx={{ position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Globe size={15} color={theme.palette.primary.main} />
                  <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.9rem" }}>
                    We speak
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {["🇺🇦 Ukrainian", "🇬🇧 English", "🇵🇱 Polish"].map((lang) => (
                    <Box
                      key={lang}
                      sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: "99px",
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.primary.main, 0.15),
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "text.primary",
                      }}
                    >
                      {lang}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Social card */}
            <Box
              sx={{
                background: "background.paper",
                borderRadius: `${tokens.radius.lg}px`,
                border: "1px solid",
                borderColor: "divider",
                p: 2.75,
                boxShadow: tokens.shadow.sm,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: "0.9rem",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Follow us
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1.25 }}>
                {SOCIAL.map((s, i) => {
                  const Icon = s.Icon;
                  return (
                    <Box
                      key={i}
                      component="a"
                      href={s.href}
                      aria-label={s.label}
                      sx={{
                        width: 40, height: 40,
                        borderRadius: `${tokens.radius.sm}px`,
                        background: alpha(theme.palette.text.primary, 0.04),
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.text.secondary,
                        textDecoration: "none",
                        transition: `all 0.22s ${tokens.ease.out}`,
                        "&:hover": {
                          background: tokens.gradient.accent,
                          color: "#fff",
                          transform: "translateY(-2px)",
                          borderColor: "transparent",
                          boxShadow: tokens.shadow.accent,
                        },
                      }}
                    >
                      <Icon />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ borderRadius: `${tokens.radius.md}px`, fontWeight: 600 }}>
          Message sent! We'll get back to you shortly.
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}