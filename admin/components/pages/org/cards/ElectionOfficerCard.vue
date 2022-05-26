<template>
  <v-form ref="form" v-model="valid">
    <v-card outlined>
      <v-card-title>
        Election Officers

        <v-btn color="primary" large class="ml-auto">Add Officer</v-btn>
      </v-card-title>
      <v-card-text class="py-0">
        <v-row no-gutters>
          <v-col v-if="alert.show" cols="12">
            <v-alert
              :type="alert.type"
              v-model="alert.show"
              dismissible
              class="mb-0"
            >
              {{ alert.message }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <election-officer-table />
    </v-card>
  </v-form>
</template>

<script lang="ts">
import ElectionOfficerTable from "@/components/pages/org/tables/ElectionOfficerTable.vue";
import authMixin from "@/mixins/auth.mixins";
import manageOrganizationMixin from "@/mixins/manage-organization.mixins";
import { Organization } from "@/services/organization.service";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageOrganizationMixin, authMixin).extend({
  props: {
    organization: {
      type: Object,
    } as PropOptions<Organization>,
    dialog: {
      type: Boolean,
    },
  },
  components: {
    ElectionOfficerTable,
  },

  data() {
    return {
      form: {
        verify: "",
      },
      verified: false,
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      photoData: null,
    };
  },
  methods: {
    async submit() {},

    reset() {
      (this.$refs as any).form.reset();
      (this.$refs as any).form.resetValidation();
      this.alert = Object.assign({}, defaultAlert);
    },
  },
});
</script>