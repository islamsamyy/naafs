import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

// TODO: Update after notifications table is created in Supabase
type Notification = any;

export async function getNotifications(userId: string, limit = 20): Promise<Notification[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function getUnreadNotifications(userId: string): Promise<Notification[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching unread notifications:', error);
    return [];
  }

  return data || [];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  } catch (err) {
    console.error('Error marking notification as read:', err);
  }
}

export async function markAllAsRead(userId: string): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
  } catch (err) {
    console.error('Error marking all as read:', err);
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
  } catch (err) {
    console.error('Error deleting notification:', err);
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { data, error, count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
}
