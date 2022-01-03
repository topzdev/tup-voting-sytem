<template>
  <v-dialog v-model="modal.show">
    <v-card>
      <v-card-title>Helo</v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      modal: {
        show: true,
      },
    };
  },

  watch: {
    ["modal.show"](_val) {
      if (!_val) this.$router.back();
    },
  },
};
</script>

<style>
</style>