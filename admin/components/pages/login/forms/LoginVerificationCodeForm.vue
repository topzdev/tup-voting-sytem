<template>
  <v-card outlined flat class="px-2 py-4">
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <v-card-text class="text-center">
        <v-icon
          color="primary"
          size="70"
          class="mb-3"
          v-text="icons.accountLocked"
        ></v-icon>
        <h2 class="headline font-weight-bold mb-2 text--primary">
          2 Step Verification
        </h2>
        <p class="body-1">
          An email with a verification code was sent to
          <b>{{ data.user.email_address }} </b>
        </p>
        <v-row no-gutters>
          <v-col v-if="alert.show" class="mb-2" cols="12">
            <v-alert
              dense
              text
              width="auto"
              :type="alert.type"
              v-model="alert.show"
              dismissible
              class="mb-0"
            >
              {{ alert.message }}
            </v-alert>
          </v-col>
          <v-col cols="12">
            <v-otp-input
              v-model="form.otp"
              :length="length"
              type="number"
            ></v-otp-input>
          </v-col>
          <v-col>
            <p class="mb-0">
              Didn't get the OTP?
              <v-btn v-if="showResendCoundDown" text small color="secondary"
                >Resend OTP</v-btn
              >
              <template v-else
                >({{ otpResendIntervalToSecond }}seconds left)</template
              >
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn :loading="loading" type="button" color="primary" block large>
          Verify
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import icons from "@/configs/icons";
import { AdminLoginReturn } from "@/services/auth.service";
import dayjs from "dayjs";

const defaultForm = {
  otp: "",
};

const defaultAlert = {
  show: false,
  type: "",
  message: "",
};

export default Vue.extend({
  props: {
    data: {
      type: Object,
      default: {
        otp_resend_interval: 500,
        last_resend_otp_time: new Date(),
        user: {
          email_address: "christianlugod05@gmail.com",
          id: 3,
          firstname: "Christian",
          lastname: "Lugod",
        },
      },
    } as PropOptions<AdminLoginReturn>,
  },
  data() {
    return {
      valid: false,
      loading: false,
      icons,
      alert: Object.assign({}, defaultAlert),
      form: Object.assign({}, defaultForm),
      length: 6,
      defaultData: null as AdminLoginReturn | null,
    };
  },
  computed: {
    otpResendIntervalToSecond(): number {
      const last_resend = dayjs(this.data.last_resend_otp_time);
      const current_datetime = dayjs();
      const second_diff = current_datetime.diff(last_resend, "second");

      return second_diff;
    },

    showResendCoundDown(): boolean {
      if (!this.data.last_resend_otp_time) return false;

      return this.otpResendIntervalToSecond < this.data.otp_resend_interval;
    },

    isActive(): boolean {
      return this.form.otp.length === this.length;
    },
  },
  watch: {
    data: {
      handler(value) {
        this.defaultData = JSON.parse(JSON.stringify(value));
      },
      immediate: true,
    },
  },

  methods: {
    async resendOTP() {},

    async submit() {
      if (false) return;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          this.loading = true;
          const result = await this.$auth.loginWith("local", {
            data: { ...this.form },
          });
        } catch (error: any) {
          const message = error.response?.data?.error?.message || error.message;

          if (message) {
            this.alert = {
              show: true,
              type: "error",
              message: message,
            };
          }
        } finally {
          this.loading = false;
        }
      }
    },
  },
});
</script>

<style>
</style>