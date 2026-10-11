import type { CookieOptions } from 'express';

export const AUTH_COOKIE = 'access_token';
export const TOKEN_TTL_SECONDS = 60 * 60; // 1 hora

export const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

export const authCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: TOKEN_TTL_SECONDS * 1000,
};
