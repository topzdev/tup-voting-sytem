<template>
  <v-row>
    <v-col cols="12">
      <v-sheet
        rounded
        style="margin-top: -10px; overflow: hidden"
        height="250"
        outlined
      >
        <app-image
          :alt="party.title"
          :src="party.cover_photo"
          max-width="100%"
          height="300"
        ></app-image>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="px-lg-10">
      <v-row>
        <v-col class="pt-0" cols="12" lg="8">
          <v-row>
            <v-col
              class="text-lg-left text-center"
              cols="12"
              lg="auto"
              style="margin-top: -80px"
            >
              <app-avatar
                :alt="party.title"
                :size="200"
                :src="party.logo"
              ></app-avatar>
            </v-col>

            <v-col
              class="text-lg-left text-center"
              cols="12"
              lg=""
              style="height: auto"
            >
              <v-breadcrumbs
                class="
                  px-auto
                  py-0
                  px-lg-0
                  d-flex
                  justify-center justify-lg-start
                "
                divider="/"
                :items="breadcrumb"
              ></v-breadcrumbs>
              <h1>
                {{ party.title }}

                <span class="text--secondary"> ({{ party.ticker }}) </span>
              </h1>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="mt-lg-n16" cols="12" lg="4">
          <v-card>
            <v-list>
              <v-list-item v-if="party.description">
                <v-list-item-content>
                  <v-list-item-subtitle>Description</v-list-item-subtitle>
                  <v-list-item-title v-html="party.description">
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="party.election">
                <v-list-item-content>
                  <v-list-item-subtitle>Election</v-list-item-subtitle>
                  <v-list-item-title>
                    <election-chip
                      outlined
                      class="mt-2"
                      :election="party.election"
                    ></election-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import AppAvatar from "@/components/app/AppAvatar.vue";
import AppImage from "@/components/app/AppImage.vue";
import ElectionChip from "@/components/chips/ElectionChip.vue";
import PartyChip from "@/components/chips/PartyChip.vue";
import { Party } from "@/types/app";
import Vue, { PropOptions } from "vue";
import mixins from "vue-typed-mixins";
import breadcrumbMixins from "@/mixins/breadcrumb.mixins";

export default mixins(breadcrumbMixins).extend({
  components: { AppImage, AppAvatar, ElectionChip, PartyChip },
  props: {
    party: {
      type: Object,
    } as PropOptions<Party>,
  },

  computed: {
    breadcrumb(): any {
      const party = this.party;
      if (!party.election) return;
      return this.partyBreadcrumb(party.election, party);
    },
  },
});
</script>

<style>
</style>