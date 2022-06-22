<template>
  <div class="cover-page">
    <div class="print-page" id="printPageCanvas">
      <table class="width:100%;">
        <tr>
          <td class="text-center">
            <h1 class="text-center" style="display: black; width: 100%">
              Hello World!
            </h1>
          </td>
        </tr>
      </table>
    </div>

    <v-btn
      fab
      fixed
      class="print-button"
      @click="print"
      large
      color="red white--text"
    >
      <v-icon>mdi-printer</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import html2pdf from "html2pdf.js";

export default Vue.extend({
  methods: {
    print() {
      const element = document.getElementById("printPageCanvas");
      html2pdf(element);
    },
  },
});
</script>

<style lang="scss">
.cover-page {
  display: block;
  width: 100%;
  background: lightgray;
  padding-top: 40px;
}

.print-page {
  display: block;
  min-height: 1800px;
  width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 50px;
}

.print-button {
  bottom: 30px !important;
  right: 420px !important;
  z-index: 10px;
}
</style>