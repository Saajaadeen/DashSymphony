import { Link } from "react-router";

type Group = {
  id: string;
  name: string;
  userId?: string | null;
};

type Card = {
  id: string;
  name: string;
  url?: string;
  imageUrl?: string;
  group?: Group | null;
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
    const groupName = card.group?.name || "Ungrouped";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(card);
    return acc;
  }, {});

  for (const group in groupedCards) {
    groupedCards[group].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  const gridSpanClasses: Record<NonNullable<Card["size"]>, string> = {
    SM: "",
    MD: "",
    LG: "",
    XL: "",
  };

  const heightClasses: Record<NonNullable<Card["size"]>, string> = {
    SM: "h-32",
    MD: "h-48",
    LG: "h-64",
    XL: "h-128",
  };

  const widthClasses: Record<NonNullable<Card["size"]>, string> = {
    SM: "w-32",
    MD: "w-48",
    LG: "w-64",
    XL: "w-full",
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
                  className={`relative group rounded-lg transition-all ${gridSpanClasses[card.size ?? "SM"]} ${heightClasses[card.size ?? "SM"]} ${widthClasses[card.size ?? "SM"]}`}
                >
                  <a
                    href={card.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full bg-white/10 hover:bg-white/20 rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all"
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
                    className="absolute top-2 right-2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 p-1.5 rounded-full transition-all text-lg opacity-0 group-hover:opacity-100"
                  >
                    ⋮
                  </Link>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-8 pb-2 px-2 rounded-b-lg">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {card.name}
                    </h3>
                  </div>
                </div>
              ))}

              <Link
                to={`/dashboard/${selectedDashboard.id}/card/create?group=${encodeURIComponent(
                  groupName
                )}`}
                className="col-span-1 row-span-1 h-32 w-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-500/50 hover:border-gray-400 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <span className="text-3xl mb-1">+</span>
                <span className="text-xs font-medium">Add Card</span>
              </Link>
            </div>
          </div>
        ))}

        {cards.length === 0 && (
          <div className="flex justify-start">
            <Link
              to={`/dashboard/${selectedDashboard.id}/card/create`}
              className="h-32 w-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-500/50 hover:border-gray-400 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-3xl mb-1">+</span>
              <span className="text-xs font-medium">Add Card</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}