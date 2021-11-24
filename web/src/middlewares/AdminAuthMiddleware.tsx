import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

import React from "react";
import { adminRoutes } from "../configs/routes";
import { useRouter } from "next/router";
import { AuthPageType } from "../type/next";

interface AdminAuthMiddlewareProps {
  auth: AuthPageType;
}

const AdminAuthMiddleware: React.FC<AdminAuthMiddlewareProps> = ({
  children,
  auth,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdminUser = !!session?.admin;

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isAdminUser) router.push(adminRoutes.login); // If not authenticated, force log in
  }, [isAdminUser, status, auth]);

  // if (typeof auth.admin === "object") {
  //   return (
  //     <AdminRoleMiddleware roles={auth.admin.roles}>
  //       {children}
  //     </AdminRoleMiddleware>
  //   );
  // }
  if (isAdminUser) {
    return <>{children}</>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
};

export default AdminAuthMiddleware;
