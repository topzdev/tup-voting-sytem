<template>
<v-container>
    <v-row class=" mx-auto text-center ">
        <v-col cols="12">
            <h1>Create Party</h1>
        </v-col>

        <v-col align="center" cols="12">
          <v-container class="partylist-header">
            <v-btn plain :color="background" class="coer-uploader">
            <v-img max-height="100%"
            src="https://picsum.photos/id/11/500/300"
            ></v-img>
          </v-btn>
          </v-container>
        </v-col>
        <v-col align="center" cols="12">
            <v-avatar :color="background" size="140" class="logo-uploader">
                <template v-if="!parsedUrl"> Logo Here </template>
                <template v-else>
                <v-img :src="parsedUrl"></v-img>
                </template>

                <input
                type="file"
                class="logo-uploader__input"
                accept="image/*"
                @change="onFileChange"
                />
            </v-avatar>
        </v-col>

        <v-col cols="12">
            <v-text-field
            label="Partylist Name"
            outlined
            placeholder="Tatakbo At Boboto laban sa Oligarka "
            
            hide-details="auto"
            ></v-text-field>
        </v-col>
        
        <v-col cols="12">
            <v-text-field
            label="Partylist Ticker/Alias"
            outlined
            placeholder="TABO"
            
            hide-details="auto"
            ></v-text-field>
        </v-col>

        <v-col cols="12">
            <v-textarea
            label="Partylist Description"
            outlined
            placeholder="Para sa Bayan"
            
            hide-details="auto"
            ></v-textarea>
        </v-col>

        <v-col class="d-flex" cols="4">
          <v-btn
            plain 
            color="secondary"
            :disabled="loading"
            :loading="loading"
            large
            block
            @click="cancel"
            >cancel</v-btn
          >
        </v-col>

        <v-col class="d-flex" cols="4" md="4"
        offset-md="4">
          <v-btn
            color="primary"
            :disabled="loading"
            :loading="loading"
            large
            block
            @click="submit"
            >Submit</v-btn
          >
        </v-col>

    </v-row>
</v-container>
  
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  props: ["value"],
  props: {
    url: String,

    rules: Array,
  },

  data() {
    return {
      parsedUrl: null,
    };
  },

  watch: {
    url: {
      immediate: true,
      handler: function (value, oldVal) {
        this.parsedUrl = value;
      },
    },
  },

  computed: {
    background() {
      return !this.parsedUrl ? "grey white--text" : "";
    },
  },

  methods: {
    onFileChange(events) {
      const files = events.target.files;

      if (files && files.length) {
        const file = files[0];
        this.parsedUrl = URL.createObjectURL(file);
        this.$emit("input", file);
      }
    },
  },
});
</script>

<style lang="scss">
.logo-uploader {
  &__input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
    opacity: 0;
    cursor: pointer;
  }
}

.partylist-header {
  padding-top: 40mm;
}
</style>