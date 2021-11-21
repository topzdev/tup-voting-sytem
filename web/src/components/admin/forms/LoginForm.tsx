import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Stack, TextField, InputAdornment, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

interface LoginFormProps {}

type LoginInputs = {
  username: string;
  password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((state) => !state);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = (data: LoginInputs) => console.log(data);

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column" }}
        spacing={{ xs: 2 }}
        sx={{ width: "100%" }}>
        <Controller
          control={control}
          name="username"
          rules={{
            required: "Username is required",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username or Email"
              variant="outlined"
              placeholder="Username or Email"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />{" "}
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type={showPassword ? "text" : "password"}
              label="Password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <LoadingButton
          loading={isSubmitting}
          variant="contained"
          size="large"
          type="submit">
          Login
        </LoadingButton>
      </Stack>
    </form>
  );
};

export default LoginForm;
