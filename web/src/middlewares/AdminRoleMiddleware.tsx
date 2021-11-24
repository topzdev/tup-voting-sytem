import next from "next";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { UserRole } from "../apis/admin/auth.api";
import { AuthAdmin } from "../type/next";

interface AdminRoleMiddlewareProps {
  roles: AuthAdmin["roles"];
}

const AdminRoleMiddleware: React.FC<AdminRoleMiddlewareProps> = ({
  children,
  roles,
}) => {
  const { data: session, status } = useSession();
  const admin = session.admin;

  console.log(admin, roles, UserRole[admin.role]);

  useEffect(() => {
    if (status === "loading") return;
  }, [status]);

  if (roles && roles.length) {
    if (Array.isArray(roles)) {
      if (
        roles.findIndex((item) => {
          return UserRole[item] === admin.role;
        }) !== -1
      ) {
        return <>{children}</>;
      } else {
        return <div>You are not allowed in this route</div>;
      }
    }

    if (typeof roles === "string") {
      console.log("String test");
      if (UserRole[roles] === admin.role) {
        return <>{children}</>;
      } else {
        return <div>You are not allowed in this route</div>;
      }
    }
  } else {
    return <>{children}</>;
  }
};

export default AdminRoleMiddleware;
