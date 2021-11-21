import { Box, Container, Typography } from "@mui/material";
import React from "react";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }}>
        <Typography variant="h1">Login page</Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
