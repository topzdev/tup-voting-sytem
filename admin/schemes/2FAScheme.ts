import { HTTPRequest, HTTPResponse, LocalScheme } from "@nuxtjs/auth-next";

const twoFATokenName = "2fa_token";

export default class CustomScheme extends LocalScheme {
  async login(
    endpoint: HTTPRequest,
    { reset = true } = {}
  ): Promise<HTTPResponse> {
    if (!this.options.endpoints.login) {
      return;
    }

    // Ditch any leftover local tokens before attempting to log in
    if (reset) {
      this.$auth.reset({ resetInterceptor: false });
    }

    // Add client id to payload if defined
    if (this.options.clientId) {
      endpoint.data.client_id = this.options.clientId;
    }

    // Add grant type to payload if defined
    if (this.options.grantType) {
      endpoint.data.grant_type = this.options.grantType;
    }

    // Add scope to payload if defined
    if (this.options.scope) {
      endpoint.data.scope = this.options.scope;
    }

    // Make login request
    const response = await this.$auth.request(
      endpoint,
      this.options.endpoints.login
    );

    // check if 2fa email token is expired
    const twoFAToken = this.$auth.$storage.getState(twoFATokenName);

    if (twoFAToken)
      // Update tokens
      this.updateTokens(response);

    // Initialize request interceptor if not initialized
    if (!this.requestHandler.interceptor) {
      this.initializeRequestInterceptor();
    }

    // Fetch user if `autoFetch` is enabled
    if (this.options.user.autoFetch) {
      await this.fetchUser();
    }

    return response;
  }
}
