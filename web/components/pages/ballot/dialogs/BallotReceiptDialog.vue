<template>
  <v-dialog v-model="showLocal" width="500">
    <v-card>
      <v-card-title> Ballot Receipt </v-card-title>
      <v-card-subtitle class="pt-1 pb-0 mb-1"
        >This receipt will vanish after {{ timer }} seconds</v-card-subtitle
      >

      <v-card-text class="pb-0">
        <v-simple-table
          width="100%"
          id="receiptTable"
          style="user-select: none; pointer-event: none"
        >
          <template v-slot:default>
            <!-- <thead>
              <tr>
                <th class="text-center py-2 primary white--text">
                  <h2>Ballot Receipt</h2>
                </th>
              </tr>
            </thead> -->

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
      loading: false,
      showLocal: this.show,
      receiptImage: "",
      timer: 30,
    };
  },

  watch: {
    show(value): any {
      this.showLocal = value;
    },
    showLocal(value): any {
      this.$emit("update:show", value);
    },

    timer: {
      handler(value) {
        if (value !== 0) {
          setTimeout(() => {
            this.timer--;
          }, 1000);
        } else {
          this.showLocal = false;
        }
      },
      immediate: true,
    },
  },

  computed: {
    votedOn(): string {
      return new Date(this.receipt.created_at).toString();
    },
  },

  methods: {},
  created() {
    // this.$nextTick(function () {
    //   if (process.client) {
    //     this.generateReceiptToImage();
    //   }
    // });
  },
});
</script>
