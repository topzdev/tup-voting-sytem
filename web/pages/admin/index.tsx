import { Button, Container, Typography } from "@mui/material";
import React from "react";

interface AdminPageProps {}

const AdminPage: AdminNextPage<AdminPageProps> = ({}) => {
  return (
    <Container>
      <Typography variant="h2">Dashboard</Typography>
      <Button variant="text" color="primary" href="/admin/login">
        Authorized Page
      </Button>
    </Container>
  );
};

AdminPage.auth = {
  admin: {},
};

export default AdminPage;
