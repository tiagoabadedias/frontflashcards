import { api } from './api';

export type UserOnboarding = {
  version: number;
  completed: boolean;
  completedAt?: string;
};

export type MeResponse = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  onboarding: UserOnboarding;
};

export const userService = {
  async me(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>('/users/me');
    return data;
  },

  async completeOnboarding(): Promise<{ onboarding: UserOnboarding }> {
    const { data } = await api.post<{ onboarding: UserOnboarding }>('/users/me/onboarding/complete');
    return data;
  },
};

