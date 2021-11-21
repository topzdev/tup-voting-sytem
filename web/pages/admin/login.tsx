import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import LoginForm from "../../src/components/admin/forms/LoginForm";
import DefaultLayout from "../../src/layouts/DefaultLayout";

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  return (
    <DefaultLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
        }}>
        <Box
          sx={{
            display: "flex",
            minWidth: 450,
            width: 450,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}>
          <Avatar
            alt="TUP Logo"
            sx={{
              height: 100,
              width: 100,
            }}
            src="/img/tup-logo.png"
          />

          <Typography
            sx={{ textAlign: "center", mt: 1, px: 2, mb: 4 }}
            variant="h5">
            Technological University of the Philippines
            <br />
            <b>Voting System</b>
          </Typography>

          <LoginForm />
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default LoginPage;
