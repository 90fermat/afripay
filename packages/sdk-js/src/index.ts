export interface AfriPayOptions {
  apiKey: string;
  environment?: 'sandbox' | 'live';
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  provider: 'MTN_MOMO' | 'ORANGE_MONEY' | 'SANDBOX';
  customerPhone: string;
}

export interface PaymentResponse {
  transactionId: string;
  providerTransactionId: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
}

export interface CheckoutSessionRequest {
  merchantId: string;
  amountMinorUnits: number;
  currencyCode: string;
  returnUrl: string;
}

export interface CheckoutSessionResponse {
  id: string;
  url: string;
}

export class AfriPay {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(options: AfriPayOptions) {
    if (!options.apiKey) {
      throw new Error('AfriPay API key is required');
    }
    
    this.apiKey = options.apiKey;
    this.baseUrl = options.environment === 'live' 
      ? 'https://api.afripay.dev/api/v1' 
      : 'https://sandbox.api.afripay.dev/api/v1'; // Can map to localhost in local dev if needed
  }

  private async request<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AfriPay API Error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  public readonly payments = {
    /**
     * Create a direct API payment
     */
    create: (data: PaymentRequest): Promise<PaymentResponse> => {
      return this.request('POST', '/payments/initiate', {
        amount: {
          amountMinorUnits: data.amount,
          currencyCode: data.currency
        },
        provider: data.provider,
        customerPhone: data.customerPhone
      });
    },

    /**
     * Verify payment status
     */
    verify: (transactionId: string): Promise<PaymentResponse> => {
      return this.request('GET', `/payments/${transactionId}/verify`);
    },

    /**
     * Refund a payment
     */
    refund: (transactionId: string): Promise<PaymentResponse> => {
      return this.request('POST', `/payments/${transactionId}/refund`);
    }
  };

  public readonly checkout = {
    /**
     * Create a hosted checkout session
     */
    createSession: (data: CheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
      return this.request('POST', '/checkout/session', data);
    }
  };
}
