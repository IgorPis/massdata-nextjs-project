import { Box, Container, Typography, Link } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, py: 4, bgcolor: "grey.100" }}>
      <Container>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" component="p">
              Massdata Commerce
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dummy company info. 123 Commerce Street, Novi Sad, Serbia.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle1">Links</Typography>
            <Link href="#" variant="body2" display="block">
              About us
            </Link>
            <Link href="#" variant="body2" display="block">
              Support
            </Link>
            <Link href="#" variant="body2" display="block">
              Privacy policy
            </Link>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <Typography variant="subtitle1">Follow us</Typography>
            <Link href="#" variant="body2" display="block">
              Instagram
            </Link>
            <Link href="#" variant="body2" display="block">
              LinkedIn
            </Link>
            <Link href="#" variant="body2" display="block">
              X (Twitter)
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
