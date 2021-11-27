import { Container } from "@mui/material";
import React from "react";

interface AdminPageProps {}

const AdminPage: AdminNextPage<AdminPageProps> = ({}) => {
  return <Container></Container>;
};

AdminPage.auth = {
  admin: {},
};

export default AdminPage;
