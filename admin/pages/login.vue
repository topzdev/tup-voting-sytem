<template>
  <page-center>
    <login-form></login-form>
  </page-center>
</template>

<script lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
import PageCenter from "../components/utils/PageCenter.vue";
import Vue from "vue";

export default Vue.extend({
  auth: "guest",
  layout: "basic",
  components: {
    LoginForm,
    PageCenter,
  },
  head: {
    title: "Admin Login",
  },
});
</script>