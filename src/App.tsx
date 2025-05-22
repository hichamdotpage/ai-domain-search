import React, { useState, useCallback } from 'react';
import { DomainSuggestion, TabType } from './types';
import { StarsIcon } from './components/StarsIcon';
import { DomainSuggestionCard } from './components/DomainSuggestionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { domainService } from './services/domainService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [userInput, setUserInput] = useState<string>('');
  const [generatedDomains, setGeneratedDomains] = useState<DomainSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDomains = useCallback(async () => {
    if (!userInput.trim()) {
      setError(activeTab === 'ai' ? 'Please enter a project description.' : 'Please enter a domain name to search.');
      setGeneratedDomains([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDomains([]);

    try {
      let results: DomainSuggestion[] = [];
      if (activeTab === 'ai') {
        results = await domainService.getAIDomainSuggestions(userInput);
      } else { // 'search' tab
        const domainParts = userInput.match(/^([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})$/);
        if (!domainParts) {
          setError('Invalid domain format. Please use format like "example.com".');
          setIsLoading(false);
          return;
        }
        const name = domainParts[1];
        const extension = domainParts[2];
        const singleResult = await domainService.checkSingleDomain(name, extension);
        results = singleResult ? [singleResult] : [];
      }
      
      if (results.length === 0) {
        setError('No domains found or all suggestions are unavailable. Try a different query.');
      }
      setGeneratedDomains(results);
    } catch (err) {
      console.error('Error generating domains:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      setGeneratedDomains([]);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, activeTab]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    setUserInput('');
    setGeneratedDomains([]);
    setError(null);
  };
  
  const inputPlaceholder = activeTab === 'ai' 
    ? "e.g. Non-profit organization that helps plant trees." 
    : "e.g. mydomain.com";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <main className="py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <div className="flex justify-center mb-10">
            <div className="bg-slate-200 p-1 rounded-full shadow-sm flex items-center space-x-1">
              <button
                onClick={() => handleTabClick('search')}
                aria-pressed={activeTab === 'search'}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                  ${activeTab === 'search' ? 'bg-white text-red-700 shadow-md' : 'text-slate-600 hover:bg-slate-300 hover:text-slate-800'}`}
              >
                Domain search
              </button>
              <button
                onClick={() => handleTabClick('ai')}
                aria-pressed={activeTab === 'ai'}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75
                  ${activeTab === 'ai' ? 'bg-white text-red-700 shadow-md' : 'text-slate-600 hover:bg-slate-300 hover:text-slate-800'}`}
              >
                <StarsIcon className={`w-5 h-5 ${activeTab === 'ai' ? 'text-red-600' : 'text-slate-500'}`} />
                AI domain generator
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={inputPlaceholder}
                className="flex-grow p-3.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow text-base"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateDomains()}
              />
              <button
                onClick={handleGenerateDomains}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-7 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                <StarsIcon className="w-5 h-5" />
                {isLoading ? (activeTab === 'ai' ? 'Generating...' : 'Searching...') : (activeTab === 'ai' ? 'Generate' : 'Search')}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3.5 rounded-lg mb-6 shadow" role="alert">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!isLoading && !error && generatedDomains.length === 0 && activeTab === 'ai' && userInput && (
            <div className="text-center text-slate-500 py-8 bg-white rounded-xl shadow-lg">
              <p className="text-lg">No suggestions found for your query.</p>
              <p className="text-sm">Try refining your description or check back later.</p>
            </div>
          )}
          
          {!isLoading && !error && generatedDomains.length === 0 && activeTab === 'search' && userInput && (
            <div className="text-center text-slate-500 py-8 bg-white rounded-xl shadow-lg">
              <p className="text-lg">Domain not found or unavailable.</p>
              <p className="text-sm">Try a different domain name.</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <LoadingSpinner />
            </div>
          )}
          
          {!isLoading && generatedDomains.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 px-2">
                {activeTab === 'ai' ? 'AI Generated Alternatives' : 'Search Result'}
              </h2>
              <div className="space-y-4">
                {generatedDomains.map((domain) => (
                  <DomainSuggestionCard key={domain.id} suggestion={domain} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

