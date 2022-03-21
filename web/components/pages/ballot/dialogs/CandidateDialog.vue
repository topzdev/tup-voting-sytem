<template>
  <v-dialog v-model="dialog" width="560px">
    <v-card v-if="data">
      <span class="d-flex flex-column">
        <app-image
          class="cover-photo"
          width="580px"
          height="230px"
          :src="data.cover_photo"
        />

        <v-avatar
          size="200"
          color="white"
          class="profile-photo mx-auto v-sheet"
        >
          <app-image size="200" :src="data.profile_photo"></app-image>
        </v-avatar>
      </span>

      <v-card-text class="text-center pb-0">
        <v-col cols="12">
          <h2
            class="text--primary font-weight-bold headline"
            v-text="fullname"
          />
          <p
            v-if="positionText"
            class="mt-1 subtitle-1"
            v-html="positionText"
          />
        </v-col>
      </v-card-text>

      <v-list>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Party</v-list-item-subtitle>
            <v-list-item-title>
              <party-chip :data="data.party"></party-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Description</v-list-item-subtitle>
            <v-list-item-title v-html="data.description"> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>Platform</v-list-item-subtitle>
            <v-list-item-title v-html="data.platform"> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

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

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="dialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import AppImage from "@/components/app/AppImage.vue";
import PartyChip from "@/components/chips/PartyChip.vue";

type SocialLink = {
  href: string | null;
  icon: string;
  title: string;
};

export default Vue.extend({
  components: { AppImage, PartyChip },
  data() {
    return {
      dialog: false,
    };
  },

  computed: {
    data() {
      return this.$accessor.ballot.candidate;
    },

    fullname(): string {
      if (!this.data) return "";
      const { firstname, lastname, middlename } = this.data;
      return [firstname, middlename, lastname].join(" ");
    },

    positionText(): string {
      if (!this.data) return "";
      const { position } = this.data;

      return `for <b>${position?.title}</b>`;
    },

    socials(): SocialLink[] | null {
      if (!(this.data && this.data.socials)) {
        return null;
      }

      const { socials } = this.data;

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

  watch: {
    data(value) {
      this.dialog = !!value;
    },

    dialog(value) {
      if (!value) this.$accessor.ballot.setCandidate(null);
    },
  },
});
</script>

<style scoped>
.profile-photo {
  margin-top: -80px;
  border: 1px solid lightgrey;
}

.cover-photo {
  border-bottom: 1px solid lightgrey;
}
</style>