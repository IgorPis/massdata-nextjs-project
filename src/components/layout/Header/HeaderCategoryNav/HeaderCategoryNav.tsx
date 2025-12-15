import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";

import type { Category } from "@/types/graphql";
import { isSaleCategory } from "../categoryUtils";

export default function HeaderCategoryNav({
  topCats,
  onOpenCategory,
}: {
  topCats: Category[];
  onOpenCategory: (cat: Category) => void;
}) {
  return (
    <Toolbar
      component="nav"
      aria-label="categories"
      sx={{ gap: 2, overflowX: "auto", minHeight: 44 }}
    >
      {topCats.map((cat) => {
        const href = `/category/${cat.id}`;

        return (
          <Box key={String(cat.id)} sx={{ whiteSpace: "nowrap" }}>
            {isSaleCategory(cat) ? (
              <Box
                component={Link}
                href={href}
                aria-label={`Go to category ${cat.name ?? ""}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "inline-block",
                  px: 1.25,
                  py: 1,
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 600,
                  lineHeight: 1,
                  "&:hover": { opacity: 0.85 },
                }}
              >
                {cat.name}
              </Box>
            ) : (
              <Box
                component="button"
                type="button"
                onClick={() => onOpenCategory(cat)}
                aria-label={`Open category ${cat.name ?? ""}`}
                sx={{
                  all: "unset",
                  cursor: "pointer",
                  px: 1.25,
                  py: 1,
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 600,
                  color: "inherit",
                  lineHeight: 1,
                  "&:hover": { opacity: 0.85 },
                }}
              >
                {cat.name}
              </Box>
            )}
          </Box>
        );
      })}
    </Toolbar>
  );
}
