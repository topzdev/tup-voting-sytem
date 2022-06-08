<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col class="d-flex align-start" cols="auto">
          <v-avatar size="50" :title="data.ticker">
            <app-image :size="50" :src="data.logo" :alt="data.title" />
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2 class="title text-truncate text--primary" :title="data.title">
            {{ data.title }} <b>({{ data.ticker }})</b>
          </h2>
          <app-read-more
            class="mb-0 text--secondary"
            :max_length="100"
            :text="data.description"
          />
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn color="primary" text :to="`/organization/${data.id}`"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Organization } from "@/services/organization.service";
import AppImage from "@/components/app/AppImage.vue";

export default Vue.extend({
  components: {
    AppImage,
  },
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Organization>,
  },
  computed: {
    trimmedDescription(): string {
      const description = this.data.description;
      return description.length >= 250
        ? description.split("").splice(0, 250).join("") + "..."
        : description;
    },
  },
});
</script>

<style>
</style>