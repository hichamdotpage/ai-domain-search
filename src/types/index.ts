export interface DomainSuggestion {
  id: string;
  domainName: string;
  originalPrice: number | null; // Null if not applicable or no discount
  discountedPrice: number;
  currency: string;
  savePercentage: number | null; // Null if no discount
  status: 'free' | 'taken' | 'premium' | 'unknown' | 'unavailable';
  isPremium?: boolean;
}

export type TabType = 'search' | 'ai';

// OpenProvider API Types (Simplified for Mocking)
export interface OpenProviderAuthResponseData {
  token: string;
  reseller_id: number;
}

export interface OpenProviderAuthResponse {
  data: OpenProviderAuthResponseData;
}

export interface OpenProviderDomainCheckRequestItem {
  name: string;
  extension: string;
}

export interface OpenProviderDomainCheckRequest {
  domains: OpenProviderDomainCheckRequestItem[];
  with_price?: boolean;
}

export interface OpenProviderPriceDetail {
  currency: string;
  price: number;
}

export interface OpenProviderDomainPrice {
  product: OpenProviderPriceDetail;
  reseller?: OpenProviderPriceDetail; // Optional as per example
}

export interface OpenProviderPremiumPrice {
  create: number;
  renew?: number; // Optional
  transfer?: number; // Optional
}

export interface OpenProviderDomainCheckResult {
  domain: string;
  status: 'free' | 'taken' | 'active' | string; // 'active' can mean taken, map to 'taken' or 'unavailable'
  is_premium?: boolean;
  premium?: {
    price: OpenProviderPremiumPrice;
  };
  price?: OpenProviderDomainPrice; // Note: This structure might be different for premium vs non-premium
}

export interface OpenProviderCheckResponseData {
  results: OpenProviderDomainCheckResult[];
}

export interface OpenProviderCheckResponse {
  code: number;
  data: OpenProviderCheckResponseData;
  desc?: string;
}

// For Gemini JSON response
export interface GeminiDomainSuggestion {
  domain: string; // e.g., "myproject.com"
  // Potentially add other fields if Gemini can provide them, like category or reasoning
}

