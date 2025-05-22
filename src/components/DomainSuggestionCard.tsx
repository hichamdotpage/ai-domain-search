import React from 'react';
import { DomainSuggestion } from '../types';
import { StarsIcon } from './StarsIcon';

interface DomainSuggestionCardProps {
  suggestion: DomainSuggestion;
}

export const DomainSuggestionCard: React.FC<DomainSuggestionCardProps> = ({ suggestion }) => {
  const {
    domainName,
    originalPrice,
    discountedPrice,
    currency,
    savePercentage,
    status,
    isPremium
  } = suggestion;

  const formatPrice = (price: number | null) => {
    if (price === null) return '';
    return `${currency}${price.toFixed(2)}`;
  };

  const getStatusPill = () => {
    switch (status) {
      case 'free':
        return <span className="text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">Available</span>;
      case 'premium':
        return <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full">Premium</span>;
      case 'taken':
      case 'unavailable':
        return <span className="text-xs font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-full">Unavailable</span>;
      default:
        return <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">Unknown</span>;
    }
  };


  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {isPremium || domainName.includes('.info') || domainName.includes('.org') ? ( 
                <StarsIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
            ) : (
                 <div className="w-6 h-6 flex-shrink-0"></div> 
            )}
            <h3 className="text-xl lg:text-2xl font-bold text-slate-800 truncate" title={domainName}>
              {domainName}
            </h3>
          </div>
          <div className="ml-9"> 
             {getStatusPill()}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full sm:w-auto mt-3 sm:mt-0">
          {status === 'free' || status === 'premium' ? (
            <>
              {savePercentage !== null && savePercentage > 0 && (
                <span className="text-xs sm:text-sm font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-full whitespace-nowrap">
                  SAVE {savePercentage.toFixed(0)}%
                </span>
              )}
              <div className="text-left sm:text-right">
                {originalPrice !== null && (
                  <p className="text-sm text-slate-500 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
                <p className="text-lg lg:text-xl font-bold text-slate-900">
                  {formatPrice(discountedPrice)}
                  <span className="text-xs sm:text-sm font-normal text-slate-600">/1st yr</span>
                </p>
              </div>
              <button 
                className="w-full sm:w-auto bg-red-600 text-white border-2 border-red-600 font-semibold py-2.5 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                onClick={() => alert(`Redirecting to buy ${domainName}... (Feature not implemented)`)}
              >
                Buy now
              </button>
            </>
          ) : (
             <p className="text-slate-600 font-medium py-2 px-5 text-sm sm:text-base">
              This domain is not available for registration.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

