import { Auth as AuthDefault } from "@nuxtjs/auth-next";
import { accessorType } from "~/store";
import { AuthUser } from "../services/user.service";

type Recaptcha = {
  getResponse: () => string;
  reset: () => void;
};

declare module "vue/types/vue" {
  interface Vue {
    $accessor: typeof accessorType;
    $recaptcha: Recaptcha;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
  }
  type Auth = AuthDefault & {
    user: AuthUser;
  };
}
