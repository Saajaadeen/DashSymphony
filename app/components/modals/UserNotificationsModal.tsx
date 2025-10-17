import { useEffect, useState } from "react";
import { XMarkIcon } from "../icons/XMarkIcon";
import { Form, Link, useFetcher } from "react-router";

export default function UserNotificationsModal({ notifications }: { notifications: any }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setTitle("");
      setMessage("");
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-[500px] max-w-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative border-white/10 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">
            Send Notifications
          </h1>
          <Link
            to="/dashboard"
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </Link>
        </div>

        <div className="p-8 space-y-8">
          <fetcher.Form
            action="/dashboard/notifications"
            method="post"
            className="space-y-5"
          >
            <input type="hidden" name="intent" value="send" />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <select
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 text-white bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="" disabled>
                  Select a title
                </option>
                <option value="System Update">System Update</option>
                <option value="System Maintenance">System Maintenance</option>
                <option value="Downtime Alert">Downtime Alert</option>
                <option value="Security Notice">Security Notice</option>
                <option value="General Announcement">
                  General Announcement
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={250}
                placeholder="Enter your notification message..."
                required
                rows={4}
                className="w-full p-3 text-white bg-white/10 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-gray-500"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">
                {message.length}/250 characters
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to="/dashboard"
                className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/15 rounded-lg text-white font-medium text-center transition-all"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={fetcher.state === "submitting"}
                className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30"
              >
                {fetcher.state === "submitting" ? "Sending..." : "Send Notification"}
              </button>
            </div>
          </fetcher.Form>

          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Existing Notifications
              </h2>
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                {notifications.length} total
              </span>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
              {notifications && notifications.length > 0 ? (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">
                          {n.title}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                      <Form method="post" action="/dashboard/notifications">
                        <input type="hidden" name="intent" value="delete" />
                        <input type="hidden" name="id" value={n.id} />
                        <button
                          type="submit"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                        >
                          Delete
                        </button>
                      </Form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">
                    No notifications found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}