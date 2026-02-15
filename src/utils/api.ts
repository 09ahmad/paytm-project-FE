import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Types
export interface SignupRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface UserProfile extends User {
  balance: number;
}

export interface BulkUsersResponse {
  user: User[];
}

export interface BalanceResponse {
  balance: number;
}

export interface TransferRequest {
  to: string;
  amount: number;
  description?: string;
}

export interface TransferResponse {
  message: string;
  data?: {
    fromBalance: number;
    toBalance: number;
    amount: number;
    receiver: {
      name: string;
      username: string;
    };
  };
}

export interface UpdateUserRequest {
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface TransactionUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Transaction {
  _id: string;
  fromUser: TransactionUser;
  toUser: TransactionUser;
  amount: number;
  type: "sent" | "received";
  description: string;
  timestamp: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TransactionStats {
  totalSent: number;
  totalReceived: number;
  transactionCount: number;
  recentCount: number;
  netAmount: number;
}

export interface UserProfileResponse {
  user: UserProfile;
}

// API functions
export const authAPI = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/user/signup", data);
    return response.data;
  },

  signin: async (data: SigninRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/user/signin", data);
    return response.data;
  },

  updateUser: async (data: UpdateUserRequest): Promise<{ message: string }> => {
    const response = await apiClient.put<{ message: string }>("/user/", data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>("/user/me");
    return response.data;
  },
};

export const accountAPI = {
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await apiClient.get<BalanceResponse>("/account/balance");
    return response.data;
  },

  transfer: async (data: TransferRequest): Promise<TransferResponse> => {
    const response = await apiClient.post<TransferResponse>(
      "/account/transfer",
      data
    );
    return response.data;
  },

  getTransactions: async (
    page: number = 1,
    limit: number = 10,
    type?: "sent" | "received"
  ): Promise<TransactionsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) {
      params.append("type", type);
    }
    const response = await apiClient.get<TransactionsResponse>(
      `/account/transactions?${params.toString()}`
    );
    return response.data;
  },

  getStats: async (): Promise<TransactionStats> => {
    const response = await apiClient.get<TransactionStats>("/account/stats");
    return response.data;
  },
};

export const userAPI = {
  getBulkUsers: async (filter: string = ""): Promise<BulkUsersResponse> => {
    const response = await apiClient.get<BulkUsersResponse>(
      `/user/bulk?filter=${encodeURIComponent(filter)}`
    );
    return response.data;
  },
};

export default apiClient;
