import { useState, useEffect } from "react";
import { Link, Form } from "react-router";
import type { Card as CardType } from "@prisma/client";

type Group = {
  id: string;
  name: string;
  createdAt: string;
  userId?: string | null;
};

type CardEditForm = {
  name: string;
  url: string;
  imageUrl: string;
  groupId: string;
  size: "SM" | "MD" | "LG" | "XL";
  position: number;
  confirmDelete: boolean;
};

const CARD_SIZES = ["SM", "MD", "LG", "XL"] as const;

export default function CardEditModal({
  dashboardId,
  dashboard,
  card,
  cards,
  groups,
}: {
  dashboardId: string;
  dashboard: { id: string; name: string };
  card: CardType & { group?: Group | null };
  cards: Pick<CardType, "groupId" | "position">[];
  groups: Group[];
}) {
  const hasGroups = groups && groups.length > 0;

  const getGroupCardCount = (groupId: string) =>
    cards.filter((c) => c.groupId === groupId).length;

  const [form, setForm] = useState<CardEditForm>({
    name: card.name,
    url: card.url || "",
    imageUrl: card.imageUrl || "",
    groupId: card.groupId || "",
    size: card.size || "MD",
    position: card.position || 1,
    confirmDelete: false,
  });

  const [availablePositions, setAvailablePositions] = useState(1);

  useEffect(() => {
    const count = getGroupCardCount(form.groupId);
    setAvailablePositions(count + 1);
    if (form.position > count + 1) {
      setForm((prev) => ({ ...prev, position: count + 1 }));
    }
  }, [form.groupId, cards]);

  const updateForm = (updates: Partial<CardEditForm>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-7 w-full max-w-sm relative shadow-2xl border border-gray-700">
        <Link
          to={`/dashboard?panel=${dashboardId}`}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-700 text-xl"
        >
          ✕
        </Link>

        <h3 className="text-white text-xl font-bold mb-1">Edit Card</h3>
        <p className="text-gray-400 text-xs mb-4">
          Dashboard: <span className="text-white font-medium">{dashboard.name}</span>
        </p>

        <Form method="post" className="space-y-4">
          <input type="hidden" name="cardId" value={card.id} />

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Card Name
            </label>
            <input
              type="text"
              maxLength={254}
              name="name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              placeholder="Enter card name"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              URL
            </label>
            <input
              type="url"
              name="url"
              maxLength={1000}
              value={form.url}
              onChange={(e) => updateForm({ url: e.target.value })}
              placeholder="example.com"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              maxLength={1000}
              value={form.imageUrl}
              onChange={(e) => updateForm({ imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Card Group
            </label>
            <select
              name="groupId"
              value={form.groupId}
              onChange={(e) => updateForm({ groupId: e.target.value })}
              disabled={!hasGroups}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none ${
                hasGroups
                  ? "bg-gray-800/50 border-gray-700 text-gray-300 focus:border-blue-500"
                  : "bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed"
              }`}
              required
            >
              <option value="">
                {hasGroups ? "Select group..." : "No groups available"}
              </option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {!hasGroups && (
              <p className="text-sm text-gray-400 mt-2">
                No groups exist.{" "}
                <Link
                  to="/dashboard/group/create"
                  className="text-blue-400 underline"
                >
                  Create a group
                </Link>{" "}
                to enable this dropdown.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Position (1–{availablePositions})
            </label>
            <input
              type="number"
              name="position"
              min={1}
              max={availablePositions}
              value={form.position}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= availablePositions) {
                  updateForm({ position: value });
                }
              }}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-xs font-medium mb-1">
              Card Size
            </label>
            <div className="flex gap-2">
              {CARD_SIZES.map((size) => (
                <label
                  key={size}
                  className={`flex-1 text-center px-2 py-1.5 rounded-lg border cursor-pointer text-sm transition-all ${
                    form.size === size
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={form.size === size}
                    className="hidden"
                    onChange={() => updateForm({ size })}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <label className="flex items-center gap-3 text-white text-sm mb-2">
              <input
                type="checkbox"
                checked={form.confirmDelete}
                onChange={(e) => updateForm({ confirmDelete: e.target.checked })}
                className="w-4 h-4 accent-red-600"
              />
              Confirm Delete
            </label>
            <button
              type="submit"
              name="intent"
              value="delete"
              disabled={!form.confirmDelete}
              className="w-full px-4 py-2 mt-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Card
            </button>
          </div>

          <div className="flex gap-2 pt-4">
            <Link
              to={`/dashboard?panel=${dashboardId}`}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium text-center text-sm transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              name="intent"
              value="update"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg text-white font-medium shadow-md shadow-blue-500/30 text-sm transition-all"
            >
              Save Changes
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
