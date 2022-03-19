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
                  <p>Test Election</p>
                </td>
              </tr>
              <tr>
                <td class="text-center pt-2">
                  <v-chip> Voted On </v-chip>
                  <p>
                    Sat Mar 19 2022 13:38:44 GMT+0800 (Philippines Standard
                    Time)
                  </p>
                </td>
              </tr>
              <tr>
                <td class="text-center pt-2">
                  <v-chip> Receipt ID </v-chip>
                  <p>ABC123X-YZ-N</p>
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
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  props: {
    show: Boolean,
  },

  data() {
    return {
      showLocal: this.show,
    };
  },

  watch: {
    show(value) {
      this.showLocal = value;
    },
    showLocal(value) {
      this.$emit("update:show", value);
    },
  },
});
</script>

<style>
</style>