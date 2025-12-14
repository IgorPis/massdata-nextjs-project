import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0b0b0b", paper: "#111" },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `${inter.style.fontFamily}, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#0b0b0b" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 999 } },
    },
    MuiContainer: { defaultProps: { maxWidth: "lg" } },
  },
});
