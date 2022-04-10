import Middleware from './middleware'
import { Auth, authMiddleware, ExpiredAuthSessionError } from '~auth/runtime'

// Active schemes
import { Oauth2Scheme } from '~auth/runtime'
import { LocalScheme } from '~auth/runtime'

Middleware.auth = authMiddleware

export default function (ctx, inject) {
  // Options
  const options = {
  "resetOnError": true,
  "ignoreExceptions": false,
  "scopeKey": "scope",
  "rewriteRedirects": true,
  "fullPathRedirect": false,
  "watchLoggedIn": true,
  "redirect": false,
  "vuex": {
    "namespace": "auth"
  },
  "cookie": {
    "prefix": "auth.",
    "options": {
      "path": "/"
    }
  },
  "localStorage": {
    "prefix": "auth."
  },
  "defaultStrategy": "google"
}

  // Create a new Auth instance
  const $auth = new Auth(ctx, options)

  // Register strategies
  // google
  $auth.registerStrategy('google', new Oauth2Scheme($auth, {
  "clientId": "193167905393-lfmi2jajb0e9nec0e5jttd7kodeof50c.apps.googleusercontent.com",
  "redirectUri": "http://localhost:7000/pre-register/",
  "accessType": "offline",
  "responseType": "code",
  "scope": [
    "openid",
    "profile",
    "email",
    "profile",
    "email"
  ],
  "prompt": "consent",
  "state": "UNIQUE_AND_NON_GUESSABLE",
  "codeChallengeMethod": "",
  "responseMode": "",
  "acrValues": "",
  "endpoints": {
    "authorization": "https://accounts.google.com/o/oauth2/auth",
    "userInfo": "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  "grantType": "authorization_code",
  "name": "google"
}))

  // local
  $auth.registerStrategy('local', new LocalScheme($auth, {
  "token": {
    "property": "token",
    "global": true
  },
  "user": {
    "property": "user"
  },
  "endpoints": {
    "login": {
      "url": "/api/v1/auth/voter/login",
      "method": "post"
    },
    "logout": {
      "url": "/api/v1/auth/voter/logout",
      "method": "post"
    },
    "user": {
      "url": "/api/v1/auth/voter/me",
      "method": "get"
    }
  },
  "name": "local"
}))

  // Inject it to nuxt context as $auth
  inject('auth', $auth)
  ctx.$auth = $auth

  // Initialize auth
  return $auth.init().catch(error => {
    if (process.client) {
      // Don't console log expired auth session errors. This error is common, and expected to happen.
      // The error happens whenever the user does an ssr request (reload/initial navigation) with an expired refresh
      // token. We don't want to log this as an error.
      if (error instanceof ExpiredAuthSessionError) {
        return
      }

      console.error('[ERROR] [AUTH]', error)
    }
  })
}
