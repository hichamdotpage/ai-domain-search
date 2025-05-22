import { BACKEND_API_BASE_URL, GEMINI_TEXT_MODEL } from '../constants';

export const geminiService = {
  generateDomainSuggestions: async (description: string): Promise<string[]> => {
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/api/ai-domain-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        return []; // Return empty array instead of throwing
      }

      // Get the response data
      const data = await response.json();
      
      // Use our robust function to handle ANY response format
      return extractDomainsFromAnyResponse(data);
    } catch (error) {
      console.error('Error generating domain suggestions:', error);
      return []; // Return empty array on any error
    }
  },
};

/**
 * Extracts domain strings from any API response format
 * This function is designed to be extremely robust and handle any possible response format
 */
function extractDomainsFromAnyResponse(apiResponse: any): string[] {
  try {
    // If it's already an array, return it
    if (Array.isArray(apiResponse)) {
      console.log("API response is already an array of domains");
      return apiResponse;
    }
    
    // If it's null or undefined, return empty array
    if (apiResponse === null || apiResponse === undefined) {
      console.log("API response is null or undefined, returning empty array");
      return [];
    }
    
    // If it's an object with a domains property that's an array, return that
    if (
      typeof apiResponse === 'object' && 
      'domains' in apiResponse && 
      Array.isArray(apiResponse.domains)
    ) {
      console.log("API response has domains array property");
      if (apiResponse.languageInfo) {
        console.log(
          `Detected language: ${apiResponse.languageInfo.detectedLanguage}, ` +
          `Primary TLD: .${apiResponse.languageInfo.primaryTld}`
        );
      }
      return apiResponse.domains;
    }
    
    // If it's an object with a data property that has a domains array, return that
    if (
      typeof apiResponse === 'object' && 
      'data' in apiResponse && 
      typeof apiResponse.data === 'object' &&
      apiResponse.data !== null &&
      'domains' in apiResponse.data &&
      Array.isArray(apiResponse.data.domains)
    ) {
      console.log("API response has nested data.domains array");
      return apiResponse.data.domains;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof apiResponse === 'string') {
      try {
        const parsed = JSON.parse(apiResponse);
        console.log("Parsed string to JSON");
        
        // Recursively call this function with the parsed result
        return extractDomainsFromAnyResponse(parsed);
      } catch (e) {
        console.log("Could not parse string as JSON");
        // If it looks like a domain, return it in an array
        if (apiResponse.includes('.')) {
          return [apiResponse];
        }
      }
    }
    
    // If we got here, we couldn't extract a valid domains array
    // Let's try one more approach - maybe it's an object that can be converted to an array
    if (typeof apiResponse === 'object' && apiResponse !== null) {
      const values = Object.values(apiResponse);
      if (values.length > 0) {
        // Look for the first array in the values
        const firstArray = values.find(val => Array.isArray(val));
        if (firstArray) {
          console.log("Found an array in the object values");
          return firstArray as string[];
        }
        
        // Look for the first string that looks like a domain
        const firstDomain = values.find(val => 
          typeof val === 'string' && val.includes('.')
        );
        if (firstDomain) {
          console.log("Found a domain-like string in the object values");
          return [firstDomain as string];
        }
      }
    }
    
    console.log("Could not extract domains array, returning empty array");
    return [];
  } catch (error) {
    console.error("Error extracting domains:", error);
    return [];
  }
}
