import { useState } from "react";
import { Link, useActionData } from "react-router";

export default function GroupCreateModal({ userId }: { userId: string }) {
  const actionData = useActionData();
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700">
        <Link
          to="/dashboard"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700 text-2xl"
        >
          ✕
        </Link>

        <h3 className="text-white text-2xl font-bold mb-6">Create Group</h3>

        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-200 text-sm">
            {actionData.error}
          </div>
        )}

        <form method="post" action="/dashboard/group/create" className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Group Name
            </label>
            <input
              type="text"
              name="name"
              maxLength={100}
              required
              placeholder="Enter group name"
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex mt-4">
              <input
                type="checkbox"
                id="private"
                name="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="ml-2 text-gray-300" htmlFor="private">
                Private Group (Only Seen by You)
              </label>
            </div>
          </div>

          {isPrivate && <input type="hidden" name="userId" value= {userId} />}

          <div className="flex gap-3">
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
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
