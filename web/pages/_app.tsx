import { CacheProvider } from "@emotion/react";
import "@fontsource/open-sans";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import * as React from "react";
import createEmotionCache from "../src/configs/createEmotionCache";
import theme from "../src/configs/theme";
import AdminAuthMiddleware from "../src/middlewares/AdminAuthMiddleware";
import AdminRoleMiddleware from "../src/middlewares/AdminRoleMiddleware";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <SessionProvider session={pageProps.session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>TUP Voting System</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {Component.auth && Component.auth.admin ? (
            <AdminAuthMiddleware auth={Component.auth}>
              <Component {...pageProps} />
            </AdminAuthMiddleware>
          ) : (
            <Component {...pageProps} />
          )}
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
