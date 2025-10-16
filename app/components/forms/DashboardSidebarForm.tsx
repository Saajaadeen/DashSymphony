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
  createdById?: string | null;
  teamId?: string | null;
};

type User = {
  id: string;
  isAdmin?: boolean;
};

type Team = {
  id: string;
  name: string;
  isAdmin: boolean;
};

type PrivateTeamAccess = {
  id: string;
  team: Team;
  createdAt: Date;
};

type TeamsData =
  | {
      publicTeams?: Team[];
      privateTeams?: PrivateTeamAccess[];
      teamOwner?: Team[];
    }
  | Team[];

export default function DashboardSidebarForm({
  user,
  privateBoard = [],
  publicBoard = [],
  globalBoard = [],
  landingBoard = [],
  teamsBoard = [],
  teamDashboards = [],
}: {
  user?: User;
  teamsBoard?: TeamsData;
  privateBoard?: Dashboard[];
  publicBoard?: Dashboard[];
  globalBoard?: Dashboard[];
  landingBoard?: Dashboard[];
  teamDashboards?: Dashboard[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  // Combine all dashboards
  const allDashboards = [
    ...privateBoard,
    ...publicBoard,
    ...globalBoard,
    ...landingBoard,
    ...teamDashboards,
  ];

  // Separate team dashboards from regular dashboards
  const regularDashboards = allDashboards
    .filter((d) => !d.teamId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get all team dashboards
  const teamDashboardsList = allDashboards
    .filter((d) => d.teamId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Group regular dashboards by visibility
  const groupedDashboards: Record<string, Dashboard[]> = {
    PRIVATE: [],
    GLOBAL: [],
    PUBLIC: [],
    LANDING: [],
  };

  regularDashboards.forEach((d) => {
    const vis = d.visibility?.[0] || "PUBLIC";
    if (groupedDashboards[vis]) groupedDashboards[vis].push(d);
  });

  // Flatten and dedupe all teams
  const flatTeams = Array.isArray(teamsBoard)
    ? teamsBoard
    : [
        ...(teamsBoard?.publicTeams || []),
        ...(teamsBoard?.privateTeams?.map((pt) =>
          "team" in pt ? pt.team : pt
        ) || []),
        ...(teamsBoard?.teamOwner || []),
      ];

  const uniqueTeams = flatTeams.filter(
    (team, index, self) =>
      index === self.findIndex((t) => t.id === team.id)
  );

  const filteredTeams = uniqueTeams.filter((team) => {
    if (team.isAdmin) return user?.isAdmin;
    return true;
  });

  // Initial panel setup
  useEffect(() => {
    if (!hasInitialized.current && allDashboards.length > 0) {
      const currentPanel = searchParams.get("panel");
      if (!currentPanel) {
        // Prioritize regular dashboards, then team dashboards
        const firstDashboard = regularDashboards.length > 0 
          ? regularDashboards[0] 
          : teamDashboardsList[0];
        if (firstDashboard) {
          setSearchParams({ panel: firstDashboard.id });
        }
      }
      hasInitialized.current = true;
    }
  }, [allDashboards, regularDashboards, teamDashboardsList, searchParams, setSearchParams]);

  const handleDashboardClick = (dashboardId: string) => {
    setSearchParams({ panel: dashboardId });
  };

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

  const canView = (dashboard: Dashboard) =>
    user?.isAdmin ||
    dashboard.permissions.includes("READ") ||
    dashboard.permissions.includes("WRITE");

  const canEdit = (dashboard: Dashboard) =>
    user?.isAdmin || dashboard.permissions.includes("WRITE");

  const renderGroup = (title: string, dashboards: Dashboard[]) => {
    if (!dashboards || dashboards.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-white/60 font-medium text-xs uppercase tracking-wide mb-3">
          {title}
        </h3>
        <div className="space-y-1">
          {dashboards.map((d) => {
            if (!canView(d)) return null;
            const visibility = d.visibility?.[0] || "PUBLIC";
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
      </div>
    );
  };

  const renderTeams = (teams: Team[]) => (
    <div className="mb-6">
      {!teams || teams.length === 0 ? (
        <p className="text-white/30 text-xs italic pl-3">
          No teams available — create a team to select
        </p>
      ) : (
        <div className="space-y-1">
          {teams.map((team) => (
            <div
              key={team.id}
              className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2"
            >
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span className="truncate text-sm font-medium text-white">
                  {team.name}
                </span>
              </button>

              <Link
                to={`/dashboard/${team.id}/team/edit`}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
                aria-label="Edit team"
              >
                <VerticalEllipsisIcon className="w-6 h-6" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <aside className="w-[400px] h-[1000px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Dashboards</h2>
      </div>

      <Link
        to="/dashboard/create"
        className="mb-4 w-full bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 border border-white/10"
      >
        + New Dashboard
      </Link>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
        {renderGroup("Private", groupedDashboards.PRIVATE)}
        {renderGroup("Global", groupedDashboards.GLOBAL)}
        {renderGroup("Public", groupedDashboards.PUBLIC)}
        {user?.isAdmin && renderGroup("Landing", groupedDashboards.LANDING)}
        {teamDashboardsList.length > 0 &&
          renderGroup("Team Dashboards", teamDashboardsList)}
      </div>

      <div className="flex items-center justify-between mt-6 mb-4">
        <h2 className="text-xl font-semibold text-white">Teams</h2>
      </div>

      <Link
        to="/dashboard/team/create"
        className="mb-4 w-full bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 border border-white/10"
      >
        + New Team
      </Link>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
        {teamsBoard && renderTeams(filteredTeams)}
      </div>
    </aside>
  );
}