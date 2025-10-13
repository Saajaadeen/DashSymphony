import { Link } from "react-router";

type Card = {
  id: string;
  name: string;
  url?: string;
  imageUrl?: string;
  cardGroup?: string;
  position?: number;
  size?: "SM" | "MD" | "LG" | "XL";
};

type Dashboard = {
  id: string;
  name: string;
  description?: string;
};

export default function DashboardDisplayForm({
  cards,
  selectedDashboard,
}: {
  cards: Card[];
  selectedDashboard: Dashboard | null;
}) {
  if (!selectedDashboard) {
    return (
      <div className="text-white/50 text-lg mt-10 text-center">
        Please select a dashboard to view cards.
      </div>
    );
  }

  const groupedCards = cards.reduce<Record<string, Card[]>>((acc, card) => {
    const group = card.cardGroup || "Ungrouped";
    if (!acc[group]) acc[group] = [];
    acc[group].push(card);
    return acc;
  }, {});

  for (const group in groupedCards) {
    groupedCards[group].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  const sizeClasses: Record<Card["size"], string> = {
    SM: "w-32 h-32 sm:w-32 sm:h-32",
    MD: "w-64 h-32 sm:w-64 sm:h-32",
    LG: "w-64 h-64 sm:w-64 sm:h-64",
    XL: "w-128 h-128 sm:w-128 sm:h-128",
  };

  return (
    <div className="relative flex flex-col w-full h-full p-6 bg-gradient-to-br from-gray-900/30 to-gray-600/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl transition-all">
      <h2 className="text-3xl font-semibold mb-6 text-white">
        {selectedDashboard.name}
      </h2>

      <div className="flex flex-col gap-8">
        {Object.entries(groupedCards).map(([groupName, groupCards]) => (
          <div key={groupName} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white/80 mb-3">
              {groupName}
            </h3>

            <div className="flex flex-wrap gap-3">
              {groupCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative group rounded-lg transition-all ${sizeClasses[card.size ?? "SM"]}`}
                >
                  <a
                    href={card.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full bg-white/10 rounded-lg shadow-md overflow-hidden transition"
                  >
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-white/50 text-2xl font-bold">
                          {card.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </a>

                  <Link
                    to={`/dashboard/${selectedDashboard.id}/card/${card.id}/edit`}
                    className="absolute top-2 right-2 text-white/70 p-1 rounded-full transition-colors text-lg"
                  >
                    ⋮
                  </Link>

                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-sm rounded px-1 py-0.5">
                    <h3 className="text-xs font-semibold text-white text-center truncate">
                      {card.name}
                    </h3>
                  </div>
                </div>
              ))}

              <Link
                to={`/dashboard/${selectedDashboard.id}/card/create?group=${encodeURIComponent(
                  groupName
                )}`}
                className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-500 bg-white/5 rounded-lg text-white transition-all cursor-pointer p-2 ${sizeClasses.SM}`}
              >
                <span className="text-2xl transition-transform">
                  +
                </span>
                <span className="mt-1 text-xs font-medium">Add</span>
              </Link>
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <div className="flex justify-start">
            <Link
              to={`/dashboard/${selectedDashboard.id}/card/create`}
              className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-500 bg-white/5  rounded-lg text-white transition-all cursor-pointer p-2 ${sizeClasses.SM}`}
            >
              <span className="text-2xl transition-transform">
                +
              </span>
              <span className="mt-1 text-xs font-medium">Add</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
