import { Box, Container, Typography, Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import React from "react";

interface AuthorizedPageProps {
  auth: any;
}

const AuthorizedPage: AdminNextPage<AuthorizedPageProps> = ({}) => {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) return <Box>Loading...</Box>;

  console.log("session", session);

  return (
    <Container>
      <Typography variant="h1" color="initial">
        AuthorizedPage Page
      </Typography>
      <Button variant="contained" color="primary" onClick={() => signOut()}>
        Logout
      </Button>
    </Container>
  );
};

AuthorizedPage.auth = {
  admin: {
    roles: "SUPER_ADMIN",
  },
};

export default AuthorizedPage;
