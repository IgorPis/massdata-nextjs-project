import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
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

const isSaleCategory = (cat: Category) => {
  const name = (cat.name ?? "").toLowerCase();
  const urlKey = (cat.url_key ?? "").toLowerCase();
  return name === "sale" || urlKey === "sale";
};

export default function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const cart = useReactiveVar(cartVar);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const topCats = (categories ?? []).filter(isVisibleCategory).slice(0, 10);

  const openCategory = (cat: Category) => {
    setActiveCategory(cat);
    setDrawerOpen(true);
  };

  const subcats = (activeCategory?.children ?? []).filter(isVisibleCategory);

  return (
    <Box component="header">
      <AppBar position="fixed" elevation={1} sx={{ borderRadius: 0 }}>
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
              fontSize: { xs: 20, sm: 22, md: 24 },
              lineHeight: 1,
            }}
          >
            Massdata Commerce®
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile ? (
              <IconButton
                aria-label="open search"
                color="inherit"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>
            ) : (
              <Box
                component="form"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = searchValue.trim();
                  if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
                  else router.push("/search");
                }}
                sx={{
                  width: { xs: 170, sm: 240, md: 320 },
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.14)",
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
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
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
            )}

            {!isMobile && (
              <>
                <IconButton aria-label="cart" color="inherit">
                  <Badge badgeContent={count} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <IconButton aria-label="profile" color="inherit">
                  <AccountCircleIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>

        {!isMobile && (
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
                      onClick={() => openCategory(cat)}
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
          <Box
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
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
                    onClick={() => setActiveCategory(null)}
                    size="small"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}

                <Typography variant="h6" sx={{ lineHeight: 1 }}>
                  {activeCategory?.name ? activeCategory.name : "Categories"}
                </Typography>
              </Box>

              <IconButton
                aria-label="close menu"
                onClick={() => setDrawerOpen(false)}
                size="small"
              >
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
                        onClick={() => setDrawerOpen(false)}
                      >
                        <ListItemText primary={cat.name} />
                      </ListItemButton>
                    ) : (
                      <ListItemButton
                        key={String(cat.id)}
                        onClick={() => openCategory(cat)}
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
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText
                      primary={`View all in ${activeCategory.name}`}
                    />
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

              {isMobile && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <List disablePadding>
                    <ListItemButton onClick={() => setDrawerOpen(true)}>
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

        <Drawer
          anchor="top"
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          slotProps={{
            paper: {
              sx: { borderRadius: "0 0 12px 12px", overflow: "hidden" },
            },
          }}
          aria-label="Search"
        >
          <Box
            component="form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchValue.trim();
              setSearchOpen(false);
              if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
              else router.push("/search");
            }}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "background.paper",
            }}
          >
            <SearchIcon />
            <InputBase
              autoFocus
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ flex: 1 }}
            />
            <IconButton
              aria-label="close search"
              onClick={() => setSearchOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Drawer>
      </AppBar>
      <Toolbar />
      {!isMobile && <Toolbar sx={{ minHeight: 44 }} />}

      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            right: 16,
            bottom: 16,
            zIndex: (t) => t.zIndex.modal + 1,
          }}
        >
          <IconButton
            aria-label="cart"
            sx={{
              width: 52,
              height: 52,
              borderRadius: "999px",
              bgcolor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: 6,
              "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            }}
          >
            <Badge badgeContent={count} color="error">
              <ShoppingCartIcon sx={{ color: "white" }} />
            </Badge>
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
