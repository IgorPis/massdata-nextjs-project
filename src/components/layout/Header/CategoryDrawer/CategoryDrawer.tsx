import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Link from "next/link";
import type { Category } from "@/types/graphql";
import { isSaleCategory } from "../categoryUtils";

export default function CategoryDrawer({
  open,
  onClose,
  topCats,
  activeCategory,
  onSetActiveCategory,
  subcats,
  onOpenCategory,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  topCats: Category[];
  activeCategory: Category | null;
  onSetActiveCategory: (c: Category | null) => void;
  subcats: Category[];
  onOpenCategory: (cat: Category) => void;
  isMobile: boolean;
}) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 320,
            borderRadius: "0 12px 12px 0",
            overflow: "hidden",
          },
        },
      }}
      aria-label="Category menu"
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {activeCategory && (
              <IconButton
                aria-label="back to categories"
                onClick={() => onSetActiveCategory(null)}
                size="small"
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              {activeCategory?.name ? activeCategory.name : "Categories"}
            </Typography>
          </Box>

          <IconButton aria-label="close menu" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {!activeCategory && (
            <List disablePadding>
              {topCats.map((cat) =>
                isSaleCategory(cat) ? (
                  <ListItemButton
                    key={String(cat.id)}
                    component={Link}
                    href={`/category/${cat.id}`}
                    onClick={onClose}
                  >
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    key={String(cat.id)}
                    onClick={() => onOpenCategory(cat)}
                  >
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                )
              )}
            </List>
          )}

          {activeCategory && (
            <List disablePadding>
              <ListItemButton
                component={Link}
                href={`/category/${activeCategory.id}`}
                onClick={onClose}
              >
                <ListItemText primary={`View all in ${activeCategory.name}`} />
              </ListItemButton>

              <Divider sx={{ my: 1 }} />

              {subcats.length > 0 ? (
                subcats.map((sub) => (
                  <ListItemButton
                    key={String(sub.id)}
                    component={Link}
                    href={`/category/${sub.id}`}
                    onClick={onClose}
                  >
                    <ListItemText primary={sub.name} />
                  </ListItemButton>
                ))
              ) : (
                <Box sx={{ p: 2, color: "text.secondary" }}>
                  No subcategories.
                </Box>
              )}
            </List>
          )}

          {isMobile && (
            <>
              <Divider sx={{ my: 1 }} />
              <List disablePadding>
                <ListItemButton onClick={onClose}>
                  <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account" />
                </ListItemButton>
              </List>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
