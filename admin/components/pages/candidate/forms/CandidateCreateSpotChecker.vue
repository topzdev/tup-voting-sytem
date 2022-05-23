<template>
  <v-form style="width: 100%" ref="form" v-model="valid">
    <v-row>
      <v-col class="mx-auto" cols="8">
        <v-row class="mt-2">
          <v-col v-if="alert.show" cols="12" class="pb-0">
            <v-alert
              v-model="alert.show"
              :type="alert.type"
              class="mb-0"
              dismissible
            >
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12" class="mx-auto">
            <v-row>
              <v-col cols="12">
                <party-picker
                  label="Party *"
                  :prepend="prependParty"
                  v-model="form.party_id"
                  :electionId="electionId"
                ></party-picker>
              </v-col>

              <v-col cols="12">
                <position-picker
                  label="Position *"
                  v-model="form.position_id"
                  :rules="rules.position_id"
                  :electionId="electionId"
                ></position-picker>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="d-flex" cols="12">
            <v-btn block class="ml-auto" color="primary" large @click="submit"
              >Next</v-btn
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import PartyPicker from "@/components/pickers/PartyPicker.vue";
import PositionPicker from "@/components/pickers/PositionPicker.vue";
import manageElectionMixins from "@/mixins/manage-election.mixins";
import mixins from "vue-typed-mixins";
import candidateServices from "../../../../services/candidate.service";

export const INDEPENDENT = {
  id: null,
  title: "Independent",
  logo: null,
};

const defaultForm = {
  position_id: "",
  party_id: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default mixins(manageElectionMixins).extend({
  data() {
    return {
      valid: false,
      alert: Object.assign({}, defaultAlert),
      loading: false,
      form: Object.assign({}, defaultForm),
    };
  },
  components: {
    PartyPicker,
    PositionPicker,
  },
  props: {
    checkPosition: Function,
  },

  methods: {
    async submit() {
      this.loading = true;

      (this.$refs as any).form.validate();

      if (this.valid) {
        console.log(this.form);
        const party_id = this.form.party_id;
        const position_id = this.form.position_id;

        if (party_id === null) {
          return this.checkPosition(this.form);
        }

        try {
          if (!party_id && !position_id) return;

          const response = await candidateServices.positionAvailability({
            party_id: parseInt(party_id),
            position_id: parseInt(position_id),
          });

          console.log(response, party_id, position_id);

          await this.checkPosition(this.form);
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;
          this.alert = {
            show: true,
            type: "error",
            message: message,
          };
        }
      }
      this.loading = false;
    },
  },

  computed: {
    rules() {
      return {
        position_id: [(v: any) => !!v || "Position is required"],
      };
    },
    prependParty() {
      return [INDEPENDENT];
    },
  },
});
</script>
