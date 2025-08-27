import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { instructorProfileService } from '../services/instructorProfileService';
import { 
  InstructorDetailsResponse, 
  InstructorCoursesResponse, 
  InstructorReviewsResponse, 
  AvailabilityResponse 
} from '@/types/instructorTypes';

export const useInstructorDetails = (instructorId: string) => {
  const [data, setData] = useState<InstructorDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const result = await instructorProfileService.getInstructorDetails(instructorId, token || undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [instructorId, getToken]);

  return { data, loading, error, refetch: fetchData };
};

export const useInstructorCourses = (
  instructorId: string, 
  options: { page?: number; limit?: number; status?: string } = {}
) => {
  const [data, setData] = useState<InstructorCoursesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const result = await instructorProfileService.getInstructorCourses(instructorId, options, token || undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructor courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [instructorId, options.page, options.limit, options.status, getToken]);

  return { data, loading, error, refetch: fetchData };
};

export const useInstructorReviews = (
  instructorId: string, 
  options: { page?: number; limit?: number; rating?: number } = {}
) => {
  const [data, setData] = useState<InstructorReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const result = await instructorProfileService.getInstructorReviews(instructorId, options, token || undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructor reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [instructorId, options.page, options.limit, options.rating, getToken]);

  return { data, loading, error, refetch: fetchData };
};

export const useInstructorAvailability = (
  instructorId: string, 
  options: { startDate?: string; endDate?: string } = {}
) => {
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const result = await instructorProfileService.getInstructorAvailability(instructorId, options, token || undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructor availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!instructorId) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [instructorId, options.startDate, options.endDate, getToken]);

  return { data, loading, error, refetch: fetchData };
};

