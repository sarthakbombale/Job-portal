import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from './api';

/**
 * Hook to fetch all jobs with caching
 */
export const useJobs = (token) => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await API.get('/jobs', { 
        headers: { Authorization: token } 
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch a single job by ID with caching
 */
export const useJobById = (id, token) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await API.get(`/jobs/${id}`, { 
        headers: { Authorization: token } 
      });
      return res.data;
    },
    enabled: !!id && !!token,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to apply for a job
 */
export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, token, formData }) => {
      const res = await API.post(`/apply/${jobId}`, formData, {
        headers: { Authorization: token }
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch jobs list and applications
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

/**
 * Hook to fetch user applications with caching
 */
export const useApplications = (token) => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await API.get('/applications', { 
        headers: { Authorization: token } 
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

/**
 * Hook to fetch applicants for a job (admin only)
 */
export const useApplicants = (jobId, token) => {
  return useQuery({
    queryKey: ['applicants', jobId],
    queryFn: async () => {
      const res = await API.get(`/applicants/${jobId}`, { 
        headers: { Authorization: token } 
      });
      return res.data;
    },
    enabled: !!jobId && !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to update application status (admin only)
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, token, status }) => {
      const res = await API.put(`/applications/${applicationId}`, 
        { status }, 
        { headers: { Authorization: token } }
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate applicants cache
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
    },
  });
};

/**
 * Hook to fetchapplicants stats (admin)
 */
export const useJobStats = (token) => {
  return useQuery({
    queryKey: ['jobStats'],
    queryFn: async () => {
      const res = await API.get('/jobs', { 
        headers: { Authorization: token } 
      });
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
