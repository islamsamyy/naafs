import { supabase } from '@/lib/supabase';
import { Talent } from '@/lib/types';

export async function getTalents(): Promise<Talent[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'freelancer');

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn('No talents found in database.');
      return [];
    }

    return data.map(profile => ({
      id: profile.id,
      name: profile.name || 'Anonymous',
      role: profile.title || 'Talent',
      price: `$${profile.hourly_rate || 0}`,
      rating: (profile.rating || 0).toString(),
      reviews: (profile.reviews_count || 0).toString(),
      projects: '0',
      tags: (Array.isArray(profile.skills) ? profile.skills : []) as string[],
      avatar: profile.avatar_url || '',
      verified: false,
      bio: profile.bio || '',
      years_experience: profile.years_experience || 0
    }));
  } catch (error) {
    console.error('Error fetching talents:', error);
    return [];
  }
}
