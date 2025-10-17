import { useState, useRef, useEffect } from "react";
import { BellIcon } from "../icons/BellIcon";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  readById?: string[];
};

interface NotificationsDropdownFormProps {
  items?: Notification[];
  user: { id: string };
  trigger?: React.ReactNode;
}

export default function NotificationsDropdownForm({
  items = [],
  user,
  trigger,
}: NotificationsDropdownFormProps) {
  const [open, setOpen] = useState(false);
  const [showRead, setShowRead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const processed = items.map((n) => ({
    ...n,
    read: n.readById?.includes(user.id),
  }));

  const filteredItems = showRead
    ? processed
    : processed.filter((n) => !n.read);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>
        {trigger ?? (
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-white focus:outline-none"
          >
            <BellIcon className="w-6 h-6" />
            {processed.some((n) => !n.read) && (
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900 animate-pulse" />
            )}
          </button>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-white text-sm">
            <span>Show read messages</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showRead}
                onChange={() => setShowRead((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition-colors" />
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </label>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-white text-sm">
              No {showRead ? "notifications" : "new notifications"}
            </div>
          ) : (
            <div className="flex flex-col py-2 max-h-96 overflow-y-auto">
              {filteredItems.map((notif) => (
                <div
                  key={notif.id}
                  className={`group px-4 py-3 text-sm transition-colors rounded-lg ${
                    notif.read
                      ? "text-gray-400 hover:bg-white/5"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium">{notif.title}</div>

                      {(!notif.read || showRead) && (
                        <>
                          <div className="text-xs text-gray-300 mt-1 whitespace-pre-line">
                            {notif.message}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(notif.createdAt)}
                          </div>
                        </>
                      )}
                    </div>

                    {(!notif.read) && (
                      <form method="post" action="/dashboard" className="ml-1">
                        <input type="hidden" name="id" value={notif.id} />
                        <input type="hidden" name="userId" value={user.id} />
                        <input type="hidden" name="intent" value="read" />
                        <button
                          type="submit"
                          className="opacity-50 text-lg group-hover:opacity-100 text-gray-400 hover:text-white transition-colors"
                          aria-label="Mark as read"
                        >
                          ✕
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
