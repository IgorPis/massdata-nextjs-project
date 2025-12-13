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

const HIDDEN_CATEGORY_URL_KEYS = new Set(["test-category"]);
const HIDDEN_CATEGORY_NAMES = new Set(["Test Category"]);

const isVisibleCategory = (c: Category | null | undefined): c is Category => {
  if (!c?.id || !c?.name) return false;

  const urlKey = c.url_key ?? "";
  const name = c.name ?? "";

  return (
    !HIDDEN_CATEGORY_URL_KEYS.has(urlKey) && !HIDDEN_CATEGORY_NAMES.has(name)
  );
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
      <AppBar position="sticky" elevation={1}>
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
            variant="h6"
            component={Link}
            href="/"
            sx={{
              whiteSpace: "nowrap",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Massdata
          </Typography>

          <Box
            component="form"
            role="search"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              px: 1,
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ color: "inherit", ml: 1, width: "100%" }}
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
                <button
                  onClick={() => openCategory(cat)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: "inherit",
                    font: "inherit",
                    cursor: "pointer",
                    padding: "6px 8px",
                  }}
                  aria-label={`Open category ${cat.name ?? ""}`}
                >
                  {cat.name}
                </button>
              </Box>
            ))}
          </Toolbar>
        )}

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          slotProps={{ paper: { sx: { width: 320 } } }}
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
