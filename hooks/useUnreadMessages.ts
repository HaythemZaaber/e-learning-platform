import { useEffect } from "react";
import { useChatStore } from "@/stores/chat.store";
import { useAuth } from "./useAuth";

export function useUnreadMessages() {
  const { user, getToken } = useAuth();
  const { unreadCount, fetchUnreadCount } = useChatStore();

  useEffect(() => {
    const fetchCount = async () => {
      if (user?.id) {
        const token = await getToken();
        if (token) {
          await fetchUnreadCount(token);
        }
      }
    };

    fetchCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return { unreadCount };
}
