<template>
  <v-row>
    <v-col cols="12">
      <v-sheet rounded style="margin-top: -10px; overflow: hidden" height="300">
        <app-image
          :alt="fullname"
          :src="coverPhoto"
          max-width="100%"
          height="300"
        ></app-image>
      </v-sheet>
    </v-col>
    <v-col
      cols="12"
      class="pl-10 py-3 d-flex flex-column justify-end align-start"
    >
      <v-row style="width: 100%">
        <v-col cols="8">
          <v-row>
            <v-col cols="auto" style="margin-top: -80px">
              <app-avatar
                :alt="fullname"
                :size="220"
                :src="candidate.profile_photo"
              ></app-avatar>
            </v-col>

            <v-col style="height: auto">
              <h1 class="headline-1">{{ fullname }}</h1>
              <p class="mt-2 subtitle-1" v-text="positionTitle"></p>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4" style="margin-top: -70px">
          <v-card>
            <v-list>
              <v-list-item v-if="candidate.election">
                <v-list-item-content>
                  <v-list-item-subtitle>Election</v-list-item-subtitle>
                  <v-list-item-title>
                    <election-chip
                      outlined
                      class="mt-2"
                      :election="candidate.election"
                    ></election-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="candidate.party">
                <v-list-item-content>
                  <v-list-item-subtitle>Party</v-list-item-subtitle>
                  <v-list-item-title>
                    <party-chip
                      outlined
                      class="mt-2"
                      :data="candidate.party"
                    ></party-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item v-if="socials">
                <v-list-item-content>
                  <v-list-item-subtitle>Social Media</v-list-item-subtitle>
                  <v-list-item-title>
                    <template v-for="(item, idx) in socials">
                      <v-btn
                        :key="idx"
                        large
                        icon
                        target="_blank"
                        v-if="item.href"
                        :href="item.href"
                      >
                        <v-icon>{{ item.icon }}</v-icon>
                      </v-btn>
                    </template>
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
import { Candidate, SocialLink } from "@/types/app";
import Vue, { PropOptions } from "vue";
import ElectionChip from "@/components/chips/ElectionChip.vue";
import PartyChip from "@/components/chips/PartyChip.vue";

export default Vue.extend({
  components: { AppImage, AppAvatar, ElectionChip, PartyChip },
  props: {
    candidate: {
      type: Object,
    } as PropOptions<Candidate>,
  },

  computed: {
    coverPhoto(): any {
      return this.candidate.cover_photo;
    },

    fullname(): string {
      return `${this.candidate.firstname} ${this.candidate.middlename}. ${this.candidate.lastname}`;
    },

    positionTitle(): string {
      return this.candidate.position
        ? `for ${this.candidate.position.title}`
        : "";
    },

    socials(): SocialLink[] | null {
      if (!(this.candidate && this.candidate.socials)) {
        return null;
      }

      const { socials } = this.candidate;

      return [
        {
          href: socials?.facebook_url,
          icon: "mdi-facebook",
          title: "Facebook",
        },
        {
          href: socials?.insta_url,
          icon: "mdi-instagram",
          title: "Instagram",
        },
        {
          href: socials?.twitter_url,
          icon: "mdi-twitter",
          title: "Twitter",
        },
        {
          href: socials?.website_url,
          icon: "mdi-web",
          title: "Website",
        },
        {
          href: socials?.linkedin_url,
          icon: "mdi-linkedin",
          title: "LinkedIn",
        },
      ];
    },
  },
});
</script>

<style>
</style>