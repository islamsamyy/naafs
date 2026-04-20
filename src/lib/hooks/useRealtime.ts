import { useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription(
  channel: string,
  event: string,
  onData: (data: any) => void
) {
  useEffect(() => {
    const supabase = createClient();
    let subscription: RealtimeChannel;

    try {
      subscription = supabase
        .channel(channel)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: channel }, (payload) => {
          onData(payload.new);
        })
        .subscribe();
    } catch (error) {
      console.error('Error subscribing to realtime:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [channel, event, onData]);
}

export function useRealtimeBids(projectId: string, onBidReceived: (bid: any) => void) {
  useRealtimeSubscription(`bids:project:${projectId}`, 'INSERT', onBidReceived);
}

export function useRealtimeMessages(userId: string, onMessageReceived: (message: any) => void) {
  useRealtimeSubscription(`messages:user:${userId}`, 'INSERT', onMessageReceived);
}

export function useRealtimeNotifications(userId: string, onNotification: (notification: any) => void) {
  useRealtimeSubscription(`notifications:user:${userId}`, 'INSERT', onNotification);
}

export function useRealtimePresence(channel: string) {
  const supabase = createClient();

  useEffect(() => {
    const presenceChannel = supabase.channel(channel, {
      config: {
        presence: {
          key: 'user-presence',
        },
      },
    });

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      console.log('Presence state:', state);
    });

    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [channel, supabase]);
}
