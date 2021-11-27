import { Middleware } from "@nuxt/types";
import { RolesString, UserRole } from "../types/roles";

//https://github.com/nuxt/nuxt.js/issues/1687

const rolesMiddleware: Middleware = ({ $auth, redirect, route, error }) => {
  if (!$auth.loggedIn || !$auth.user) return redirect("/login");

  const user = $auth.user;

  if (route.meta && route.meta[0].roles) {
    const rolesAllowed = route.meta[0].roles;

    console.log(rolesAllowed);

    if (
      rolesAllowed.findIndex((item: RolesString) => {
        return UserRole[item] === user.role;
      }) === -1
    ) {
      return error({
        statusCode: 401,
        message: `Your role is not allowed in this route <br> allowed roles: <b>${(
          rolesAllowed as []
        )
          .map((item) => UserRole[item])
          .join(",")} </b> your role is <b>${user.role}</b>`,
      });
    }
  }
};

export default rolesMiddleware;
