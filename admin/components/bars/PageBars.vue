<template>
  <v-toolbar elevation="1">
    <v-row justify="center" align="center">
      <v-col :cols="cols" :sm="sm" :md="md" :lg="lg">
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
      </v-col>
    </v-row>
  </v-toolbar>
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
    cols: {
      type: [String, Number],
      default: 12,
    },
    md: String,
    sm: String,
    lg: String,
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