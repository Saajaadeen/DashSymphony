import { XMarkIcon } from "../icons/XMarkIcon";
import { Link } from "react-router";
import { useEffect, useState } from "react";

type Tab = "home" | "personal" | "security";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

interface UserSettingsModalProps {
  user: User;
}

export default function UserSettingsModal({ user }: UserSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const tabs = [
    { id: "home" as Tab, label: "Home" },
    { id: "personal" as Tab, label: "Personal Info" },
    { id: "security" as Tab, label: "Security" },
  ];

  const getTabTitle = () => {
    return tabs.find((tab) => tab.id === activeTab)?.label ?? "";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl h-[500px] flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <aside className="w-1/4 bg-white/10 p-6 flex flex-col gap-2 border-r border-white/20">
          <h2 className="text-lg font-semibold text-white mb-2">Menu</h2>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`text-left p-2 rounded-lg w-full transition-colors ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 p-8 relative text-white overflow-y-auto">
          <Link
            to="/dashboard"
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </Link>

          <h1 className="text-2xl font-semibold mb-6 text-center">
            {getTabTitle()}
          </h1>

          {activeTab === "home" && (
            <div className="space-y-3 max-w-md mx-auto">
              <p>
                <strong>Name:</strong> {user?.firstName} {user?.lastName}
              </p>
              <p>
                <strong>Account:</strong>{" "}
                {user?.isAdmin ? "Administrator Account" : "User Account"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>

              <p>
                <strong>Member Since:</strong>{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          )}

          {activeTab === "personal" && (
            <form
              action="/dashboard/settings"
              method="post"
              className="space-y-4 max-w-md mx-auto"
            >
              <div className="flex flex-col">
                <label htmlFor="firstName" className="text-sm mb-1 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  maxLength={254}
                  name="firstName"
                  defaultValue={user?.firstName}
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="lastName" className="text-sm mb-1 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  maxLength={254}
                  name="lastName"
                  defaultValue={user?.lastName}
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link
                  to="/dashboard"
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded text-white font-medium text-center transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form
              action="/dashboard/settings"
              method="post"
              className="space-y-4 max-w-md mx-auto"
            >
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  maxLength={254}
                  defaultValue={user?.email}
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="newPassword"
                  className="text-sm mb-1 font-medium"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="New Password"
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm mb-1 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link
                  to="/dashboard"
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded text-white font-medium text-center transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
