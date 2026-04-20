import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/database.types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export async function createProject(data: {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  skills_required: string[];
  category: string;
  client_id: string;
}): Promise<Project | null> {
  const supabase = createClient();

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      title: data.title,
      description: data.description,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      deadline: data.deadline,
      skills_required: data.skills_required,
      category: data.category,
      client_id: data.client_id,
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return project;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getOpenProjects(limit = 20, offset = 0): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching open projects:', error);
    return [];
  }

  return data || [];
}

export async function updateProjectStatus(
  projectId: string,
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project status:', error);
    return null;
  }

  return data;
}

export async function awardProject(projectId: string, freelancerId: string): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({
      awarded_freelancer_id: freelancerId,
      status: 'in_progress',
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error awarding project:', error);
    return null;
  }

  return data;
}

export async function completeProject(projectId: string): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error completing project:', error);
    return null;
  }

  return data;
}
