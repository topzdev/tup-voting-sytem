import { Container, Typography, Button } from "@mui/material";
import React from "react";

interface IndexPageProps {}

const IndexPage: React.FC<IndexPageProps> = ({}) => {
  return (
    <Container>
      <Typography variant="h2">Admin</Typography>
      <Button variant="text" color="primary" href="/admin/login">
        Admin
      </Button>
    </Container>
  );
};

export default IndexPage;
