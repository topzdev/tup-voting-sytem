import { Middleware } from "@nuxt/types";

//https://github.com/nuxt/nuxt.js/issues/1687

const rolesAllowedMiddleware: Middleware = ({ $auth, redirect }) => {
  if (!$auth.loggedIn) return redirect("/login");

  if (!$auth.user?.role) {
    return redirect("/");
  }
};

export default rolesAllowedMiddleware;
