
import React from 'react';

/**
 * This context has been cleared to remove all user-facing API key handling,
 * in accordance with the project guidelines to rely on environment variables.
 */

// A dummy provider that just renders its children.
export const ApiKeyProvider: React.FC<{ children: React.ReactNode; [key: string]: any }> = ({ children }) => {
  return <>{children}</>;
};

// A dummy hook that provides a no-op function.
export const useApiKey = () => {
  return {
    resetApiKey: () => {
      console.warn(
        'resetApiKey was called, but user-facing API key management is disabled.'
      );
    },
  };
};
