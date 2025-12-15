import { Box, Stack, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";

export default function ProductHighlights() {
  const items = [
    {
      icon: <LocalShippingOutlinedIcon />,
      title: "Free shipping",
      sub: "On eligible orders",
    },
    {
      icon: <ReplayOutlinedIcon />,
      title: "30 days return policy",
      sub: "Simple returns",
    },
    {
      icon: <BoltOutlinedIcon />,
      title: "Unlimited Next Day Delivery",
      sub: "Fast dispatch",
    },
    {
      icon: <NightsStayOutlinedIcon />,
      title: "Late night delivery",
      sub: "For those night owls",
    },
  ];

  return (
    <Stack spacing={2} sx={{ pt: { md: 2 } }}>
      {items.map((item) => (
        <Stack
          key={item.title}
          direction="row"
          spacing={1.5}
          alignItems="center"
        >
          <Box sx={{ opacity: 0.9 }}>{item.icon}</Box>
          <Box>
            <Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.sub}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}
