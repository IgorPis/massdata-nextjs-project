import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Link from "next/link";

export default function HeaderTopBar({
  isMobile,
  cartCount,
  searchValue,
  onSearchValueChange,
  onOpenSearch,
  onOpenMenu,
}: {
  isMobile: boolean;
  cartCount: number;
  searchValue: string;
  onSearchValueChange: (v: string) => void;
  onOpenSearch: () => void;
  onOpenMenu: () => void;
}) {
  return (
    <Toolbar sx={{ gap: 2 }}>
      {isMobile && (
        <IconButton
          aria-label="open categories menu"
          color="inherit"
          onClick={onOpenMenu}
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
            onClick={onOpenSearch}
          >
            <SearchIcon />
          </IconButton>
        ) : (
          <Box
            component="form"
            role="search"
            onSubmit={(e) => e.preventDefault()}
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
              onChange={(e) => onSearchValueChange(e.target.value)}
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
              <Badge badgeContent={cartCount} color="error">
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
  );
}
