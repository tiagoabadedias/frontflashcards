import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type OnboardingActions = {
  openCreateGroupModal?: () => void;
  openCreateCampaignModal?: () => void;
  goToCreateCampaignModalStep?: (step: number) => void;
};

type OnboardingActionsContextValue = {
  actions: OnboardingActions;
  registerActions: (actions: OnboardingActions) => void;
  clearActions: (keys: (keyof OnboardingActions)[]) => void;
};

const OnboardingActionsContext = createContext<OnboardingActionsContextValue | undefined>(undefined);

export const OnboardingActionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<OnboardingActions>({});

  const registerActions = useCallback((next: OnboardingActions) => {
    setActions((prev) => ({ ...prev, ...next }));
  }, []);

  const clearActions = useCallback((keys: (keyof OnboardingActions)[]) => {
    setActions((prev) => {
      const updated = { ...prev };
      for (const key of keys) {
        delete updated[key];
      }
      return updated;
    });
  }, []);

  const value = useMemo(() => ({ actions, registerActions, clearActions }), [actions, registerActions, clearActions]);

  return <OnboardingActionsContext.Provider value={value}>{children}</OnboardingActionsContext.Provider>;
};

export const useOnboardingActions = () => {
  const ctx = useContext(OnboardingActionsContext);
  if (!ctx) throw new Error('useOnboardingActions must be used within an OnboardingActionsProvider');
  return ctx;
};
