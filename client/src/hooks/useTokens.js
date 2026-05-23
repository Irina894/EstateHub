// src/hooks/useTokens.js
import { useTheme } from "@mui/material/styles";
import { tokens as fallbackTokens } from "../theme";

/**
 * Безпечний доступ до дизайн-токенів.
 *
 * Перевагу віддає theme.tokens (якщо MUI зберіг кастомне поле — а так і має бути),
 * але якщо з якоїсь причини воно undefined (HMR-edge-case, неправильна обгортка
 * ThemeProvider, тощо), повертає експорт `tokens` напряму з theme.js. Так компоненти
 * НЕ падають з помилкою `Cannot read properties of undefined`.
 *
 * Використання:
 *   const tokens = useTokens();
 *   sx={{ background: tokens.gradient.accent }}
 */
export default function useTokens() {
  const theme = useTheme();
  return theme?.tokens || fallbackTokens;
}