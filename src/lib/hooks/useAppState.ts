import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AppState {
  currentUser: any | null;
  currentProject: any | null;
  currentBid: any | null;
  notifications: any[];
  unreadCount: number;
  messages: any[];
  loadingState: {
    projects: boolean;
    bids: boolean;
    messages: boolean;
    notifications: boolean;
  };
}

const initialState: AppState = {
  currentUser: null,
  currentProject: null,
  currentBid: null,
  notifications: [],
  unreadCount: 0,
  messages: [],
  loadingState: {
    projects: false,
    bids: false,
    messages: false,
    notifications: false,
  },
};

export function useAppState() {
  const [state, setState] = useState(initialState);

  const setCurrentUser = useCallback((user: any) => {
    setState(prev => ({ ...prev, currentUser: user }));
  }, []);

  const setCurrentProject = useCallback((project: any) => {
    setState(prev => ({ ...prev, currentProject: project }));
  }, []);

  const setCurrentBid = useCallback((bid: any) => {
    setState(prev => ({ ...prev, currentBid: bid }));
  }, []);

  const setNotifications = useCallback((notifications: any[]) => {
    setState(prev => ({
      ...prev,
      notifications,
      unreadCount: notifications.filter(n => !n.is_read).length,
    }));
  }, []);

  const setMessages = useCallback((messages: any[]) => {
    setState(prev => ({ ...prev, messages }));
  }, []);

  const setLoading = useCallback((key: keyof AppState['loadingState'], loading: boolean) => {
    setState(prev => ({
      ...prev,
      loadingState: { ...prev.loadingState, [key]: loading },
    }));
  }, []);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [setCurrentUser]);

  return {
    state,
    setCurrentUser,
    setCurrentProject,
    setCurrentBid,
    setNotifications,
    setMessages,
    setLoading,
  };
}
