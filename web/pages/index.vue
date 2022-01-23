<template>
  <h1>Homepage <v-btn @click="$auth.logout('local')"> Logout </v-btn></h1>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>
