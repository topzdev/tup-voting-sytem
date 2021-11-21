import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/components/global/Link";
import { Button } from "@mui/material";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          Welcome to TUP Voting System
        </Typography>
        <Button
          sx={{ mr: 1 }}
          variant="contained"
          component={Link}
          noLinkStyle
          href="/admin"
        >
          Go to the Admin Page
        </Button>
        <Button variant="contained" component={Link} noLinkStyle href="/">
          Go to the Web Page
        </Button>

        <Button variant="text" color="primary"></Button>
      </Box>
    </Container>
  );
}
