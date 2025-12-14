import { useState, useId, useCallback } from "react";
import type { ReactNode } from "react";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";
import type { SwiperOptions } from "swiper/types";

type FeaturedCarouselProps<T> = {
  overline?: string;
  title: string;
  items: T[];
  getKey: (item: T) => string;
  renderSlide: (item: T) => ReactNode;
  emptyText?: string;
  breakpoints?: SwiperOptions["breakpoints"];
};

export default function FeaturedCarousel<T>({
  overline = "FEATURED",
  title,
  items,
  getKey,
  renderSlide,
  emptyText = "No items available.",
  breakpoints = {
    600: { slidesPerView: 2.2 },
    900: { slidesPerView: 4.2 },
  },
}: FeaturedCarouselProps<T>) {
  const uid = useId().replace(/:/g, "");
  const prevClass = `gc-prev-${uid}`;
  const nextClass = `gc-next-${uid}`;

  const [nav, setNav] = useState({
    canPrev: false,
    canNext: false,
    isBeginning: true,
    isEnd: false,
  });

  const updateNav = useCallback((s: SwiperType) => {
    setNav({
      canPrev: !s.isBeginning,
      canNext: !s.isEnd,
      isBeginning: s.isBeginning,
      isEnd: s.isEnd,
    });
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "#0b0b0b",
        color: "common.white",
        py: { xs: 5, md: 7 },
      }}
    >
      {/* Title area stays centered like GraphCommerce */}
      <Container
        maxWidth={false}
        sx={{ px: { xs: 2, md: 6, lg: 10 }, maxWidth: 1440 }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
          {overline}
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{ mt: 0.5, mb: 2.5, fontWeight: 800 }}
        >
          {title}
        </Typography>
      </Container>

      {items.length > 0 ? (
        // This wrapper is FULL WIDTH so arrows can sit at screen edges
        <Box sx={{ position: "relative", width: "100%", overflowX: "clip" }}>
          {/* LEFT arrow */}
          <IconButton
            className={`${prevClass} gcNav`}
            aria-label="Previous"
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: 44,
              height: 44,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "common.white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.70)" },
              display: { xs: "none", sm: nav.canPrev ? "inline-flex" : "none" },
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>

          {/* RIGHT arrow */}
          <IconButton
            className={`${nextClass} gcNav`}
            aria-label="Next"
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 3,
              width: 44,
              height: 44,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "common.white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.70)" },
              display: {
                xs: "none",
                sm: nav.canNext ? "inline-flex" : "none",
              },
            }}
          >
            <ArrowForwardIosRoundedIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              overflowX: "clip",
              "& .swiper": { overflow: "hidden" },
            }}
          >
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: `.${prevClass}`,
                nextEl: `.${nextClass}`,
              }}
              onSwiper={(s) => updateNav(s)}
              onSlideChange={(s) => updateNav(s)}
              onResize={(s) => updateNav(s)}
              spaceBetween={18}
              slidesPerView={1.15}
              breakpoints={breakpoints}
              style={{
                width: "100%",
                maxWidth: 1440,
                margin: "0 auto",
                paddingLeft: 16,
                paddingRight: 16,
                boxSizing: "border-box",
              }}
            >
              {items.map((item) => (
                <SwiperSlide key={getKey(item)}>
                  {renderSlide(item)}
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      ) : (
        <Container
          maxWidth={false}
          sx={{ px: { xs: 2, md: 6, lg: 10 }, maxWidth: 1440 }}
        >
          <Typography sx={{ opacity: 0.8 }}>{emptyText}</Typography>
        </Container>
      )}
    </Box>
  );
}
