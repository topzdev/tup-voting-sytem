import { Container, Typography } from "@mui/material";
import React from "react";

interface IndexPageProps {}

const IndexPage: React.FC<IndexPageProps> = ({}) => {
  return (
    <Container>
      <Typography variant="h2">Admin</Typography>
    </Container>
  );
};

export default IndexPage;
