<template>
  <v-card v-if="defaultData" outlined flat class="px-2 py-4">
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
          <b>{{ defaultData.user.email_address }} </b>
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
              @finish="onFinish"
              :length="length"
              type="number"
            ></v-otp-input>
          </v-col>
          <v-col>
            <p class="mb-0">
              Didn't get the OTP?
              <v-btn
                type="button"
                v-if="showResendCoundDown"
                text
                small
                color="secondary"
                @click="resendOTP"
                >Resend OTP</v-btn
              >
              <template v-else
                >Please wait for {{ resend_timer }}s to request again.</template
              >
            </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn
          :loading="loading"
          :disabled="loading"
          type="submit"
          color="primary"
          block
          large
        >
          Verify
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import icons from "@/configs/icons";
import authServices, { AdminLoginReturn } from "@/services/auth.service";
import dayjs from "dayjs";
import { ErrorTypes } from "@/pages/login.vue";

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
    setSuccess: {
      type: Function,
    } as PropOptions<(data: AdminLoginReturn) => void>,

    setError: {
      type: Function,
    } as PropOptions<(type: ErrorTypes) => void>,
    data: {
      type: Object,
      // default: {
      //   otp_resend_interval: 500,
      //   last_resend_otp_time: new Date(),
      //   user: {
      //     email_address: "christianlugod05@gmail.com",
      //     id: 3,
      //     firstname: "Christian",
      //     lastname: "Lugod",
      //   },
      // },
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
      resend_timer: 0,
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
      return this.resend_timer <= 0;
    },

    isActive(): boolean {
      return this.form.otp.length === this.length;
    },
  },
  watch: {
    data: {
      handler(value) {
        if (value) {
          this.defaultData = JSON.parse(JSON.stringify(value));
        }
      },
      immediate: true,
    },

    resend_timer: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.resend_timer--;
          }, 1000);
        }
      },
      immediate: true,
    },
  },

  methods: {
    onFinish(otp: string) {
      this.form.otp = otp;
    },
    async resendOTP() {
      if (!this.defaultData) return;

      if (!this.showResendCoundDown) return;

      try {
        const result = await authServices.resendAdminLoginOTP({
          user_id: this.defaultData.user.id,
        });

        this.resend_timer = result.otp_resend_interval;

        this.defaultData = result;

        this.alert = {
          show: true,
          type: "success",
          message: "OTP sent to your email",
        };
      } catch (error: any) {
        const message = error.response?.data?.error?.message || error.message;

        if (message) {
          this.alert = {
            show: true,
            type: "error",
            message: message,
          };
        }
      }
    },

    async submit() {
      if (!this.defaultData) return;

      (this.$refs as any).form.validate();

      if (this.valid) {
        try {
          this.loading = true;
          const result = await this.$auth.loginWith("local", {
            data: { otp: this.form.otp, user_id: this.defaultData.user.id },
          });
        } catch (error: any) {
          if (error || error.response.data.error) {
            const message =
              error.response?.data?.error?.message || error.message;

            console.log(message);

            if (message) {
              if (typeof message === "string") {
                this.alert = {
                  show: true,
                  type: "error",
                  message: message,
                };
              } else if (typeof message === "object") {
                if (message.disabledError) {
                  this.setError("disabled-account");
                } else if (message.attemptsError) {
                  this.setError("attempt-error");
                }
              }
            }
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