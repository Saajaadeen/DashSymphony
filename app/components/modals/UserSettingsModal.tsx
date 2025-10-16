import { XMarkIcon } from "../icons/XMarkIcon";
import { Link, useActionData } from "react-router";
import { useEffect, useState, useRef } from "react";

type Tab = "home" | "personal" | "security" | "teams";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

interface Team {
  id: string;
  name: string;
  isAdmin: boolean;
  privateTeam: boolean;
}

interface TeamsData {
  publicTeams?: Team[];
  teamOwner?: Team[];
}

interface UserSettingsModalProps {
  user: User;
  teams: TeamsData | Team[];
}

export default function UserSettingsModal({
  user,
  teams,
}: UserSettingsModalProps) {
  const actionData = useActionData<{ error?: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [accessCode, setAccessCode] = useState(Array(10).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const flatTeams = Array.isArray(teams)
    ? teams
    : [...(teams?.publicTeams || []), ...(teams?.teamOwner || [])];

  const uniqueTeams = flatTeams.filter(
    (team, index, self) => index === self.findIndex((t) => t.id === team.id)
  );

  const selectedTeam = uniqueTeams.find((team) => team.id === selectedTeamId);
  const isPrivateTeam = selectedTeam?.privateTeam;

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(e.target.value);
    setAccessCode(Array(10).fill(""));
  };

  const handleAccessCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...accessCode];
    newCode[index] = value;
    setAccessCode(newCode);

    if (value && index < 9) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !accessCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 10);
    const newCode = [...accessCode];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setAccessCode(newCode);

    const nextEmptyIndex = Math.min(pastedData.length, 9);
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const allTabs = [
    { id: "home" as Tab, label: "Home" },
    { id: "personal" as Tab, label: "Personal Info" },
    { id: "security" as Tab, label: "Security" },
    { id: "teams" as Tab, label: "Teams" },
  ];

  const tabs = !user?.isAdmin
    ? allTabs
    : allTabs.filter((tab) => tab.id !== "teams");

  const getTabTitle = () => {
    return tabs.find((tab) => tab.id === activeTab)?.label ?? "";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      {actionData?.error && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50 mb-4 p-4 bg-red-900/80 border border-red-700 rounded-xl text-red-200 text-sm shadow-lg">
          {actionData.error}
        </div>
      )}
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

          {activeTab === "teams" && (
            <form
              action="/dashboard/settings"
              method="post"
              className="space-y-4 max-w-md mx-auto"
            >
              <div className="flex flex-col">
                <label
                  htmlFor="teamSelect"
                  className="text-sm mb-1 font-medium"
                >
                  Select a Team
                </label>

                <select
                  name="teamId"
                  id="teamSelect"
                  value={selectedTeamId}
                  onChange={handleTeamChange}
                  className="p-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="" disabled>
                    Choose a team...
                  </option>

                  {user?.isAdmin ? (
                    <>
                      <optgroup label="Admin Teams">
                        {uniqueTeams
                          .filter((team) => team.isAdmin)
                          .map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name} (Admin)
                              {team.privateTeam ? " 🔒" : ""}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="User Teams">
                        {uniqueTeams
                          .filter((team) => !team.isAdmin)
                          .map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                              {team.privateTeam ? " 🔒" : ""}
                            </option>
                          ))}
                      </optgroup>
                    </>
                  ) : (
                    uniqueTeams
                      .filter((team) => !team.isAdmin)
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                          {team.privateTeam ? " 🔒" : ""}
                        </option>
                      ))
                  )}
                </select>
              </div>

              {isPrivateTeam && (
                <div className="flex flex-col">
                  <label className="text-sm mb-2 font-medium">
                    Enter Access Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {accessCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleAccessCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-9.5 h-12 text-center text-xl font-mono bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                    ))}
                  </div>
                  <input
                    type="hidden"
                    name="accessCode"
                    value={accessCode.join("")}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Link
                  to="/dashboard"
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded text-white font-medium text-center transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={
                    !selectedTeamId ||
                    (isPrivateTeam && accessCode.some((d) => !d))
                  }
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Team
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
