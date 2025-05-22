import {
  OpenProviderCheckResponse,
  OpenProviderDomainCheckRequestItem // Used to type the payload to backend
} from '../types';
import { BACKEND_API_BASE_URL } from '../constants';

export const openProviderService = {
  checkDomainAvailability: async (
    domains: OpenProviderDomainCheckRequestItem[] // [{ name: string, extension: string }, ...]
  ): Promise<OpenProviderCheckResponse> => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/check-domain-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domains }), // Send { domains: [...] }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to parse error response from backend." }));
        console.error("Error from backend (OpenProvider check):", errorData);
        throw new Error(errorData.error || `Backend error: ${response.statusText}`);
      }
      
      // Expecting the backend to forward OpenProvider's response structure
      const checkResult: OpenProviderCheckResponse = await response.json();
      return checkResult;

    } catch (error) {
      console.error("Error calling backend for domain availability:", error);
      if (error instanceof Error) {
        throw error; // Re-throw the error to be caught by the UI
      }
      throw new Error("An unexpected error occurred while checking domain availability.");
    }
  },
};

