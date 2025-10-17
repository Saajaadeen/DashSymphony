import { useEffect, useState } from "react";
import { Link, useActionData } from "react-router";

export default function GroupEditModal({ group }: any) {
  const actionData = useActionData();
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700">
        <Link
          to="/dashboard"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 text-2xl"
          aria-label="Close"
        >
          ✕
        </Link>

        <h3 className="text-white text-2xl font-bold mb-6">Edit Group</h3>

        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-sm">
            {actionData.error}
          </div>
        )}

        <form
          method="post"
          action={`/dashboard/group/${group.id}/edit`}
          className="space-y-5"
        >
          <input type="hidden" name="intent" value="update" />
          <input type="hidden" name="id" value={group.id} />

          <div>
            <label
              htmlFor="groupName"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              name="name"
              maxLength={100}
              required
              defaultValue={group.name}
              placeholder="Enter group name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              Save Changes
            </button>
          </div>
        </form>

        <form
          method="post"
          action={`/dashboard/group/${group.id}/edit`}
          className="mt-10 border-t border-gray-700 pt-6 space-y-4"
        >
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="id" value={group.id} />

          <p className="text-gray-400 text-sm">
            Deleting this group is permanent and cannot be undone.
          </p>

          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 focus:none"
            />
            I understand that this action cannot be undone.
          </label>

          <button
            type="submit"
            disabled={!confirmDelete}
            className={`w-full py-2.5 rounded-xl font-medium transition-all ${
              confirmDelete
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete Group
          </button>
        </form>
      </div>
    </div>
  );
}
