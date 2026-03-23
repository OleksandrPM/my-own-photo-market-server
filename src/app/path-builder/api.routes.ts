export const ApiRoutes = {
  DOCS: { BASE: 'docs' },
  AUTH: {
    BASE: 'auth',
    REGISTER: 'register',
    LOGIN: 'login',
    VERIFY_EMAIL: 'verify-email',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    ME: 'me',
  },
  USERS: { BASE: 'users' },
  IMAGES: { BASE: 'images' },
  TAGS: { BASE: 'tags' },
  IMAGE_TAGS: { BASE: 'image-tags' },
  FAVORITES: { BASE: 'favorites' },
} as const;

// /auth
//   POST /forgot-password
//   POST /reset-password
//   POST /2fa/enable
//   POST /2fa/verify
//   POST /2fa/disable

// /users
//   GET /me
//   PATCH /me
//   PATCH /me/email
//   PATCH /me/password
//   DELETE /me
