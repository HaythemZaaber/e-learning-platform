import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { instructorFollowService } from "@/features/instructors/services/instructorFollowService";
import { toast } from "sonner";

export const useInstructorFollow = (
  instructorId?: string,
  initialIsFollowing?: boolean
) => {
  const { getToken, user, isLoading } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(!!initialIsFollowing);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!instructorId || !user?.id) return;
      try {
        const token = await getToken();
        const res = await instructorFollowService.isFollowing(
          instructorId,
          token || undefined
        );
        if (mounted) setIsFollowing(!!res?.isFollowing);
      } catch (e) {
        // silent fail
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [instructorId, user?.id, getToken]);

  const follow = useCallback(async (): Promise<boolean> => {
    if (!instructorId) return false;
    if (!user?.id) {
      toast.error("Please sign in as a student to follow instructors.");
      return false;
    }
    setLoading(true);
    const prev = isFollowing;
    setIsFollowing(true);
    try {
      const token = await getToken();
      await instructorFollowService.follow(instructorId, token || undefined);
      toast.success("Following instructor");
      return true;
    } catch (e: any) {
      setIsFollowing(prev);
      toast.error(e?.message || "Failed to follow");
      return !!prev;
    } finally {
      setLoading(false);
    }
  }, [instructorId, user?.id, getToken, isFollowing]);

  const unfollow = useCallback(async (): Promise<boolean> => {
    if (!instructorId) return false;
    if (!user?.id) return false;
    setLoading(true);
    const prev = isFollowing;
    setIsFollowing(false);
    try {
      const token = await getToken();
      await instructorFollowService.unfollow(instructorId, token || undefined);
      toast.success("Unfollowed");
      return false;
    } catch (e: any) {
      setIsFollowing(prev);
      toast.error(e?.message || "Failed to unfollow");
      return !!prev;
    } finally {
      setLoading(false);
    }
  }, [instructorId, user?.id, getToken, isFollowing]);

  const toggleFollow = useCallback(async (): Promise<boolean> => {
    if (isFollowing) {
      const res = await unfollow();
      return !!res;
    }
    const res = await follow();
    return !!res;
  }, [isFollowing, follow, unfollow]);

  return {
    isFollowing,
    loading: loading || isLoading,
    follow,
    unfollow,
    toggleFollow,
  };
};
