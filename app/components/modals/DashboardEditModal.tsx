import { useState, useRef } from "react";
import { Link, useActionData } from "react-router";

type Visibility = "GLOBAL" | "PRIVATE" | "PUBLIC" | "LANDING";
type Permission = "READ" | "WRITE" | "DELETE";

interface Team {
  id: string;
  name: string;
  isAdmin: boolean;
  ownerId?: string;
}

interface DashboardEditModalProps {
  isAdmin?: boolean;
  userId: string;
  dashboard: any;
  dashboardId?: string;
  teams:
    | Team[]
    | {
        publicTeams?: Team[];
        privateTeams?: Team[];
        teamOwner?: Team[];
      };
}

const VISIBILITY_CONFIG = {
  GLOBAL: {
    label: "Global",
    tooltip: "Visible to all users (admin only)",
    lockedPermissions: ["READ"] as Permission[],
    disabledPermissions: [] as Permission[],
  },
  PRIVATE: {
    label: "Private",
    tooltip: "Only visible to you",
    lockedPermissions: ["READ", "WRITE", "DELETE"] as Permission[],
    disabledPermissions: [] as Permission[],
  },
  PUBLIC: {
    label: "Public",
    tooltip: "Visible to users with shared access",
    lockedPermissions: ["READ"] as Permission[],
    disabledPermissions: [] as Permission[],
  },
  LANDING: {
    label: "Landing",
    tooltip: "Landing page dashboard — admin only",
    lockedPermissions: ["READ"] as Permission[],
    disabledPermissions: ["DELETE"] as Permission[],
  },
} as const;

const PERMISSION_CONFIG = {
  READ: "View dashboard content and data",
  WRITE: "Create and modify dashboard items",
  DELETE: "Remove dashboards and their content",
} as const;

export default function DashboardEditModal({
  isAdmin = false,
  userId,
  dashboard,
  dashboardId,
  teams,
}: DashboardEditModalProps) {
  const actionData = useActionData<{ error?: string }>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  // normalize all team structures
  const safeTeams: Team[] = Array.isArray(teams)
    ? teams
    : [
        ...(teams?.publicTeams ?? []),
        ...(teams?.privateTeams ?? []),
        ...(teams?.teamOwner ?? []),
      ];

  const filteredTeams = isAdmin
    ? safeTeams
    : safeTeams.filter((t) => !t.isAdmin);
  const hasTeams = filteredTeams.length > 0;

  const availableVisibilities: Visibility[] = isAdmin
    ? ["GLOBAL", "PRIVATE", "PUBLIC", "LANDING"]
    : ["PRIVATE", "PUBLIC"];

  const allPermissions: Permission[] = ["READ", "WRITE", "DELETE"];

  const originalVisibility = useRef(
    (dashboard?.visibility?.[0] ?? "PRIVATE") as Visibility
  );
  const originalPermissions = useRef(
    (dashboard?.permissions ?? ["READ", "WRITE", "DELETE"]) as Permission[]
  );

  const [form, setForm] = useState({
    name: dashboard?.name ?? "",
    description: dashboard?.description ?? "",
    visibility: originalVisibility.current,
    permissions: originalPermissions.current,
    teamId: dashboard?.teamId ?? "",
  });

  const currentConfig = VISIBILITY_CONFIG[form.visibility];

  const updateForm = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleVisibilityChange = (vis: Visibility) => {
    if ((vis === "GLOBAL" || vis === "LANDING") && !isAdmin) return;

    const newConfig = VISIBILITY_CONFIG[vis];
    const newPermissions =
      vis === originalVisibility.current
        ? [...originalPermissions.current]
        : [...newConfig.lockedPermissions];

    setForm((prev) => ({
      ...prev,
      visibility: vis,
      permissions: newPermissions,
    }));
  };

  const getPermissionState = (perm: Permission) => {
    const { lockedPermissions, disabledPermissions } = currentConfig;
    const isActive = form.permissions.includes(perm);
    const isLocked = lockedPermissions.includes(perm);
    const isDisabled = disabledPermissions.includes(perm);
    const isToggleable = !isLocked && !isDisabled;

    return { isActive, isLocked, isDisabled, isToggleable };
  };

  const togglePermission = (perm: Permission) => {
    const { isToggleable, isActive } = getPermissionState(perm);
    if (!isToggleable) return;

    updateForm(
      "permissions",
      isActive
        ? form.permissions.filter((p) => p !== perm)
        : [...form.permissions, perm]
    );
  };

  const getPermissionStyle = (perm: Permission) => {
    const { isActive, isLocked, isDisabled } = getPermissionState(perm);

    if (isDisabled)
      return "bg-gray-900/40 text-gray-600 border border-gray-700 cursor-not-allowed";
    if (isLocked)
      return "bg-blue-700/80 text-blue-200 border border-blue-600 cursor-not-allowed";
    if (isActive) return "bg-blue-600 text-white hover:bg-blue-500";
    return "bg-gray-800/60 text-gray-400 hover:bg-gray-700";
  };

  const shouldIncludeUserId = form.visibility === "PRIVATE";
  const teamSelectDisabled = form.visibility === "PRIVATE";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-lg relative shadow-2xl border border-gray-700">
        <Link
          to="/dashboard"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 text-2xl"
        >
          ✕
        </Link>

        <h3 className="text-white text-2xl font-bold mb-6">Edit Dashboard</h3>

        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-sm">
            {actionData.error}
          </div>
        )}

        <form
          method="post"
          action={`/dashboard/${dashboardId}/edit`}
          className="space-y-5"
        >
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="dashboardId" value={dashboardId} />
          <input
            type="hidden"
            name="visibility"
            value={JSON.stringify([form.visibility])}
          />
          <input
            type="hidden"
            name="permissions"
            value={form.permissions.join(",")}
          />
          {shouldIncludeUserId && (
            <input type="hidden" name="userId" value={userId} />
          )}

          {/* Name */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              maxLength={254}
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Team Selection */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Team
            </label>
            {hasTeams ? (
              <select
                name="teamId"
                value={form.teamId}
                disabled={teamSelectDisabled}
                onChange={(e) => updateForm("teamId", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  teamSelectDisabled
                    ? "bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800/50 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                <option value="">Select a team</option>
                {filteredTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} {team.isAdmin ? "(Admin)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-400 text-sm">
                No teams available. Create a team to select one.
              </p>
            )}
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Visibility
            </label>
            <div
              className={`grid gap-2 ${
                availableVisibilities.length === 4
                  ? "grid-cols-4"
                  : "grid-cols-2"
              }`}
            >
              {availableVisibilities.map((vis) => (
                <button
                  key={vis}
                  type="button"
                  onClick={() => handleVisibilityChange(vis)}
                  title={VISIBILITY_CONFIG[vis].tooltip}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    form.visibility === vis
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {VISIBILITY_CONFIG[vis].label}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Permissions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allPermissions.map((perm) => (
                <button
                  key={perm}
                  type="button"
                  onClick={() => togglePermission(perm)}
                  title={PERMISSION_CONFIG[perm]}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${getPermissionStyle(
                    perm
                  )}`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              to="/dashboard"
              className="flex-1 px-5 py-3 text-center bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl text-white font-medium shadow-lg shadow-blue-500/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Delete Form */}
        <form method="post" className="mt-6 space-y-3">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="dashboardId" value={dashboardId} />

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            I understand this will permanently delete this dashboard
          </label>

          <button
            type="submit"
            disabled={!confirmDelete}
            className={`w-full px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all ${
              confirmDelete
                ? "bg-red-700 hover:bg-red-600 shadow-red-500/30"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Delete Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
