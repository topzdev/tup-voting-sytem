import "next-auth";
import { AdminUser } from "../../apis/admin/auth.api";

declare module "next-auth" {
  interface Session {
    admin: AdminUser;
  }

  interface JWT {
    admin: AdminUser;
  }
}
