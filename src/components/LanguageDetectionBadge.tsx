import React from 'react';

interface LanguageDetectionBadgeProps {
  language: string;
  tld: string;
}

// Map language codes to full language names
const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  nl: 'Dutch',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
  cs: 'Czech',
  pl: 'Polish',
  tr: 'Turkish',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic'
};

const LanguageDetectionBadge: React.FC<LanguageDetectionBadgeProps> = ({ language, tld }) => {
  const languageName = languageNames[language] || language.toUpperCase();
  
  return (
    <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-4">
      <span role="img" aria-label="Language" className="mr-1">🌐</span>
      Detected: {languageName} (.{tld} domains prioritized)
    </div>
  );
};

export default LanguageDetectionBadge;

// Then update your App.tsx to include this component:

// In App.tsx, modify your state to include language info:
const [languageInfo, setLanguageInfo] = useState<{ detectedLanguage: string; primaryTld: string } | null>(null);

// Then update your function that fetches domain suggestions:
const fetchDomainSuggestions = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    const response = await fetchDomainSuggestionsService(description);
    
    // Handle new response format with language info
    if ('domains' in response) {
      setDomainSuggestions(response.domains);
      // Store the language info if available
      if (response.languageInfo) {
        setLanguageInfo(response.languageInfo);
      }
    } else {
      // Fallback for old format (just array of domains)
      setDomainSuggestions(response as string[]);
    }
    
    setShowResults(true);
  } catch (err) {
    console.error('Error fetching domain suggestions:', err);
    setError('Failed to generate domain suggestions. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

// Then in your JSX, add the language badge if language info is available:
{showResults && languageInfo && (
  <LanguageDetectionBadge 
    language={languageInfo.detectedLanguage} 
    tld={languageInfo.primaryTld} 
  />
)}
