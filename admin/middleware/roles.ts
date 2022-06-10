import { Middleware } from "@nuxt/types";
import { RolesString, UserRole, UserRolesValue } from "@/types/roles";
import { rolesOnlyAllowed } from "../helpers/roles-allowed.helper";

//https://github.com/nuxt/nuxt.js/issues/1687

const rolesName = {
  sadmin: "SUPER ADMIN",
  admin: "ADMIN",
  elec_ofc: "Election Officer",
};

const rolesMiddleware: Middleware = ({ $auth, redirect, route, error }) => {
  if (!$auth.loggedIn || !$auth.user) return redirect("/login");

  if (!process.server) {
    const user = $auth.user;

    console.log(route.meta);

    if (
      route.meta &&
      route.meta.length &&
      route.meta.filter((item) => item.allowedRoles).length
    ) {
      const rolesAllowed = route.meta.filter((item) => item.allowedRoles)[0]
        .allowedRoles;

      console.log("Allowed Roles: ", rolesAllowed, $auth.user.role);

      if (!rolesOnlyAllowed($auth.user.role as UserRolesValue, rolesAllowed)) {
        return error({
          statusCode: 401,
          // message: `Your role is not allowed in this route <br> allowed roles: <b>${(
          //   rolesAllowed as []
          // )
          //   .map((item) => rolesName[UserRole[item]])
          //   .join(",")} </b> your role is <b>${rolesName[user.role]}</b>`,
          message: "Access Denied, Please contact platform adminstrator",
        });
      }
    }
  }
};

export default rolesMiddleware;
