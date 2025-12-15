import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, Container, Typography } from "@mui/material";

type HeroAction = {
  label: string;
  href: string;
  variant?: "contained" | "outlined" | "text";
};

type HeroProps = {
  imageSrc: string;
  imageAlt?: string;
  overline?: string;
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
};

export default function Hero({
  imageSrc,
  imageAlt = "",
  overline = "A STEP INTO STYLE",
  title,
  description,
  primaryAction,
  secondaryAction,
}: HeroProps) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 520, md: 740, lg: 820 },
        overflow: "hidden",
        borderRadius: 0,
        mb: { xs: 4, md: 6 },
      }}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 100%)",
        }}
      />

      <Container
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          pt: { xs: 8, md: 9 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", md: 980 },
            p: { xs: 3, md: 5 },
            ml: { xs: 0, md: -3 },
            bgcolor: "rgba(0,0,0,0.22)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 0,
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, opacity: 0.9, color: "common.white" }}
          >
            {overline}
          </Typography>

          <Typography
            component="h1"
            sx={{
              mt: 1,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: "common.white",
              fontSize: { xs: 44, sm: 62, md: 86 },
            }}
          >
            {title}
          </Typography>

          {description ? (
            <Typography
              sx={{
                mt: 2,
                maxWidth: 640,
                color: "rgba(255,255,255,0.88)",
                fontSize: { xs: 14, sm: 16, md: 18 },
              }}
            >
              {description}
            </Typography>
          ) : null}

          {(primaryAction || secondaryAction) && (
            <Box sx={{ mt: 3.5, display: "flex", gap: 2, flexWrap: "wrap" }}>
              {primaryAction && (
                <Button
                  variant={primaryAction.variant ?? "contained"}
                  color="inherit"
                  size="large"
                  component={Link}
                  href={primaryAction.href}
                  sx={{ px: 3.5, py: 1.25, fontWeight: 700 }}
                >
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction && (
                <Button
                  variant={secondaryAction.variant ?? "outlined"}
                  color="inherit"
                  size="large"
                  component={Link}
                  href={secondaryAction.href}
                  sx={{
                    px: 3.5,
                    py: 1.25,
                    fontWeight: 700,
                    borderColor: "rgba(255,255,255,0.6)",
                  }}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
