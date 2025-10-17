import { useState } from "react";
import { Link, useActionData } from "react-router";

interface TeamCreateModalProps {
  isAdmin?: boolean;
  userId: string;
}

export default function TeamCreateModal({
  isAdmin = false,
  userId,
}: TeamCreateModalProps) {
  const actionData = useActionData<{ error?: string }>();
  const [form, setForm] = useState({
    name: "",
    isAdmin: false,
    privateTeam: false,
  });

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

        <h3 className="text-white text-2xl font-bold mb-6">Create Team</h3>

        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-sm">
            {actionData.error}
          </div>
        )}

        <form method="post" action="/dashboard/team/create" className="space-y-5">
          <input type="hidden" value={userId?.id} name="userId"/>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Team Name
            </label>
            <input
              type="text"
              name="name"
              maxLength={254}
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
              required
            />
          </div>

            <div className="flex items-center  gap-5">
              {userId?.isAdmin && (
                <div className="flex items-center gap-2">
                <input
                  id="isAdmin"
                  type="checkbox"
                  name="isAdmin"
                  checked={form.isAdmin}
                  onChange={(e) => updateForm("isAdmin", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800/50"
                />
                <label htmlFor="isAdmin" className="cursor-pointer">
                  Administrative Team
                </label>
              </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  id="privateTeam"
                  type="checkbox"
                  name="privateTeam"
                  checked={form.privateTeam}
                  onChange={(e) => updateForm("privateTeam", e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800/50"
                />
                <label htmlFor="privateTeam" className="cursor-pointer">
                  Private Team
                </label>
              </div>
            </div>

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
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
