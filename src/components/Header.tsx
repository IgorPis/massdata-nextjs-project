import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client";
import { cartVar } from "@/lib/cart";
import type { Category } from "@/types/graphql";

const HIDDEN_CATEGORY_URL_KEYS = new Set(["test-category", "example"]);
const HIDDEN_CATEGORY_NAMES = new Set(["Test Category", "Examples"]);

const HIDDEN_URLKEY_PREFIXES = ["home-"];
const HIDDEN_NAME_PREFIXES = ["homepage "];

const isVisibleCategory = (c: Category | null | undefined): c is Category => {
  if (!c?.id || !c?.name) return false;

  const urlKey = (c.url_key ?? "").toLowerCase();
  const name = (c.name ?? "").toLowerCase();

  if (HIDDEN_CATEGORY_URL_KEYS.has(urlKey)) return false;
  if (HIDDEN_CATEGORY_NAMES.has(c.name ?? "")) return false;

  if (HIDDEN_URLKEY_PREFIXES.some((p) => urlKey.startsWith(p))) return false;
  if (HIDDEN_NAME_PREFIXES.some((p) => name.startsWith(p))) return false;

  return true;
};

export default function Header({ categories }: { categories: Category[] }) {
  const cart = useReactiveVar(cartVar);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<Category | null>(
    null
  );

  const topCats = (categories ?? []).filter(isVisibleCategory).slice(0, 10);

  const openCategory = (cat: Category) => {
    setActiveCategory(cat);
    setDrawerOpen(true);
  };

  const subcats = (activeCategory?.children ?? []).filter(isVisibleCategory);

  return (
    <Box component="header">
      <AppBar position="sticky" elevation={1} sx={{ borderRadius: 0 }}>
        {/* Top row */}
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton
              aria-label="open categories menu"
              color="inherit"
              onClick={() => {
                setActiveCategory(null);
                setDrawerOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            component={Link}
            href="/"
            sx={{
              whiteSpace: "nowrap",
              textDecoration: "none",
              color: "inherit",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: { xs: 20, sm: 22, md: 24 }, // bigger
              lineHeight: 1,
            }}
          >
            Massdata Commerce®
          </Typography>

          {/* Push everything else to the right */}
          <Box sx={{ flex: 1 }} />

          {/* Right-side group (search + icons) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="form"
              role="search"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                width: { xs: 170, sm: 240, md: 320 }, // shorter
                display: "flex",
                alignItems: "center",
                bgcolor: "rgba(255,255,255,0.14)", // lighter on dark header
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 999,
                px: 1.25,
                py: 0.25,
                transition: "all .15s ease",
                "&:focus-within": {
                  bgcolor: "rgba(255,255,255,0.20)",
                  borderColor: "rgba(255,255,255,0.35)",
                },
              }}
            >
              <SearchIcon sx={{ opacity: 0.9 }} />
              <InputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                sx={{
                  color: "inherit",
                  ml: 1,
                  width: "100%",
                  "& input::placeholder": { opacity: 0.7 },
                }}
              />
            </Box>

            <IconButton aria-label="cart" color="inherit">
              <Badge badgeContent={count} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton aria-label="profile" color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Bottom row (desktop categories) */}
        {!isMobile && (
          <Toolbar
            component="nav"
            aria-label="categories"
            sx={{ gap: 2, overflowX: "auto", minHeight: 44 }}
          >
            {topCats.map((cat) => (
              <Box key={String(cat.id)} sx={{ whiteSpace: "nowrap" }}>
                <Box
                  component="button"
                  onClick={() => openCategory(cat)}
                  aria-label={`Open category ${cat.name ?? ""}`}
                  sx={{
                    all: "unset",
                    cursor: "pointer",
                    px: 1.25,
                    py: 1,
                    fontSize: { xs: 16, md: 18 }, // 👈 bigger
                    fontWeight: 600,
                    color: "inherit",
                    lineHeight: 1,
                    "&:hover": { opacity: 0.85 },
                  }}
                >
                  {cat.name}
                </Box>
              </Box>
            ))}
          </Toolbar>
        )}

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
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
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">
              {activeCategory?.name ? activeCategory.name : "Categories"}
            </Typography>
          </Box>
          <Divider />

          {/* If no active category -> show top categories */}
          {!activeCategory && (
            <List>
              {topCats.map((cat) => (
                <ListItemButton
                  key={String(cat.id)}
                  onClick={() => openCategory(cat)}
                >
                  <ListItemText primary={cat.name} />
                </ListItemButton>
              ))}
            </List>
          )}

          {/* If active category  show subcategories OR link to product list */}
          {activeCategory && (
            <List>
              <ListItemButton
                component={Link}
                href={`/category/${activeCategory.id}`}
                onClick={() => setDrawerOpen(false)}
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
                    onClick={() => setDrawerOpen(false)}
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
        </Drawer>
      </AppBar>
    </Box>
  );
}
