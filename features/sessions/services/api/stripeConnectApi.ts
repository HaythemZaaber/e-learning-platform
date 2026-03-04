import { ApiError } from "./sessionBookingApi";

// =============================================================================
// STRIPE CONNECT TYPES
// =============================================================================

export interface StripeConnectAccount {
  id: string;
  object: string;
  business_type: string;
  country: string;
  email: string;
  requirements: any;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export interface CreateStripeConnectAccountRequest {
  country: string;
  email: string;
  businessType: "individual" | "company";
  individual?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    dob?: {
      day: number;
      month: number;
      year: number;
    };
  };
  company?: {
    name: string;
    phone?: string;
    address?: {
      line1: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface StripeConnectAccountResponse {
  success: boolean;
  accountId?: string;
  accountLink?: string;
  account?: StripeConnectAccount;
  error?: string;
}

export interface StripeConnectAccountLinkResponse {
  success: boolean;
  accountLink?: string;
  error?: string;
}

// =============================================================================
// STRIPE CONNECT API SERVICE
// =============================================================================

export class StripeConnectApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  private convertToStripeFormat(data: any): any {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.convertToStripeFormat(item));
    }

    const converted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip undefined or null values
      if (value === undefined || value === null) {
        continue;
      }

      // Convert key to snake_case
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );

      // Handle objects
      if (typeof value === "object" && !Array.isArray(value)) {
        const cleanedValue = this.convertToStripeFormat(value);

        // Check if the cleaned object is effectively empty
        // (no properties or all properties are empty strings)
        const hasNonEmptyValues = Object.values(cleanedValue).some(
          (val) => val !== "" && val !== null && val !== undefined
        );

        // Only include if the cleaned object has meaningful data
        if (Object.keys(cleanedValue).length === 0 || !hasNonEmptyValues) {
          continue;
        }
        converted[snakeKey] = cleanedValue;
      } else {
        // Skip empty strings for optional fields
        if (value === "") {
          continue;
        }
        converted[snakeKey] = value;
      }

      // Debug logging for key conversions
      if (key !== snakeKey) {
        console.log(`Converting key: ${key} -> ${snakeKey}`);
      }
    }
    return converted;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0
      );
    }
  }

  // =============================================================================
  // STRIPE CONNECT ACCOUNT MANAGEMENT
  // =============================================================================

  async createStripeConnectAccount(
    accountData: CreateStripeConnectAccountRequest,
    token: string
  ): Promise<StripeConnectAccountResponse> {
    // Deep clone to avoid mutating original data
    const cleanedData = JSON.parse(JSON.stringify(accountData));

    // Remove empty company object if businessType is individual
    if (cleanedData.businessType === "individual" && cleanedData.company) {
      delete cleanedData.company;
    }
    // Remove empty individual object if businessType is company
    if (cleanedData.businessType === "company" && cleanedData.individual) {
      delete cleanedData.individual;
    }

    // Clean up empty nested objects in individual
    if (cleanedData.individual) {
      if (cleanedData.individual.address) {
        const address = cleanedData.individual.address;
        const hasData =
          address.line1 || address.city || address.state || address.postalCode;
        if (!hasData) {
          delete cleanedData.individual.address;
        } else {
          Object.keys(address).forEach((key) => {
            if (
              address[key] === "" ||
              address[key] === null ||
              address[key] === undefined
            ) {
              delete address[key];
            }
          });
          if (Object.keys(address).length === 0) {
            delete cleanedData.individual.address;
          }
        }
      }

      if (
        cleanedData.individual.dob &&
        cleanedData.individual.dob.day === 1 &&
        cleanedData.individual.dob.month === 1 &&
        cleanedData.individual.dob.year === 1990
      ) {
        delete cleanedData.individual.dob;
      }

      if (
        cleanedData.individual.phone === "" ||
        cleanedData.individual.phone === null
      ) {
        delete cleanedData.individual.phone;
      }
    }

    // Ensure required top-level fields are present
    if (
      !cleanedData.country ||
      !cleanedData.email ||
      !cleanedData.businessType
    ) {
      throw new ApiError(
        "Missing required fields: country, email, and businessType are required",
        400
      );
    }

    // Debug logging
    console.log("=== FRONTEND API SERVICE DEBUG ===");
    console.log("API Service: Original data:", accountData);
    console.log("API Service: Cleaned data:", cleanedData);
    console.log(
      "API Service: Final payload:",
      JSON.stringify(cleanedData, null, 2)
    );
    console.log("API Service: Token present:", !!token);
    console.log("==================================");

    const requestBody = JSON.stringify(cleanedData);
    console.log("Request body string:", requestBody);
    console.log("Request body length:", requestBody.length);

    return this.request<StripeConnectAccountResponse>(
      "/payments/connect/accounts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Explicitly set
        },
        body: requestBody,
      }
    );
  }
  async getStripeConnectAccount(
    token: string
  ): Promise<StripeConnectAccountResponse> {
    return this.request<StripeConnectAccountResponse>(
      "/payments/connect/accounts",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async createStripeConnectAccountLink(
    token: string
  ): Promise<StripeConnectAccountLinkResponse> {
    return this.request<StripeConnectAccountLinkResponse>(
      "/payments/connect/accounts/links",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  // =============================================================================
  // PAYMENT PROCESSING
  // =============================================================================

  async createPaymentIntent(
    bookingData: {
      timeSlotId: string;
      offeringId: string;
      studentId: string;
      agreedPrice: number;
      currency: string;
      customTopic?: string;
      studentMessage?: string;
      customRequirements?: string;
      returnUrl: string;
      cancelUrl: string;
    },
    token: string
  ): Promise<{
    success: boolean;
    paymentIntent?: {
      id: string;
      client_secret: string;
      amount: number;
      currency: string;
      status: string;
    };
    error?: string;
  }> {
    return this.request("/payments/intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    payment?: {
      id: string;
      status: string;
      amount: number;
      currency: string;
    };
    error?: string;
  }> {
    return this.request("/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    });
  }

  async getPaymentIntent(
    paymentIntentId: string,
    token: string
  ): Promise<{
    success: boolean;
    paymentIntent?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      client_secret: string;
    };
    error?: string;
  }> {
    return this.request(`/payments/intents/${paymentIntentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // PAYMENT METHODS
  // =============================================================================

  async getPaymentMethods(token: string): Promise<{
    success: boolean;
    paymentMethods?: Array<{
      id: string;
      type: string;
      card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      };
    }>;
    error?: string;
  }> {
    return this.request("/payments/methods", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async savePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    paymentMethod?: {
      id: string;
      type: string;
    };
    error?: string;
  }> {
    return this.request("/payments/methods", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethodId }),
    });
  }

  async deletePaymentMethod(
    paymentMethodId: string,
    token: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    return this.request(`/payments/methods/${paymentMethodId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // PAYMENT HISTORY
  // =============================================================================

  async getPaymentHistory(
    filters: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    payments?: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      created: number;
      description: string;
    }>;
    total?: number;
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/history?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // REFUNDS
  // =============================================================================

  async processRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string,
    token?: string
  ): Promise<{
    success: boolean;
    refund?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      reason: string;
    };
    error?: string;
  }> {
    return this.request("/payments/refunds", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
        reason,
      }),
    });
  }

  async getRefund(
    refundId: string,
    token: string
  ): Promise<{
    success: boolean;
    refund?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      reason: string;
      created: number;
    };
    error?: string;
  }> {
    return this.request(`/payments/refunds/${refundId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // =============================================================================
  // INSTRUCTOR PAYOUTS
  // =============================================================================

  async transferToInstructor(
    sessionId: string,
    amount: number,
    token: string
  ): Promise<{
    success: boolean;
    transfer?: {
      id: string;
      amount: number;
      currency: string;
      status: string;
    };
    error?: string;
  }> {
    return this.request("/payments/transfers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId,
        amount,
      }),
    });
  }

  async getInstructorEarnings(
    filters: {
      startDate?: string;
      endDate?: string;
      status?: string;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    earnings?: {
      total: number;
      pending: number;
      paid: number;
      currency: string;
      transfers: Array<{
        id: string;
        amount: number;
        status: string;
        created: number;
      }>;
    };
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/earnings?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getStudentSpending(
    filters: {
      startDate?: string;
      endDate?: string;
      status?: string;
    } = {},
    token: string
  ): Promise<{
    success: boolean;
    spending?: {
      total: number;
      pending: number;
      completed: number;
      currency: string;
      payments: Array<{
        id: string;
        amount: number;
        status: string;
        created: number;
        description: string;
      }>;
    };
    error?: string;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/payments/spending?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Export singleton instance
export const stripeConnectApi = new StripeConnectApiService();
