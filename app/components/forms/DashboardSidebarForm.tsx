import { Link, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { LockIcon } from "../icons/LockIcon";
import { EyeOpenIcon } from "../icons/EyeOpenIcon";
import { GlobeIcon } from "../icons/GlobeIcon";
import { RocketIcon } from "../icons/RocketIcon";
import { VerticalEllipsisIcon } from "../icons/VerticalEllipsisIcon";

export default function DashboardSidebarForm({
  user,
  teamsBoard = [],
  publicGroups = [],
  privateGroups = [],
  privateBoard = [],
  publicBoard = [],
  globalBoard = [],
  landingBoard = [],
  teamDashboards = [],
}: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  const allDashboards = [
    ...privateBoard,
    ...publicBoard,
    ...globalBoard,
    ...landingBoard,
    ...teamDashboards,
  ];

  const regularDashboards = allDashboards
    .filter((d: any) => !d.teamId)
    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

  const teamDashboardsList = allDashboards
    .filter((d: any) => d.teamId)
    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());

  const groupedDashboards: any = { PRIVATE: [], GLOBAL: [], PUBLIC: [], LANDING: [] };
  regularDashboards.forEach((d: any) => {
    const vis = d.visibility?.[0] || "PUBLIC";
    if (groupedDashboards[vis]) groupedDashboards[vis].push(d);
  });

  const flatTeams = Array.isArray(teamsBoard)
    ? teamsBoard
    : [
        ...(teamsBoard?.publicTeams || []),
        ...(teamsBoard?.privateTeams?.map((pt: any) => ("team" in pt ? pt.team : pt)) || []),
        ...(teamsBoard?.teamOwner || []),
      ];

  const uniqueTeams = flatTeams.filter(
    (team: any, index: number, self: any) => index === self.findIndex((t: any) => t.id === team.id)
  );

  const filteredTeams = uniqueTeams.filter((team: any) => (team.isAdmin ? user?.isAdmin : true));

  useEffect(() => {
    if (!hasInitialized.current && allDashboards.length > 0) {
      const currentPanel = searchParams.get("panel");
      if (!currentPanel) {
        const firstDashboard =
          regularDashboards.length > 0 ? regularDashboards[0] : teamDashboardsList[0];
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

  const canView = (dashboard: any) =>
    user?.isAdmin || dashboard.permissions.includes("READ") || dashboard.permissions.includes("WRITE");

  const canEdit = (dashboard: any) =>
    user?.isAdmin || dashboard.permissions.includes("WRITE");

  const renderGroup = (title: string, dashboards: any[]) => {
    if (!dashboards || dashboards.length === 0) return null;
    return (
      <div key={title} className="mb-6">
        <h3 className="text-white/60 font-medium text-xs uppercase tracking-wide mb-3">{title}</h3>
        <div className="space-y-1">
          {dashboards.map((d: any) => {
            if (!canView(d)) return null;
            const visibility = d.visibility?.[0] || "PUBLIC";
            return (
              <div
                key={d.id}
                className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2"
              >
                <button onClick={() => handleDashboardClick(d.id)} className="flex flex-1 items-center gap-2 text-left">
                  <span className="flex-shrink-0 text-white/60">{getVisibilityIcon(visibility)}</span>
                  <span className="truncate text-sm font-medium text-white">{d.name}</span>
                </button>
                {canEdit(d) && (
                  <Link
                    to={`/dashboard/${d.id}/edit`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
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

  const renderTeams = (teams: any[]) =>
    teams?.length ? (
      <div className="mb-6 space-y-1">
        {teams.map((team: any) => (
          <div key={team.id} className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2">
            <button type="button" className="flex flex-1 items-center gap-2 text-left">
              <span className="truncate text-sm font-medium text-white">{team.name}</span>
            </button>
            <Link
              to={`/dashboard/${team.id}/team/edit`}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
            >
              <VerticalEllipsisIcon className="w-6 h-6" />
            </Link>
          </div>
        ))}
      </div>
    ) : null;

  const renderGroupsWithSubtitles = (publicGroups: any[], privateGroups: any[]) => (
    <>
      {privateGroups?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white/60 font-medium text-xs uppercase tracking-wide mb-2">Private Groups</h4>
          {privateGroups.map((group: any) => (
            <div key={group.id} className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2 mb-1">
              <button type="button" className="flex flex-1 items-center gap-2 text-left">
                <span className="truncate text-sm font-medium text-white">{group.name}</span>
              </button>
              <Link
                to={`/dashboard/group/${group.id}/edit`}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
              >
                <VerticalEllipsisIcon className="w-6 h-6" />
              </Link>
            </div>
          ))}
        </div>
      )}
      {publicGroups?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white/60 font-medium text-xs uppercase tracking-wide mb-2">Public Groups</h4>
          {publicGroups.map((group: any) => (
            <div key={group.id} className="group flex items-center justify-between bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors p-2 mb-1">
              <button type="button" className="flex flex-1 items-center gap-2 text-left">
                <span className="truncate text-sm font-medium text-white">{group.name}</span>
              </button>
              <Link
                to={`/dashboard/group/${group.id}/edit`}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/60 hover:text-white p-1"
              >
                <VerticalEllipsisIcon className="w-6 h-6" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <aside className="w-[400px] h-[1000px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col shadow-xl overflow-hidden">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Dashboards</h2>
        <Link
          to="/dashboard/create"
          className="block w-full bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 border border-white/10 mb-4"
        >
          + New Dashboard
        </Link>
        <div className="overflow-y-auto pr-2 -mr-2 space-y-2">
          {renderGroup("Private", groupedDashboards.PRIVATE)}
          {renderGroup("Global", groupedDashboards.GLOBAL)}
          {renderGroup("Public", groupedDashboards.PUBLIC)}
          {user?.isAdmin && renderGroup("Landing", groupedDashboards.LANDING)}
          {teamDashboardsList.length > 0 && renderGroup("Team Dashboards", teamDashboardsList)}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Teams</h2>
        <Link
          to="/dashboard/team/create"
          className="block w-full bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 border border-white/10 mb-4"
        >
          + New Team
        </Link>
        <div className="overflow-y-auto pr-2 -mr-2 space-y-2">{teamsBoard && renderTeams(filteredTeams)}</div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Groups</h2>
        <Link
          to="/dashboard/group/create"
          className="block w-full bg-white/10 active:bg-white/20 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 border border-white/10 mb-4"
        >
          + Add Group
        </Link>
        <div className="overflow-y-auto pr-2 -mr-2 space-y-2">
          {renderGroupsWithSubtitles(publicGroups, privateGroups)}
        </div>
      </div>
    </aside>
  );
}
