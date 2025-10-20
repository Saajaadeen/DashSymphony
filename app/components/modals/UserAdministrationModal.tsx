import { useState, useEffect } from "react";
import { XMarkIcon } from "../icons/XMarkIcon";

type AdminTab = "login" | "landing";

interface LandingPage {
  id: string;
  name: string;
  description?: string;
}

interface UserAdministrationModalProps {
  loginInfo?: {
    loginName?: string;
    loginImgUrl?: string;
    landingEnabled?: boolean;
    landingDashboardId?: string | null;
  };
  landingInfo?: LandingPage[];
}

export default function UserAdministrationModal({
  loginInfo = {},
  landingInfo = [],
}: UserAdministrationModalProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("login");

  const [landingEnabled, setLandingEnabled] = useState<boolean>(
    loginInfo.landingEnabled ?? false
  );
  const [selectedLandingId, setSelectedLandingId] = useState<string>(
    loginInfo.landingDashboardId ?? ""
  );
  const [loginNameValue, setLoginNameValue] = useState<string>(
    loginInfo.loginName || ""
  );
  const [loginImgValue, setLoginImgValue] = useState<string>(
    loginInfo.loginImgUrl || ""
  );

  const hasLandingPages = landingInfo.length > 0;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const handleClose = () => {
    window.location.href = "/dashboard";
  };

  const handleLandingToggle = () => {
    if (hasLandingPages) {
      setLandingEnabled(!landingEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="w-[950px] h-[550px] max-w-5xl flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <aside className="w-1/4 bg-white/10 p-6 flex flex-col gap-4 border-r border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">Admin Menu</h2>

          <button
            className={`text-left p-2 rounded-lg w-full ${
              activeTab === "login"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login Page
          </button>

          <button
            className={`text-left p-2 rounded-lg w-full ${
              activeTab === "landing"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("landing")}
          >
            Landing Page
          </button>
        </aside>

        <div className="flex-1 p-8 relative text-white overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h1 className="text-2xl font-semibold mb-6 text-center">
            {activeTab === "login"
              ? "Login Page Settings"
              : "Landing Page Settings"}
          </h1>

          {activeTab === "login" && (
            <form method="post" className="space-y-4 max-w-2xl mx-auto">
              <input type="hidden" name="formType" value="login" />

              <div className="flex flex-col">
                <label
                  htmlFor="loginName"
                  className="text-sm mb-1 font-medium"
                >
                  Login Title
                </label>
                <input
                  type="text"
                  id="loginName"
                  maxLength={254}
                  name="loginName"
                  value={loginNameValue}
                  onChange={(e) => setLoginNameValue(e.target.value)}
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="loginImgUrl"
                  className="text-sm mb-1 font-medium"
                >
                  Login Image URL
                </label>
                <input
                  type="url"
                  id="loginImgUrl"
                  name="loginImgUrl"
                  maxLength={1000}
                  value={loginImgValue}
                  onChange={(e) => setLoginImgValue(e.target.value)}
                  className="p-2 text-white bg-white/10 rounded border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded text-white font-medium text-center transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === "landing" && (
            <form method="post" className="space-y-4 max-w-2xl mx-auto">
              <input type="hidden" name="formType" value="landing" />

              {!hasLandingPages && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ You must create at least one dashboard before enabling the landing page.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <label
                    htmlFor="landingEnabled"
                    className="text-sm font-medium"
                  >
                    Enable Landing Page
                  </label>
                  {!hasLandingPages && (
                    <p className="text-xs text-gray-400 mt-1">
                      Create a dashboard first to enable this feature
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLandingToggle}
                  disabled={!hasLandingPages}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    landingEnabled && hasLandingPages
                      ? "bg-indigo-600"
                      : "bg-gray-500"
                  } ${!hasLandingPages ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      landingEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <input
                  type="hidden"
                  name="landingEnabled"
                  value={landingEnabled && hasLandingPages ? "true" : "false"}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="landingSelect"
                  className="text-sm mb-1 font-medium"
                >
                  Select Landing Page
                </label>
                <select
                  id="landingSelect"
                  name="selectedLandingId"
                  value={selectedLandingId}
                  onChange={(e) => setSelectedLandingId(e.target.value)}
                  disabled={!landingEnabled || !hasLandingPages}
                  className={`p-2 rounded border border-white/20 text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    !landingEnabled || !hasLandingPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <option value="">Select a Landing Page</option>
                  {landingInfo.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded text-white font-medium text-center transition-colors"
                >
                  Cancel
                </button>
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