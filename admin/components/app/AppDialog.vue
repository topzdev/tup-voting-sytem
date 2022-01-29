<template>
  <v-dialog v-model="show" persistent :min-width="width" :width="width">
    <v-card>
      <v-card-title class="text-h5" v-html="title"> </v-card-title>
      <v-card-text v-html="message"></v-card-text>
      <v-card-actions :class="[buttonSpaceBetweenClass]">
        <v-btn color="primary" text @click="noFunc"> {{ noLabel }} </v-btn>
        <v-btn color="primary" text @click="yesFunc"> {{ yesLabel }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { AppDialogConfig } from "@/store/system";

export default Vue.extend({
  data() {
    return {
      width: 500,
      show: false,
    };
  },

  computed: {
    dialog() {
      return this.$accessor.system.dialogs.app;
    },

    title(): string {
      return this.dialog.title || "Message Dialog";
    },
    message(): string {
      return this.dialog.message || "This is dialog message.";
    },

    yesLabel(): string {
      return this.dialog.button.yesLabel || "Confirm";
    },
    noLabel(): string {
      return this.dialog.button.noLabel || "Cancel";
    },

    buttonSpaceBetweenClass(): string {
      return this.dialog.button.spaceBetween
        ? "justify-space-between"
        : "justify-end";
    },
  },

  methods: {
    hideDialog() {
      this.show = false;
      const self = this;
      setTimeout(function () {
        self.$accessor.system.resetAppDialog();
      }, 200);
    },

    async noFunc() {
      if (this.dialog.button.noFunction) {
        await this.dialog.button.noFunction({ hideDialog: this.hideDialog });
      }

      if (this.dialog.button.anyEventHide) {
        this.hideDialog();
      }
    },
    async yesFunc() {
      if (this.dialog.button.yesFunction) {
        await this.dialog.button.yesFunction({ hideDialog: this.hideDialog });
      }

      if (this.dialog.button.anyEventHide) {
        this.hideDialog();
      }
    },
  },

  watch: {
    ["$accessor.system.dialogs.app"](val) {
      this.show = val.show;
    },
  },
});
</script>

<style>
</style>