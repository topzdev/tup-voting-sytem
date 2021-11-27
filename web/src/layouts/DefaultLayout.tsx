import React from "react";
import Container from "@mui/material/Container";

interface DefaultLayoutProps {}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <Container maxWidth={false}>{children}</Container>;
};

export default DefaultLayout;
