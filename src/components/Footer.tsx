import React from "react";
import { Box, Container, Divider, IconButton, Typography } from "@mui/material";
import Link from "next/link";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";

type FooterLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "top" | "bottom";
};

const FooterLink = ({ href, children, variant = "top" }: FooterLinkProps) => {
  const isTop = variant === "top";

  return (
    <Box
      component={Link}
      href={href}
      sx={{
        textDecoration: "none",
        color: isTop ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.85)",
        fontSize: isTop ? 16 : 14,
        fontWeight: isTop ? 500 : 400,
        "&:hover": { color: "#fff", textDecoration: "underline" },
      }}
    >
      {children}
    </Box>
  );
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        bgcolor: "#0b0b0b",
        color: "white",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 2fr" },
            gap: { xs: 3, md: 6 },
            alignItems: "start",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
              Massdata Commerce®
            </Typography>
            <Typography
              sx={{ mt: 1, opacity: 0.85, lineHeight: 1.7, fontSize: 14 }}
            >
              326 Broderick St., Los Angeles, CA 93107
              <br />
              Support: support@massdata.commerce
              <br />
              Phone: 435-221-6573
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 2.5 },
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, rowGap: 2 }}>
              <FooterLink href="#" variant="top">
                Brand/Sizes
              </FooterLink>
              <FooterLink href="#" variant="top">
                Newsletter
              </FooterLink>
              <FooterLink href="#" variant="top">
                Returns
              </FooterLink>
              <FooterLink href="#" variant="top">
                Shipping
              </FooterLink>
              <FooterLink href="#" variant="top">
                Customer service
              </FooterLink>
              <FooterLink href="#" variant="top">
                About Us
              </FooterLink>
              <FooterLink href="#" variant="top">
                Contact
              </FooterLink>
              <FooterLink href="#" variant="top">
                Careers
              </FooterLink>
            </Box>
          </Box>
        </Box>
      </Container>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />

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
            <FooterLink href="#" variant="bottom">
              Terms and conditions
            </FooterLink>
            <FooterLink href="#" variant="bottom">
              Credits
            </FooterLink>
            <FooterLink href="#" variant="bottom">
              Subscribe
            </FooterLink>
            <FooterLink href="#" variant="bottom">
              Remove account
            </FooterLink>
            <FooterLink href="#" variant="bottom">
              Newsletter
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
