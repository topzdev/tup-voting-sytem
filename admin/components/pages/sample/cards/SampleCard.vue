<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar color="primary" class="white--text" size="50">
            <app-image
              src="https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg"
            ></app-image>
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2 class="title text-truncate text--primary" :title="data.username">
            {{ data.username }}
          </h2>
          <p v-if="data.description" class="body-2 my-0 text--secondary">
            {{ data.description }}
          </p>
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text @click="editSampleRoute(data.id)"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import sampleMixin from "@/mixins/sample.mixin";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import AppImage from "@/components/app/AppImage.vue";

export default mixins(sampleMixin).extend({
  components: { AppImage },
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<any>,
  },
});
</script>

<style>
</style>