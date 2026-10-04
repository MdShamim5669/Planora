import Cookies from 'js-cookie';

const TOKEN_KEY = 'planora_token';

export const setAuthToken = (token: string, days = 7) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: days,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
};
