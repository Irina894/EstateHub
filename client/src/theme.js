// src/theme.js
import { createTheme, alpha } from "@mui/material/styles";

/**
 * Дизайн-система EstateHub.
 */

const ORANGE       = "#D95829";
const ORANGE_DARK  = "#A8401D";
const ORANGE_LIGHT = "#F18A5C";
const INK          = "#1F2937";   // м'який slate
const INK_SOFT     = "#4B5563";   // slate-600
const MUTED        = "#6B7280";   // slate-500
const SURFACE      = "#FFFFFF";
const SURFACE_ALT  = "#FAFAF9";
const BG           = "#F5F4F1";
const BORDER       = "rgba(31,41,55,0.08)";

export const tokens = {
  /* ── RADIUS SYSTEM ─────────────────────────────────────────────────── */
  radius: {
    xs:   6,
    sm:  10,
    md:  14,
    lg:  18,
    xl:  22,
    "2xl": 28,
    pill: 999,
  },

  shadow: {
    xs: "0 1px 2px rgba(38,38,38,0.04)",
    sm: "0 2px 8px rgba(38,38,38,0.06)",
    md: "0 4px 16px rgba(38,38,38,0.07), 0 1px 4px rgba(38,38,38,0.04)",
    lg: "0 12px 32px rgba(38,38,38,0.10), 0 4px 12px rgba(38,38,38,0.05)",
    xl: "0 24px 48px rgba(38,38,38,0.14), 0 8px 24px rgba(38,38,38,0.08)",
    accent: `0 8px 28px ${alpha(ORANGE, 0.35)}`,
    glow: `0 0 0 4px ${alpha(ORANGE, 0.12)}`,
  },

  gradient: {
    accent:     `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
    accentSoft: `linear-gradient(135deg, ${alpha(ORANGE, 0.12)} 0%, ${alpha(ORANGE_LIGHT, 0.04)} 100%)`,
    dark:       `linear-gradient(135deg, ${INK} 0%, #3D3D3D 100%)`,
    hero:       "linear-gradient(140deg, #05080D 0%, #263640 55%, #05080D 100%)",
    surface:    `linear-gradient(180deg, ${SURFACE} 0%, ${SURFACE_ALT} 100%)`,
  },

  glass: {
    light: {
      background: "rgba(255,255,255,0.65)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.8)",
    },
    dark: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(16px) saturate(180%)",
      WebkitBackdropFilter: "blur(16px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.14)",
    },
    overlay: {
      background: "rgba(38,38,38,0.55)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
    },
  },

  ease: {
    out:    "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut:  "cubic-bezier(0.65, 0, 0.35, 1)",
    snappy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  anim: {
    fadeUp: "fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both",
    fadeIn: "fade-in 0.45s ease-out both",
  },

  status: {
    success: { fg: "#15803d", bg: "rgba(34,197,94,0.10)" },
    warning: { fg: "#b45309", bg: "rgba(245,158,11,0.10)" },
    danger:  { fg: "#dc2626", bg: "rgba(239,68,68,0.10)" },
    info:    { fg: "#1d4ed8", bg: "rgba(59,130,246,0.10)" },
    purple:  { fg: "#7c3aed", bg: "rgba(168,85,247,0.10)" },
  },
};

const FONT_STACK = '"Plus Jakarta Sans", "Inter", "SF Pro Text", system-ui, sans-serif';

const theme = createTheme({
  tokens,

  palette: {
    mode: "light",
    primary:    { main: ORANGE, light: ORANGE_LIGHT, dark: ORANGE_DARK, contrastText: "#fff" },
    secondary:  { main: INK,    contrastText: "#fff" },
    background: { default: BG, paper: SURFACE },
    text:       { primary: INK, secondary: INK_SOFT, disabled: MUTED },
    divider:    BORDER,
    success:    { main: "#15803d" },
    warning:    { main: "#b45309" },
    error:      { main: "#dc2626" },
    info:       { main: "#1d4ed8" },
  },

  typography: {
    fontFamily: FONT_STACK,
    h1: { fontFamily: FONT_STACK, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.08 },
    h2: { fontFamily: FONT_STACK, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.14 },
    h3: { fontFamily: FONT_STACK, fontWeight: 600, letterSpacing: "-0.018em",  lineHeight: 1.22 },
    h4: { fontFamily: FONT_STACK, fontWeight: 600, letterSpacing: "-0.012em", lineHeight: 1.3 },
    h5: { fontFamily: FONT_STACK, fontWeight: 600, letterSpacing: "-0.008em", lineHeight: 1.4  },
    h6: { fontFamily: FONT_STACK, fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "0.005em", lineHeight: 1.45 },
    subtitle1: { fontWeight: 600 },
    button:    { fontWeight: 600, textTransform: "none", letterSpacing: "0.005em" },
    body1:     { lineHeight: 1.7,  fontSize: "0.95rem" },
    body2:     { lineHeight: 1.65, fontSize: "0.875rem" },
  },

  shape: { borderRadius: tokens.radius.md },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        :root { --ease-out: ${tokens.ease.out}; }
        * { box-sizing: border-box; }
        html, body {
          background-color: ${BG};
          font-family: ${FONT_STACK};
        }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        ::-webkit-scrollbar           { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${alpha(INK, 0.18)}; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: ${alpha(INK, 0.28)}; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }

        ::selection { background: ${alpha(ORANGE, 0.25)}; color: ${INK}; }
      `,
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          padding: "10px 22px",
          fontSize: "0.875rem",
          fontWeight: 600,
          transition: `all 0.22s ${tokens.ease.out}`,
        },
        containedPrimary: {
          background: tokens.gradient.accent,
          boxShadow: tokens.shadow.accent,
          fontWeight: 600,
          "&:hover": {
            background: `linear-gradient(135deg, ${ORANGE_DARK} 0%, ${ORANGE} 100%)`,
            boxShadow: `0 12px 32px ${alpha(ORANGE, 0.48)}`,
            transform: "translateY(-2px)",
          },
          "&:active": { transform: "translateY(0)" },
        },
        outlined: {
          borderColor: BORDER,
          color: INK,
          fontWeight: 600,
          "&:hover": {
            borderColor: alpha(ORANGE, 0.4),
            background: alpha(ORANGE, 0.04),
          },
        },
        text: {
          "&:hover": { background: alpha(ORANGE, 0.06) },
        },
      },
    },

    

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" } },
    },

    /* ════════════════════════════════════════════════════════════════
       УНІФІКОВАНА СИСТЕМА INPUT, СУМІСНА З REACT 19
       ════════════════════════════════════════════════════════════════ */
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          // Запобігаємо невалідній передачі технічних пропсів у нативний DOM
          "& .MuiOutlinedInput-root": {
            borderRadius: tokens.radius.sm,
            backgroundColor: "#fff",
            fontSize: "0.92rem",
            transition: `box-shadow 0.2s ${tokens.ease.out}, border-color 0.2s ${tokens.ease.out}`,

            "& fieldset": {
              borderColor: BORDER,
              borderWidth: "1.5px",
              transition: `border-color 0.18s ${tokens.ease.out}`,
            },
            "&:hover fieldset": {
              borderColor: alpha(ORANGE, 0.35),
            },
            "&.Mui-focused fieldset": {
              borderColor: ORANGE,
              borderWidth: "1.5px",
            },
            "&.Mui-focused": {
              boxShadow: tokens.shadow.glow,
            },
            "&.Mui-disabled": {
              backgroundColor: alpha(INK, 0.02),
            },
          },

          "& .MuiInputLabel-root": {
            fontSize: "0.92rem",
            color: INK_SOFT,
            "&.Mui-focused": { color: ORANGE },
          },

          "& .MuiOutlinedInput-input": {
            padding: "12px 14px",
          },
          "& .MuiOutlinedInput-input::placeholder": {
            color: MUTED,
            opacity: 1,
            fontWeight: 400,
          },

          "& .MuiFormHelperText-root": {
            marginLeft: 4,
            fontSize: "0.75rem",
            color: INK_SOFT,
          },
        },
      },
    },

    // Окремо фіксимо базові компоненти введення, через які й вилітали пропси
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          // Очищення внутрішніх MUI-пропсів, які конфліктують із React 19 DOM валідацією
          "&.MuiOutlinedInput-root": {
            borderRadius: tokens.radius.sm,
          }
        }
      }
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.sm,
        },
        select: {
          borderRadius: tokens.radius.sm,
          padding: "12px 14px",
        }
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.72rem", borderRadius: 8 },
      },
    },

    MuiSkeleton: {
      styleOverrides: { root: { backgroundColor: alpha(INK, 0.06) } },
    },

    MuiAlert: {
      styleOverrides: { root: { borderRadius: tokens.radius.md, fontWeight: 500 } },
    },

    MuiDivider: { styleOverrides: { root: { borderColor: BORDER } } },
  },
});

export default theme;