import { Link } from "react-router";

type Card = {
  id: string;
  name: string;
  url?: string;
  imageUrl?: string;
  group?: { id: string; name: string };
  position?: number;
  size?: "SM" | "MD" | "LG" | "XL";
};

type AppInfo = {
  landingDashboard?: {
    name: string;
  };
};

export default function LandingPage({
  cards,
  appInfo,
}: {
  cards: Card[];
  appInfo: AppInfo;
}) {
  const groupedCards = cards.reduce<Record<string, Card[]>>((acc, card) => {
    const groupName = card.group?.name || "Ungrouped";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(card);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <header className="border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {appInfo?.landingDashboard?.name || "Dashboard"}
          </h1>
          <Link
            to="/login"
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full border border-white/10 transition-all duration-200 hover:scale-105"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col gap-12">
        {Object.entries(groupedCards).length > 0 ? (
          Object.entries(groupedCards).map(([groupName, groupCards]) => (
            <div key={groupName} className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-white/80">{groupName}</h2>
              <div className="flex flex-wrap gap-4">
                {groupCards.map((card) => (
                  <a
                    key={card.id}
                    href={card.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/5 ${sizeClasses[card.size ?? "SM"]}`}
                  >
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-white/70 text-3xl font-bold">
                          {card.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md rounded px-2 py-1 border border-white/10">
                      <h3 className="text-sm font-semibold text-white text-center truncate">
                        {card.name}
                      </h3>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-xs">↗</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-gray-400 text-lg">
                No cards available at the moment
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          <p>Powered by Dashboard · Quick access to everything you need</p>
        </div>
      </footer>
    </div>
  );
}
