import { EmotionCache } from "@emotion/react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import React from "react";
import { UserRole, UserRoleStrings } from "../../apis/admin/auth.api";

export type AuthAdmin = {
  roles?: UserRoleStrings | UserRoleStrings[];
};

export type AuthPageType = {
  admin: AuthAdmin | "guest" | Boolean;
};

declare global {
  type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
    auth: AuthPageType;
  };

  interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
    Component: NextPageWithLayout;
  }

  type AdminNextPage<T> = React.FC<T> & {
    auth: AuthPageType;
  };
}
