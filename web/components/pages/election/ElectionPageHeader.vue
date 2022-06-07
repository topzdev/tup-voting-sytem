<template>
  <v-row>
    <v-col cols="12">
      <v-sheet
        rounded
        style="margin-top: -10px"
        height="250"
        :color="colors.primary"
      ></v-sheet>
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
                :alt="election.title"
                :size="180"
                :src="election.logo"
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
                {{ election.title }}
              </h1>
              <election-status-chip
                class="font-weight-bold"
                :status="election.final_status"
                dark
                outlined
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col class="mt-lg-n16" cols="12" lg="4">
          <v-card class="w-100">
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle>Description</v-list-item-subtitle>
                  <v-list-item-title
                    style="overflow: auto; white-space: unset"
                    v-text="election.description"
                  >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle>Start Date</v-list-item-subtitle>
                  <v-list-item-title
                    style="overflow: auto; white-space: unset"
                    v-text="startDate"
                  >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle>Close Date</v-list-item-subtitle>
                  <v-list-item-title
                    style="overflow: auto; white-space: unset"
                    v-text="endDate"
                  >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-card-actions class="d-flex px-1">
              <v-row no-gutters>
                <v-col v-if="preRegisterButton.show" cols="12" class="mb-2">
                  <v-btn
                    large
                    :color="colors.primary"
                    block
                    :to="preRegisterButton.url"
                    >Pre-Register As Voter</v-btn
                  >
                </v-col>
                <v-col v-if="voteButton.show" cols="12">
                  <v-btn
                    large
                    :color="colors.primary"
                    :to="voteButton.url"
                    block
                    >Vote Now!</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import { Election } from "@/types/app";
import AppImage from "@/components/app/AppImage.vue";
import AppAvatar from "@/components/app/AppAvatar.vue";
import ElectionStatusChip from "@/components/chips/ElectionStatusChip.vue";
import dayjs from "dayjs";
import pageRoutes from "@/configs/page-routes";
import mixins from "vue-typed-mixins";
import breadcrumbMixins from "@/mixins/breadcrumb.mixins";

export default mixins(breadcrumbMixins).extend({
  components: { AppImage, AppAvatar, ElectionStatusChip },
  props: {
    election: {
      type: Object,
    } as PropOptions<Election>,
  },

  computed: {
    breadcrumb(): any {
      return this.electionBreadcrumb(this.election);
    },

    colors(): { primary: string; secondary: string } {
      const organization = this.election.organization;
      if (!organization)
        return {
          primary: "primary",
          secondary: "primary",
        };

      return {
        primary: organization.theme.primary + " white--text",
        secondary: organization.theme.secondary + "white--text",
      };
    },

    startDate(): string {
      return dayjs(this.election.start_date).format("MMMM DD, YYYY - hh:mm a");
    },
    endDate(): string {
      return dayjs(this.election.close_date).format("MMMM DD, YYYY - hh:mm a");
    },

    voteButton(): any {
      return {
        show: this.election.final_status === "running",
        url: pageRoutes.voting(this.election.slug).this().route,
      };
    },

    preRegisterButton(): any {
      return {
        show:
          this.election.final_status === "preview" &&
          this.election.allow_pre_register,

        url: pageRoutes.preRegister(this.election.slug),
      };
    },
  },
});
</script>

<style>
</style>