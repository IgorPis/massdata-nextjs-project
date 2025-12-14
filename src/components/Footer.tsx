import React from "react";
import { Box, Container, Divider, IconButton, Typography } from "@mui/material";
import Link from "next/link";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";

const TopLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Box
    component={Link}
    href={href}
    sx={{
      textDecoration: "none",
      color: "rgba(255,255,255,0.9)",
      fontSize: 16,
      fontWeight: 500,
      "&:hover": { color: "#fff", textDecoration: "underline" },
    }}
  >
    {children}
  </Box>
);

const BottomLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Box
    component={Link}
    href={href}
    sx={{
      textDecoration: "none",
      color: "rgba(255,255,255,0.85)",
      fontSize: 14,
      "&:hover": { color: "#fff", textDecoration: "underline" },
    }}
  >
    {children}
  </Box>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "#0b0b0b",
        color: "white",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Top link area */}
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {/* Row 1 */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, rowGap: 2 }}>
            <TopLink href="#">Brand/Sizes</TopLink>
            <TopLink href="#">Newsletter</TopLink>
            <TopLink href="#">Returns</TopLink>
            <TopLink href="#">Shipping</TopLink>
            <TopLink href="#">Customer service</TopLink>
            <TopLink href="#">About Us</TopLink>
            <TopLink href="#">Contact</TopLink>
            <TopLink href="#">Careers</TopLink>
          </Box>
        </Box>
      </Container>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

      {/* Social icons */}
      <Container sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            aria-label="LinkedIn"
            sx={{ color: "rgba(255,255,255,0.9)" }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            aria-label="Facebook"
            sx={{ color: "rgba(255,255,255,0.9)" }}
          >
            <FacebookIcon />
          </IconButton>
          <IconButton aria-label="X" sx={{ color: "rgba(255,255,255,0.9)" }}>
            <XIcon />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            sx={{ color: "rgba(255,255,255,0.9)" }}
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Container>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

      {/* Bottom bar */}
      <Container sx={{ py: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
            © Massdata Commerce® {year}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5, rowGap: 1 }}>
            <BottomLink href="#">Terms and conditions</BottomLink>
            <BottomLink href="#">Credits</BottomLink>
            <BottomLink href="#">Subscribe</BottomLink>
            <BottomLink href="#">Remove account</BottomLink>
            <BottomLink href="#">Newsletter</BottomLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
