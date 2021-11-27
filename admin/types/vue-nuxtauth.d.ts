import { Auth } from "@nuxtjs/auth-next";
import { AdminUser } from "./user";

declare module "vuex/types/index" {
  interface Store<S> {
    $auth: Auth;
  }
}
