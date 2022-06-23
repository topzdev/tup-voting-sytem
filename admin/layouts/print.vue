<template>
  <v-app>
    <v-main>
      <div class="cover-page">
        <div class="print-page print-page-padding" id="printPageCanvas">
          <v-btn
            class="noprint"
            fab
            fixed
            @click="print"
            large
            bottom
            right
            color="red white--text"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
          <Nuxt />
        </div>
      </div>
    </v-main>

    <app-snackbar />

    <app-dialog />

    <authentication-dialog />
  </v-app>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import AuthenticationDialog from "~/components/dialogs/AuthenticationDialog.vue";

export default Vue.extend({
  components: {
    AuthenticationDialog,
  },
  methods: {
    print() {
      window.print();
    },
  },
});
</script>

<style lang="scss">
.cover-page {
  position: relative;
  display: block;
  width: 100%;
  background: lightgray;
  padding-top: 40px;
}

.print-page {
  display: block;
  min-height: 1800px;
  width: 1050px;
  margin: 0 auto;
  background: white;
  padding: 50px;
}

// .print-button {
//   bottom: 30px !important;
//   right: 420px !important;
//   z-index: 10px;
// }

.w-100 {
  width: 100%;
}

.table {
  border-collapse: collapse;
  th,
  td {
    border: 1px solid;
  }
}

@media print {
  .print-page {
    padding: 0 40px 10px 40px !important;
    page-break-after: always;
    -webkit-print-color-adjust: exact;
  }
  .noprint {
    display: none;
  }

  @page {
    size: auto;
    margin: 0mm 0mm;
  }
}
</style>
