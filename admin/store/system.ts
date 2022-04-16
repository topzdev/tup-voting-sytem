import { actionTree, mutationTree } from "typed-vuex";
import { SystemLoginCredentials } from "../services/auth.service";

type DialogButtonsFunction = ({ hideDialog: Function }) => void;

export type AuthenticationDialogType =
  | "default"
  | "current"
  | "current-only-password";

export type AuthenticationDialogConfig = {
  show: boolean;
  title?: string;
  message?: string;
  type?: AuthenticationDialogType;
  allowedRole?: "super-admin" | "admin" | "all";
  default?: {
    usernameOrEmail?: string;
    password?: string;
  };
  button?: {
    yesLabel?: string;
    noLabel?: string;
    spaceBetween?: boolean;
    yesFunction?: () => void;
    noFunction?: DialogButtonsFunction;
  };
};

export type AppDialogConfig = {
  show: boolean;
  title: string;
  message: string;
  button?: {
    yesLabel?: string;
    noLabel?: string;
    showNo?: boolean;
    showYes?: boolean;
    anyEventHide?: boolean;
    spaceBetween?: boolean;
    yesFunction?: DialogButtonsFunction;
    noFunction?: DialogButtonsFunction;
  };
};

const defaultAppDialog: AppDialogConfig = {
  show: false,
  title: "",
  message: "",
  button: {
    yesLabel: "",
    noLabel: "",
    showNo: true,
    showYes: true,
    anyEventHide: true,
    spaceBetween: false,
    yesFunction: undefined,
    noFunction: undefined,
  },
};

const defaultAuthenticationDialog: AuthenticationDialogConfig = {
  show: false,
  title: "",
  message: "",
  allowedRole: "all",
  default: {
    usernameOrEmail: "",
    password: "",
  },
  button: {
    yesLabel: "",
    noLabel: "",
    spaceBetween: false,
    yesFunction: undefined,
    noFunction: undefined,
  },
};

export const state = () => ({
  dialogs: {
    app: Object.assign({}, defaultAppDialog),
    authentication: Object.assign({}, defaultAuthenticationDialog),
  },
});

export const mutations = mutationTree(state, {
  setAppDialog(state, payload) {
    state.dialogs.app = payload;
  },
  setAuthenticationDialog(state, payload) {
    state.dialogs.authentication = payload;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async showAppDialog({ commit }, _config: AppDialogConfig) {
      commit("setAppDialog", _config);
    },

    async resetAppDialog({ commit }) {
      commit("setAppDialog", defaultAppDialog);
    },

    async showAuthenticationDialog(
      { commit },
      _config: AuthenticationDialogConfig
    ) {
      commit("setAuthenticationDialog", _config);
    },

    async resetAutheticationDialog({ commit }) {
      commit("setAuthenticationDialog", defaultAuthenticationDialog);
    },
  }
);
