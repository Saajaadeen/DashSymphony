import { useState } from "react";
import { Link, useActionData } from "react-router";

interface TeamEditModalProps {
  teamId: string;
  name: string;
  isAdmin: boolean;
  userIsAdmin: boolean; // pass current user admin status
}

export default function TeamEditModal({ teamId, name, isAdmin, userIsAdmin }: TeamEditModalProps) {
  const actionData = useActionData<{ error?: string }>();

  const [form, setForm] = useState({
    name: name || "",
    isAdmin: isAdmin || false,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateForm = (key: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-lg relative shadow-2xl border border-gray-700">
        <Link
          to="/dashboard"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 text-2xl"
        >
          ✕
        </Link>

        <h3 className="text-white text-2xl font-bold mb-6">Edit Team</h3>

        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-sm">
            {actionData.error}
          </div>
        )}

        <form method="post" action={`/dashboard/${teamId}/team/edit`} className="space-y-5">
          <input type="hidden" name="teamId" value={teamId} />
          <input type="hidden" name="intent" value="update" />

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              name="name"
              maxLength={100}
              value={form.name}
              placeholder="Enter team name"
              onChange={(e) => updateForm("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Only show the admin-only checkbox if user is admin */}
          {userIsAdmin && (
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="isAdmin" className="text-gray-300 text-sm font-medium cursor-pointer select-none">
                Administrator Only Team
              </label>
              <input
                type="checkbox"
                id="isAdmin"
                name="isAdmin"
                checked={form.isAdmin}
                onChange={(e) => updateForm("isAdmin", e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-600 bg-gray-800 checked:bg-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          )}

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

        {/* Only show delete section if user is admin */}
        {userIsAdmin && (
          <form method="post" action={`/dashboard/${teamId}/team/edit`} className="mt-8 border-t border-gray-700 pt-6 space-y-4">
            <input type="hidden" name="teamId" value={teamId} />
            <input type="hidden" name="intent" value="delete" />

            <h4 className="text-red-400 font-semibold text-lg">Delete Team</h4>
            <p className="text-gray-400 text-sm">
              This action cannot be undone. Please confirm before deleting the team.
            </p>

            <div className="flex items-center gap-3">
              <input
                id="confirmDelete"
                type="checkbox"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                className="w-5 h-5 rounded-md border-gray-600 bg-gray-800 checked:bg-red-600 focus:ring-red-500 cursor-pointer"
              />
              <label htmlFor="confirmDelete" className="text-gray-300 text-sm font-medium cursor-pointer select-none">
                I understand, delete this team permanently
              </label>
            </div>

            <button
              type="submit"
              disabled={!confirmDelete}
              className={`w-full px-5 py-3 rounded-xl font-medium text-white transition-all ${
                confirmDelete
                  ? "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
            >
              Delete Team
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
