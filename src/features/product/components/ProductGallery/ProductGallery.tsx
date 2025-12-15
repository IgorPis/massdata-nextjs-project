import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Box, Paper } from "@mui/material";
import type { ProductImage } from "@/types/graphql";

export default function ProductGallery({
  gallery,
  imageBase,
  productName,
}: {
  gallery: ProductImage[];
  imageBase: string;
  productName?: string | null;
}) {
  return (
    <Paper
      sx={{
        p: { xs: 1.5, md: 2 },
        bgcolor: "#fff",
        color: "#000",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 420, sm: 520, md: 720 },
          bgcolor: "#fff",
          borderRadius: 3,
          overflow: "hidden",
          "& .swiper-button-next, & .swiper-button-prev": {
            color: "#111",
            display: { xs: "none", md: "flex" },
          },
          "& .swiper-pagination-bullet": { opacity: 0.35 },
          "& .swiper-pagination-bullet-active": { opacity: 0.9 },
        }}
      >
        {gallery.length > 0 ? (
          <Swiper
            spaceBetween={8}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            style={{ width: "100%", height: "100%" }}
          >
            {gallery.map((entry, i) => {
              const url = `${imageBase}${entry.file}`;
              return (
                <SwiperSlide key={entry.id ?? url}>
                  <Box
                    sx={{ position: "relative", width: "100%", height: "100%" }}
                  >
                    <Image
                      src={url}
                      alt={entry.label ?? productName ?? "Product image"}
                      fill
                      sizes="(max-width: 900px) 100vw, 65vw"
                      style={{ objectFit: "contain" }}
                      priority={i === 0}
                    />
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              color: "rgba(0,0,0,0.7)",
            }}
          >
            No image
          </Box>
        )}
      </Box>
    </Paper>
  );
}
