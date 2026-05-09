import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2 } from "lucide-react";
import { notificationsApi } from "../../api/notifications";
import { cn } from "../../utils/utils";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-vintage-brown hover:bg-vintage-brown/10 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-vintage-cream"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-vintage-cream border border-vintage-brown/20 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-vintage-brown/10 bg-vintage-beige/50">
            <h3 className="font-serif font-bold text-vintage-charcoal">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead.mutate()}
                className="text-xs font-medium text-vintage-olive hover:text-vintage-charcoal transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-vintage-brown">
                You have no notifications.
              </div>
            ) : (
              <div className="divide-y divide-vintage-brown/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 transition-colors hover:bg-vintage-brown/5",
                      !notification.isRead ? "bg-vintage-olive/5" : "bg-transparent"
                    )}
                  >
                    <p className={cn(
                      "text-sm mb-1",
                      !notification.isRead ? "text-vintage-charcoal font-medium" : "text-vintage-brown"
                    )}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] uppercase tracking-wider text-vintage-brown/70 font-bold">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead.mutate(notification.id)}
                          className="text-xs text-vintage-olive hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
