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
          :alt="fullname"
          :src="coverPhoto"
          max-width="100%"
          height="300"
        ></app-image>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="px-lg-10">
      <v-row>
        <v-col cols="12" lg="8">
          <v-row>
            <v-col
              cols="12"
              lg="auto"
              style="margin-top: -80px"
              class="text-lg-left text-center"
            >
              <app-avatar
                :alt="fullname"
                :size="200"
                :src="candidate.profile_photo"
              ></app-avatar>
            </v-col>

            <v-col
              cols="12"
              lg=""
              class="pt-0 text-center text-lg-left"
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
                {{ fullname }}
              </h1>
              <p class="text--secondary body-1" v-html="positionTitle"></p>
            </v-col>
          </v-row>
        </v-col>

        <v-col class="mt-lg-n16 mt-auto" cols="12" lg="4">
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
import mixins from "vue-typed-mixins";
import breadcrumbMixins from "@/mixins/breadcrumb.mixins";

export default mixins(breadcrumbMixins).extend({
  components: { AppImage, AppAvatar, ElectionChip, PartyChip },
  props: {
    candidate: {
      type: Object,
    } as PropOptions<Candidate>,
  },

  computed: {
    breadcrumb(): any {
      const candidate = this.candidate;
      if (!candidate.election) return;
      return this.candidateBreadcrumb(candidate.election, candidate);
    },

    coverPhoto(): any {
      return this.candidate.cover_photo;
    },

    fullname(): string {
      return `${this.candidate.firstname} ${this.candidate.middlename}. ${this.candidate.lastname}`;
    },

    positionTitle(): string {
      return this.candidate.position
        ? `for <b class="text--primary">${this.candidate.position.title}</b>`
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