<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters align="center">
        <v-col cols="auto">
          <v-avatar class="white--text" size="60">
            <app-image size="60" :src="data.logo"></app-image>
          </v-avatar>
        </v-col>
        <v-col class="px-3 d-flex flex-column justify-center text-left">
          <h2 class="title text-truncate text--secondary" :title="data.title">
            {{ data.title }}
            <span class="text--primary font-weight-bold" :title="data.ticker">
              ({{ data.ticker }})
            </span>
          </h2>

          <app-read-more
            class="mb-0 text--secondary"
            :max_length="100"
            :text="data.description"
          />
        </v-col>

        <v-col cols="auto" class="ml-auto">
          <v-btn
            v-if="hideByStatus(pageStatus.party.edit)"
            color="primary"
            text
            @click="editPartyRoute(data.id)"
            >View</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import partyMixin from "@/mixins/party.mixin";
import { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import AppImage from "@/components/app/AppImage.vue";
import { Party } from "@/services/party.service";
import restrictionsMixin from "../../../../mixins/restrictions.mixin";

export default mixins(partyMixin, restrictionsMixin).extend({
  components: { AppImage },
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<Party>,
  },
});
</script>

<style>
</style>