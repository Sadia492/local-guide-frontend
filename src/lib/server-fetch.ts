import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL = "http://localhost:5000/api/";

// Track if we're already refreshing to prevent loops
let isRefreshing = false;

const serverFetchHelper = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const { headers, ...restOptions } = options;
  const accessToken = await getCookie("accessToken");

  // Only try to refresh token if:
  // 1. We have an endpoint that requires auth
  // 2. We're not already refreshing
  // 3. It's not the refresh token endpoint itself
  if (
    endpoint !== "/auth/refresh-token" &&
    !endpoint.includes("/auth/") && // Or add other public endpoints
    !isRefreshing &&
    accessToken // Only refresh if we have an expired token
  ) {
    try {
      isRefreshing = true;
      await getNewAccessToken();
    } finally {
      isRefreshing = false;
    }
  }

  const response = await fetch(`${BACKEND_API_URL}fwfqwf${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Important for cookies
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};
