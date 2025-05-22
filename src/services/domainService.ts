import { DomainSuggestion, OpenProviderDomainCheckResult } from '../types';
import { geminiService } from './geminiService';
import { openProviderService } from './openProviderService';
import { DEFAULT_CURRENCY } from '../constants';

// Helper to parse domain string like "example.com" into name and extension
const parseDomainString = (domainStr: string): { name: string; extension: string } | null => {
  const parts = domainStr.toLowerCase().match(/^([a-z0-9][a-z0-9-]*[a-z0-9])\.([a-z]{2,})$/);
  if (parts && parts.length === 3) {
    return { name: parts[1], extension: parts[2] };
  }
  console.warn(`Could not parse domain string: ${domainStr}`);
  return null;
};

const transformOpenProviderResultToDomainSuggestion = (
  opResult: OpenProviderDomainCheckResult
): DomainSuggestion | null => {
  let status: DomainSuggestion['status'] = 'unknown';
  if (opResult.status === 'free') status = 'free';
  else if (opResult.status === 'premium') status = 'premium';
  else if (opResult.status === 'taken' || opResult.status === 'active') status = 'taken'; // 'active' typically means registered
  else status = 'unavailable';

  // If status is not favorable for registration, don't show pricing details as "buyable"
  if (status === 'taken' || status === 'unavailable') {
     return {
      id: opResult.domain,
      domainName: opResult.domain,
      originalPrice: null,
      discountedPrice: 0, // Not applicable
      currency: DEFAULT_CURRENCY,
      savePercentage: null,
      status: status,
      isPremium: opResult.is_premium || opResult.status === 'premium',
    };
  }
  
  const discountedPrice = opResult.is_premium 
    ? opResult.premium?.price.create 
    : opResult.price?.product.price;

  if (typeof discountedPrice !== 'number') {
    console.warn(`Price not found for available domain: ${opResult.domain}`);
    return null; // Or handle as unavailable if price is critical
  }
  
  // Mock original price and save percentage to match UI style
  // Example: original price is 2 to 5 times the discounted price for non-premium
  // For premium, original price might be closer or not shown with a huge discount.
  let originalPrice: number | null = null;
  let savePercentage: number | null = null;

  if (status === 'free' && !opResult.is_premium) {
    const saveFactors = [60, 70, 80, 85, 90]; // Simulate various save percentages
    savePercentage = saveFactors[Math.floor(Math.random() * saveFactors.length)];
    originalPrice = parseFloat((discountedPrice / (1 - savePercentage / 100)).toFixed(2));
  } else if (status === 'premium') {
    // For premium, let's assume a smaller or no explicit "save %" badge, or a fixed higher original price
    // originalPrice = discountedPrice * 1.2; // e.g. 20% higher "list price"
    // savePercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
    // For simplicity, premium domains might not show "SAVE %" as prominently or rely on perceived value.
    // The example image for `myprojecthub.info` (could be premium) showed 84% save.
    // Let's apply a similar logic but maybe with different ranges.
    const premiumSaveFactors = [10, 20, 30];
    savePercentage = premiumSaveFactors[Math.floor(Math.random() * premiumSaveFactors.length)];
    originalPrice = parseFloat((discountedPrice / (1 - savePercentage / 100)).toFixed(2));
    if (originalPrice <= discountedPrice) { // Ensure original is higher
        originalPrice = discountedPrice * (1.1 + Math.random() * 0.4); // 10-50% higher
        savePercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
    }
  }

  return {
    id: opResult.domain,
    domainName: opResult.domain,
    originalPrice: originalPrice ? parseFloat(originalPrice.toFixed(2)) : null,
    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
    currency: opResult.price?.product.currency || DEFAULT_CURRENCY,
    savePercentage: savePercentage ? parseFloat(savePercentage.toFixed(2)) : null,
    status: status,
    isPremium: opResult.is_premium || opResult.status === 'premium',
  };
};

export const domainService = {
  getAIDomainSuggestions: async (description: string): Promise<DomainSuggestion[]> => {
    const suggestedDomainStrings = await geminiService.generateDomainSuggestions(description);
    if (!suggestedDomainStrings || suggestedDomainStrings.length === 0) {
      return [];
    }

    const domainsToParse = suggestedDomainStrings.map(s => parseDomainString(s)).filter(d => d !== null) as { name: string; extension: string }[];
    
    if (domainsToParse.length === 0) {
        console.warn("AI suggestions could not be parsed into valid domain structures.");
        return [];
    }

    const availabilityResults = await openProviderService.checkDomainAvailability(domainsToParse);
    
    return availabilityResults.data.results
      .map(transformOpenProviderResultToDomainSuggestion)
      .filter(s => s !== null) as DomainSuggestion[];
  },

  checkSingleDomain: async (name: string, extension: string): Promise<DomainSuggestion | null> => {
    const availabilityResult = await openProviderService.checkDomainAvailability([{ name, extension }]);
    if (availabilityResult.data.results && availabilityResult.data.results.length > 0) {
      return transformOpenProviderResultToDomainSuggestion(availabilityResult.data.results[0]);
    }
    return null;
  },
};
