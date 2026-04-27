export const apiRoutes = {
  DOCS: { BASE: 'docs' },
  SETUP: {
    BASE: 'setup',
    ENABLED: 'enabled',
    VERIFY_EMAIL: 'verify-email',
    CONFIRM_EMAIL: 'confirm-email',
    STATUS: 'status',
    INITIAL_ADMIN: 'initial-admin',
  },
  AUTH: {
    BASE: 'auth',
    REGISTER: 'register',
    LOGIN: 'login',
    VERIFY_EMAIL: 'verify-email',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
    ME: 'me',
  },
  PROFILES: { BASE: 'profiles' },
  IMAGES: { BASE: 'images' },
  TAGS: {
    BASE: 'tags',
    NAME: 'name/:name',
    ID: 'id/:id',
    AS_ADMIN: 'admin',
    NAME_AS_ADMIN: 'admin/name/:name',
    ID_AS_ADMIN: 'admin/id/:id',
  },
  IMAGE_TAGS: { BASE: 'image-tags' },
  FAVORITES: { BASE: 'favorites' },
} as const;

// /auth
//   POST /forgot-password
//   POST /reset-password
//   POST /2fa/enable
//   POST /2fa/verify
//   POST /2fa/disable

// /profiles
//   GET /me
//   PATCH /me
//   PATCH /me/email
//   PATCH /me/password
//   DELETE /me
