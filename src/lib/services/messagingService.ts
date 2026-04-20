import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Message = Database['public']['Tables']['messages']['Row'];

export async function sendMessage(data: {
  sender_id: string;
  receiver_id: string;
  content: string;
  project_id?: string;
}): Promise<Message | null> {
  const supabase = createClient();

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      content: data.content,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  // TODO: Create notification after notifications table created
  // await createMessageNotification({...})

  return message;
}

export async function getConversation(
  userId1: string,
  userId2: string,
  limit = 50
): Promise<Message[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching conversation:', error);
    return [];
  }

  return data || [];
}

export async function getConversations(userId: string): Promise<any[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('sender_id, receiver_id, created_at')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  // Group by conversation partner
  const conversations: Record<string, any> = {};

  data?.forEach((msg: any) => {
    const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    if (!conversations[partnerId]) {
      conversations[partnerId] = msg;
    }
  });

  return Object.values(conversations);
}

export async function markMessageAsRead(messageId: string): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
  } catch (err) {
    console.error('Error marking message as read:', err);
  }
}

export async function markConversationAsRead(userId: string, partnerId: string): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', partnerId);
  } catch (err) {
    console.error('Error marking conversation as read:', err);
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { data, error, count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }

  return count || 0;
}

async function createMessageNotification(data: {
  user_id: string;
  sender_id: string;
  message_id: string;
}): Promise<void> {
  const supabase = createClient();

  try {
    const { data: sender } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', data.sender_id)
      .single();

    await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: 'new_message',
        title: 'رسالة جديدة',
        message: `رسالة جديدة من ${sender?.name || 'مستخدم'}`,
        related_id: data.message_id,
        is_read: false,
      });
  } catch (err) {
    console.error('Error creating notification:', err);
  }
}
