import { Box, Typography } from "@mui/material";

export default function ProductDescription({
  name,
  html,
}: {
  name?: string | null;
  html?: string | null;
}) {
  return (
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
        {name}
      </Typography>

      {html ? (
        <Box
          sx={{
            color: "rgba(255,255,255,0.88)",
            fontSize: 18,
            lineHeight: 1.7,
            "& p": { margin: "0 0 14px" },
            "& a": {
              color: "inherit",
              textDecorationColor: "rgba(255,255,255,0.35)",
            },
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <Typography color="text.secondary">
          No description available.
        </Typography>
      )}
    </Box>
  );
}
