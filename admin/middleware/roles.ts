import { Middleware } from "@nuxt/types";
import { RolesString, UserRole, UserRolesValue } from "@/types/roles";
import { rolesOnlyAllowed } from "../helpers/roles-allowed.helper";

//https://github.com/nuxt/nuxt.js/issues/1687

const rolesMiddleware: Middleware = ({ $auth, redirect, route, error }) => {
  if (!$auth.loggedIn || !$auth.user) return redirect("/login");

  if (!process.server) {
    const user = $auth.user;

    if (route.meta && route.meta[0].allowedRoles) {
      const rolesAllowed = route.meta[0].allowedRoles;

      console.log(rolesAllowed);

      if (!rolesOnlyAllowed($auth.user.role as UserRolesValue, rolesAllowed)) {
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
  }
};

export default rolesMiddleware;
