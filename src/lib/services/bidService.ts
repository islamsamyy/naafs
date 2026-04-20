import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Bid = Database['public']['Tables']['bids']['Row'];
type BidInsert = Database['public']['Tables']['bids']['Insert'];

export async function submitBid(data: {
  project_id: string;
  freelancer_id: string;
  amount: number;
  delivery_time: string;
  message: string;
}): Promise<Bid | null> {
  const supabase = createClient();

  const { data: bid, error } = await supabase
    .from('bids')
    .insert({
      project_id: data.project_id,
      freelancer_id: data.freelancer_id,
      amount: data.amount,
      delivery_time: data.delivery_time,
      message: data.message,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting bid:', error);
    return null;
  }

  // TODO: Create notification for project owner after notifications table created
  // await createNotification({...})

  return bid;
}

export async function acceptBid(bidId: string, projectId: string): Promise<Bid | null> {
  const supabase = createClient();

  // Get the bid
  const { data: bid, error: bidError } = await supabase
    .from('bids')
    .select('freelancer_id')
    .eq('id', bidId)
    .single();

  if (bidError || !bid) {
    console.error('Error fetching bid:', bidError);
    return null;
  }

  // Accept this bid
  const { data: acceptedBid, error: updateError } = await supabase
    .from('bids')
    .update({ status: 'accepted' })
    .eq('id', bidId)
    .select()
    .single();

  if (updateError) {
    console.error('Error accepting bid:', updateError);
    return null;
  }

  // Reject all other pending bids on this project
  await supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('project_id', projectId)
    .neq('id', bidId)
    .eq('status', 'pending');

  // Update project status and award freelancer
  await supabase
    .from('projects')
    .update({
      awarded_freelancer_id: bid.freelancer_id,
      status: 'in_progress',
    })
    .eq('id', projectId);

  // TODO: Create notification for freelancer after notifications table created
  // await createNotification({...})

  return acceptedBid;
}

export async function rejectBid(bidId: string): Promise<Bid | null> {
  const supabase = createClient();

  const { data: bid, error } = await supabase
    .from('bids')
    .update({ status: 'rejected' })
    .eq('id', bidId)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting bid:', error);
    return null;
  }

  // Get freelancer ID to notify them
  const { data: bidData } = await supabase
    .from('bids')
    .select('freelancer_id')
    .eq('id', bidId)
    .single();

  // TODO: Create notification for freelancer after notifications table created
  // if (bidData?.freelancer_id) { await createNotification({...}); }

  return bid;
}

export async function getBidsForProject(projectId: string): Promise<Bid[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bids:', error);
    return [];
  }

  return data || [];
}

export async function getBidsForFreelancer(freelancerId: string): Promise<Bid[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bids:', error);
    return [];
  }

  return data || [];
}

export async function getBidById(bidId: string): Promise<Bid | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('id', bidId)
    .single();

  if (error) {
    console.error('Error fetching bid:', error);
    return null;
  }

  return data;
}

// Helper function to create notifications
async function createNotification(data: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_id: string;
}): Promise<void> {
  const supabase = createClient();

  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        related_id: data.related_id,
        is_read: false,
      });
  } catch (err) {
    console.error('Error creating notification:', err);
  }
}
