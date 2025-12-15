import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function MobileFloatingCart({
  cartCount,
}: {
  cartCount: number;
}) {
  return (
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
        <Badge badgeContent={cartCount} color="error">
          <ShoppingCartIcon sx={{ color: "white" }} />
        </Badge>
      </IconButton>
    </Box>
  );
}
