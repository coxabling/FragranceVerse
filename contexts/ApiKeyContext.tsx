
import React, { createContext, useContext } from 'react';

interface ApiKeyContextType {
  resetApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};

export const ApiKeyProvider: React.FC<{ children: React.ReactNode, resetApiKey: () => void }> = ({ children, resetApiKey }) => {
  return (
    <ApiKeyContext.Provider value={{ resetApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};
