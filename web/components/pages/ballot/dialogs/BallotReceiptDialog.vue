<template>
  <v-dialog v-model="showLocal" width="500">
    <v-card>
      <v-card-title> Ballot Receipt </v-card-title>

      <v-card-text class="pb-0">
        <v-simple-table width="100%">
          <template v-slot:default>
            <thead class="d-none">
              <tr>
                <th class="text-center py-2 primary white--text">
                  <h2>Ballot Receipt</h2>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td class="text-center pt-2">
                  <v-chip> Election </v-chip>
                  <p>
                    {{ receipt.election_title }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="text-center pt-2">
                  <v-chip> Voted On </v-chip>
                  <p>
                    {{ votedOn }}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="text-center pt-2">
                  <v-chip> Receipt ID </v-chip>
                  <p>{{ receipt.receipt_id }}</p>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions class="text-center">
        <v-btn color="primary" class="mx-auto">Download Ballot Receipt</v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showLocal = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { BallotReceipt } from "@/types/app";
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    show: Boolean,
    receipt: {} as PropOptions<BallotReceipt>,
  },

  data() {
    return {
      showLocal: this.show,
    };
  },

  watch: {
    show(value): any {
      this.showLocal = value;
    },
    showLocal(value): any {
      this.$emit("update:show", value);
    },
  },

  computed: {
    votedOn(): string {
      return new Date(this.receipt.created_at).toString();
    },
  },
});
</script>

<style>
</style>