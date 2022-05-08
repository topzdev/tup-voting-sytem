export type AdminUser = {
  id: number;
  username: string;
  email_address: string;
  firstname: string;
  lastname: string;
  disabled: boolean;
  role: string;
  failed_login_time: Date | null;
  reactivate_time: Date | null;
  failed_login_attempts: number;
  last_loggedin_time: Date | null;
  login_otp: string | null;
  last_resend_otp_time: Date | null;
};
