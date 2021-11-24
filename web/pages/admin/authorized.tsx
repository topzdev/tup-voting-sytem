import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";

interface authorizedProps {}

const authorized: React.FC<authorizedProps> = ({}) => {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) return <Box>Loading...</Box>;

  console.log("session", session);

  return (
    <Container>
      <Typography variant="h1" color="initial">
        Authorized Page
      </Typography>
    </Container>
  );
};

export default authorized;
