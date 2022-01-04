<template>
  <v-card outlined>
    <v-card-text>
      <v-row align="center" no-gutters>
        <v-col cols="auto">
          <v-avatar :color="color" size="50">
            <v-icon dark v-text="icons"> </v-icon>
          </v-avatar>
        </v-col>
        <v-col class="px-3">
          <h3
            class="title text--primary text-truncate mb-1"
            v-text="title"
          ></h3>
          <p class="body-2 my-0 text--secondary" v-text="body"></p>
        </v-col>
        <v-col cols="auto" class="ml-auto d-flex justify-end">
          <v-btn :color="color" text @click="proceedFunc">Proceed</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    icons: String,
    title: String,
    body: String,
    color: String,
    proceedFunc: {
      type: Function,
      default: () => {
        alert("Add a action on this button");
      },
    },
  },
};
</script>

<style>
</style>