<template>
  <span v-resize="onResize">
    <v-tooltip color="info" v-model="tooltip" left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          color="info"
          :right="true"
          :bottom="true"
          fixed
          dark
          large
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
          style="bottom: 90px"
        >
          <v-icon>mdi-vote</v-icon>
        </v-btn>
      </template>
      <span>How to Vote?</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="700">
      <v-card>
        <v-card-title> How to vote </v-card-title>

        <v-card-text>
          <v-carousel
            v-model="current"
            hide-delimiters
            :height="carouselHeight"
          >
            <v-carousel-item
              v-for="(item, i) in tutorial"
              :key="i"
              :src="item.image"
            >
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-subtitle
          ><b>Step {{ this.current + 1 }}: </b>
          {{ tutorial[this.current].message }}</v-card-subtitle
        >

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";

export default Vue.extend({
  data() {
    return {
      dialog: false,
      current: 0,
      tooltip: true,
      carouselHeight: 400,
    };
  },
  computed: {
    tutorial() {
      return [
        {
          image: "/images/how-to-vote/1.jpg",
          message: "Click on the election you want to vote with",
        },
        {
          image: "/images/how-to-vote/2.jpg",
          message: `On election you selected, find "Vote Now" and click it.`,
        },
        {
          image: "/images/how-to-vote/3.jpg",
          message:
            "When the election started, the voter id and pin will be sent into your email and use it to login",
        },
        {
          image: "/images/how-to-vote/4.jpg",
          message:
            "After logging in you will be redirected to your ballot, select the candidate you want to vote.",
        },
        {
          image: "/images/how-to-vote/5.jpg",
          message:
            'If you are done selecting the candidate click "Next" to review your ballot',
        },
        {
          image: "/images/how-to-vote/6.jpg",
          message:
            'Done reviewing your vote? submit it by clicking the "Submit Ballot"',
        },
        {
          image: "/images/how-to-vote/7.jpg",
          message:
            "When ballot submitted review your ballot receipt, then click Logout when done.",
        },
      ];
    },
  },

  mounted() {
    this.onResize();
  },

  methods: {
    onResize() {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 600) {
        this.carouselHeight = 200;
      } else if (windowWidth > 600 && windowWidth <= 960) {
        this.carouselHeight = 350;
      } else {
        this.carouselHeight = 400;
      }
    },
  },
});
</script>

<style>
</style>