import { Link, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { LockIcon } from "../icons/LockIcon";
import { EyeOpenIcon } from "../icons/EyeOpenIcon";
import { GlobeIcon } from "../icons/GlobeIcon";
import { RocketIcon } from "../icons/RocketIcon";
import { VerticalEllipsisIcon } from "../icons/VerticalEllipsisIcon";

type Dashboard = {
  id: string;
  name: string;
  description?: string;
  visibility: string[];
  permissions: string[];
  createdAt: Date;
};

type User = {
  isAdmin?: boolean;
};

export default function DashboardSidebarForm({
  user,
  privateBoard,
  publicBoard,
  globalBoard,
  landingBoard,
}: {
  user?: User;
  privateBoard: Dashboard[];
  publicBoard: Dashboard[];
  globalBoard: Dashboard[];
  landingBoard: Dashboard[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  // Merge all dashboards and sort by creation date (latest first)
  const sortedDashboards = [
    ...privateBoard,
    ...publicBoard,
    ...globalBoard,
    ...landingBoard,
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Group by visibility
  const groupedDashboards: Record<string, Dashboard[]> = {
    PRIVATE: [],
    GLOBAL: [],
    PUBLIC: [],
    LANDING: [],
  };

  sortedDashboards.forEach((d) => {
    const vis = d.visibility[0] || "PUBLIC";
    if (groupedDashboards[vis]) {
      groupedDashboards[vis].push(d);
    }
  });

  // Initialize selected dashboard
  useEffect(() => {
    if (!hasInitialized.current && sortedDashboards.length > 0) {
      const currentPanel = searchParams.get("panel");
      if (!currentPanel) {
        setSearchParams({ panel: sortedDashboards[0].id });
      }
      hasInitialized.current = true;
    }
  }, [sortedDashboards, searchParams, setSearchParams]);

  const handleDashboardClick = (dashboardId: string) => {
    setSearchParams({ panel: dashboardId });
  };

  // Visibility icon helper
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "PRIVATE":
        return <LockIcon className="w-6 h-6" />;
      case "PUBLIC":
        return <EyeOpenIcon className="w-6 h-6" />;
      case "GLOBAL":
        return <GlobeIcon className="w-6 h-6" />;
      case "LANDING":
        return <RocketIcon className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Permission helpers
  const canView = (dashboard: Dashboard) => {
    return (
      user?.isAdmin ||
      dashboard.permissions.includes("READ") ||
      dashboard.permissions.includes("WRITE")
    );
  };

  const canEdit = (dashboard: Dashboard) => {
    return user?.isAdmin || dashboard.permissions.includes("WRITE");
  };

  // Render grouped dashboards by visibility
  const renderGroup = (title: string, dashboards: Dashboard[]) => (
    <div key={title} className="mb-6">
      <h3 className="text-white/60 font-medium text-xs uppercase tracking-wide mb-3">
        {title}
      </h3>

      {dashboards.length === 0 ? (
        <p className="text-white/30 text-xs italic pl-3">No dashboards</p>
      ) : (
        <div className="space-y-1">
          {dashboards.map((d) => {
            if (!canView(d)) return null; // hide dashboards user can't view
            const visibility = d.visibility[0] || "PUBLIC";

            return (
              <div
                key={d.id}
                className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2"
              >
                <button
                  onClick={() => handleDashboardClick(d.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <span className="flex-shrink-0 text-white/60">
                    {getVisibilityIcon(visibility)}
                  </span>
                  <span className="truncate text-sm font-medium text-white">
                    {d.name}
                  </span>
                </button>

                {canEdit(d) && (
                  <Link
                    to={`/dashboard/${d.id}/edit`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
                    aria-label="Edit dashboard"
                  >
                    <VerticalEllipsisIcon className="w-6 h-6" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-[400px] h-[1000px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Dashboards</h2>
      </div>

      <Link
        to="/dashboard/create"
        className="mb-6 bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center border border-white/10"
      >
        + New Dashboard
      </Link>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
        {renderGroup("Private", groupedDashboards.PRIVATE)}
        {renderGroup("Global", groupedDashboards.GLOBAL)}
        {renderGroup("Public", groupedDashboards.PUBLIC)}
        {user?.isAdmin && renderGroup("Landing", groupedDashboards.LANDING)}
      </div>
    </aside>
  );
}
