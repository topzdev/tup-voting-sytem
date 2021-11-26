<template>
  <div class="d-flex align-center justify-center w-100" style="height: 100vh">
    <login-form></login-form>
  </div>
</template>

<script lang="ts">
import LoginForm from "@/components/forms/LoginForm.vue";
import Vue from "vue";

export default Vue.extend({
  auth: "guest",
  layout: "basic",
  components: {
    LoginForm,
  },
});
</script>