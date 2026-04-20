import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Review = Database['public']['Tables']['reviews']['Row'];

export async function submitReview(data: {
  project_id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment: string;
}): Promise<Review | null> {
  const supabase = createClient();

  if (data.rating < 1 || data.rating > 5) {
    console.error('Rating must be between 1 and 5');
    return null;
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert({
      project_id: data.project_id,
      from_user_id: data.from_user_id,
      to_user_id: data.to_user_id,
      rating: data.rating,
      comment: data.comment,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    return null;
  }

  // Update user rating
  await updateUserRating(data.to_user_id);

  // TODO: Create notification after notifications table created
  // await createReviewNotification({...})

  return review;
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function getReviewsForProject(projectId: string): Promise<Review[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function getUserRating(userId: string): Promise<{ rating: number; count: number } | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('to_user_id', userId);

  if (error) {
    console.error('Error fetching rating:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return { rating: 0, count: 0 };
  }

  const avgRating = data.reduce((sum: number, r: any) => sum + r.rating, 0) / data.length;
  return { rating: Math.round(avgRating * 10) / 10, count: data.length };
}

async function updateUserRating(userId: string): Promise<void> {
  const rating = await getUserRating(userId);
  const supabase = createClient();

  if (!rating) return;

  try {
    await supabase
      .from('profiles')
      .update({
        rating: rating.rating,
        reviews_count: rating.count,
      })
      .eq('id', userId);
  } catch (err) {
    console.error('Error updating user rating:', err);
  }
}

async function createReviewNotification(data: {
  user_id: string;
  reviewer_id: string;
  rating: number;
}): Promise<void> {
  const supabase = createClient();

  try {
    const { data: reviewer } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', data.reviewer_id)
      .single();

    const ratingText = {
      5: '⭐⭐⭐⭐⭐ ممتاز',
      4: '⭐⭐⭐⭐ جيد جدا',
      3: '⭐⭐⭐ جيد',
      2: '⭐⭐ مقبول',
      1: '⭐ ضعيف',
    }[data.rating] || '';

    await supabase
      .from('notifications')
      .insert({
        user_id: data.user_id,
        type: 'review_received',
        title: 'تقييم جديد',
        message: `تقييم جديد من ${reviewer?.name || 'مستخدم'}: ${ratingText}`,
        related_id: data.reviewer_id,
        is_read: false,
      });
  } catch (err) {
    console.error('Error creating notification:', err);
  }
}
