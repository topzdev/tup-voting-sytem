import { accessorType } from "~/store";

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
}
