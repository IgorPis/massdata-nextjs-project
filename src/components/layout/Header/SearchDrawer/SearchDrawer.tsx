import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchDrawer({
  open,
  onClose,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={onClose}
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
          onSubmit();
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          sx={{ flex: 1 }}
        />
        <IconButton aria-label="close search" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Drawer>
  );
}
