import type { ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
  return (
    <Box
      sx={{
        bgcolor: "grey.900",
        color: "common.white",
        py: { xs: 5, md: 7 },
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        "& .swiper-button-next, & .swiper-button-prev": {
          color: "white",
        },
        "& .swiper-button-next:after, & .swiper-button-prev:after": {
          fontSize: 18,
          fontWeight: 700,
        },
      }}
    >
      <Container>
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>
          {overline}
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          sx={{ mt: 0.5, mb: 2, fontWeight: 800 }}
        >
          {title}
        </Typography>

        {items.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={16}
            slidesPerView={1.15}
            breakpoints={breakpoints}
          >
            {items.map((item) => (
              <SwiperSlide key={getKey(item)}>{renderSlide(item)}</SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Typography sx={{ opacity: 0.8 }}>{emptyText}</Typography>
        )}
      </Container>
    </Box>
  );
}
