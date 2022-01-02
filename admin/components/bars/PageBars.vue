<template>
  <v-app-bar>
    <account-container>
      <div class="d-flex align-center">
        <div class="d-flex align-center">
          <v-tooltip bottom v-if="back || backTo">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                fab
                text
                v-bind="attrs"
                @click="backToPage"
                v-on="on"
              >
                <v-icon large> mdi-chevron-left </v-icon></v-btn
              >
            </template>
            <span v-text="backTooltipMessage"></span>
          </v-tooltip>

          <h2
            v-if="title"
            class="headline-6 font-weight-medium"
            v-text="title"
          />
        </div>

        <slot></slot>
      </div>
    </account-container>
  </v-app-bar>
</template>

<script>
import AccountContainer from "@/components/containers/AccountContainer.vue";
export default {
  components: {
    AccountContainer,
  },
  props: {
    title: String,
    back: Boolean,
    backTo: String,
    backTooltip: String,
  },

  methods: {
    backToPage() {
      if (this.back) {
        return this.$router.back();
      }
      this.$router.push(this.backTo);
    },
  },

  computed: {
    backTooltipMessage() {
      return this.backTooltip || "Back";
    },
  },
};
</script>

<style>
</style>