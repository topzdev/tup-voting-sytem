import { actionTree, mutationTree } from "typed-vuex";

type DialogButtonsFunction = ({ hideDialog: Function }) => void;

const defaultAppDialog = {
  show: false,
  title: "",
  message: "",
  button: {
    yesLabel: "",
    noLabel: "",
    okayLabel: "",
    anyEventHide: true,
    spaceBetween: false,
    yesFunction: undefined as DialogButtonsFunction | undefined,
    noFunction: undefined as DialogButtonsFunction | undefined,
  },
};

export type AppDialogConfig = {
  show: boolean;
  title: string;
  message: string;
  button?: {
    yesLabel?: string;
    noLabel?: string;
    showClose?: boolean;
    anyEventHide?: boolean;
    spaceBetween?: boolean;
    yesFunction?: DialogButtonsFunction;
    noFunction?: DialogButtonsFunction;
  };
};

export const state = () => ({
  dialogs: {
    app: Object.assign({}, defaultAppDialog),
  },
});

export const mutations = mutationTree(state, {
  setAppDialog(state, payload) {
    state.dialogs.app = payload;
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
  }
);
