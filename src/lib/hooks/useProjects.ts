import { useState, useCallback } from 'react';
import * as projectService from '@/lib/services/projectService';
import { useToast } from '@/components/common/Toast';

export function useProjects() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const createProject = useCallback(
    async (data: {
      title: string;
      description: string;
      budget_min: number;
      budget_max: number;
      deadline: string;
      skills_required: string[];
      category: string;
      client_id: string;
    }) => {
      setLoading(true);
      try {
        const project = await projectService.createProject(data);
        if (project) {
          toast.show('success', 'تم نشر المشروع بنجاح', 3000);
          setProjects(prev => [project, ...prev]);
          return project;
        } else {
          toast.show('error', 'فشل نشر المشروع', 3000);
          return null;
        }
      } catch (error) {
        console.error('Error creating project:', error);
        toast.show('error', 'حدث خطأ', 3000);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const fetchProjects = useCallback(
    async (status: string = 'open', limit: number = 20, offset: number = 0) => {
      setLoading(true);
      try {
        let data: any[];
        if (status === 'my') {
          data = await projectService.getProjectsByClient('');
        } else {
          data = await projectService.getOpenProjects(limit, offset);
        }
        setProjects(data);
        return data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.show('error', 'فشل تحميل المشاريع', 3000);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const updateProjectStatus = useCallback(
    async (projectId: string, status: 'open' | 'in_progress' | 'completed' | 'cancelled') => {
      setLoading(true);
      try {
        const project = await projectService.updateProjectStatus(projectId, status);
        if (project) {
          setProjects(prev =>
            prev.map(p => (p.id === projectId ? project : p))
          );
          toast.show('success', 'تم تحديث حالة المشروع', 3000);
          return project;
        }
      } catch (error) {
        console.error('Error updating project:', error);
        toast.show('error', 'حدث خطأ', 3000);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    loading,
    projects,
    setProjects,
    createProject,
    fetchProjects,
    updateProjectStatus,
  };
}
