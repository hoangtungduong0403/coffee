import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: ({ accessToken, refreshToken }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let logoutHandler = null;
export const setLogoutHandler = (fn) => {
  logoutHandler = fn;
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccess();
    if (token && !config.url?.includes("/auth")) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- refresh-on-401 with single-flight queue ---
let refreshing = null;
const waitQueue = [];

const flushQueue = (error, token) => {
  waitQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  waitQueue.length = 0;
};

const refreshAccessToken = async () => {
  const refreshToken = tokenStorage.getRefresh();
   if (!refreshToken) {
    tokenStorage.clear();
    if (logoutHandler) logoutHandler(); 
    throw new Error("No refresh token");
  }


  const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  tokenStorage.set(res.data);
  return res.data.accessToken;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config;

    const isAuthCall = original?.url?.includes("/auth");
    const alreadyRetried = original?._retry;

    if (status !== 401 || isAuthCall || alreadyRetried) {
      return Promise.reject(error);
    }

    original._retry = true;

    // a refresh is already in-flight: queue and resume once it lands
    if (refreshing) {
      return new Promise((resolve, reject) => {
        waitQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    refreshing = refreshAccessToken();

    try {
      const newToken = await refreshing;
      flushQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshErr) {
      flushQueue(refreshErr, null);
      tokenStorage.clear();
      if (logoutHandler) logoutHandler();
      return Promise.reject(refreshErr);
    } finally {
      refreshing = null;
    }
  }
);

export default api;
