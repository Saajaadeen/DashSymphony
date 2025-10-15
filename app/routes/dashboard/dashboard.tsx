import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import {
  getCards,
} from "server/card.queries.server";
import {
  getPrivateDashboards,
  getPublicDashboards,
  getGlobalDashboards,
  getLandingDashboards,
  getNotification,
  getUserDetails,
  getTeams,
} from "server/dashboard.queries.server";
import { getUserId, requireUserId } from "server/session.server";
import DashboardForm from "~/components/forms/DashboardForm";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);

  const notifications = await getNotification();
  const privateDashboards = await getPrivateDashboards(userId);
  const publicDashboards = await getPublicDashboards();
  const globalDashboards = await getGlobalDashboards();
  const teamsDashboard = await getTeams(userId);

  let landingDashboards: any[] = [];
  if (user?.isAdmin) {
    landingDashboards = await getLandingDashboards();
  }

  const allDashboards = [
    ...privateDashboards,
    ...publicDashboards,
    ...globalDashboards,
    ...landingDashboards,
  ];

  const url = new URL(request.url);
  const panelId = url.searchParams.get("panel");

  let selectedDashboard = null;
  let cards: any = [];

  if (panelId) {
    selectedDashboard = allDashboards.find(d => d.id === panelId) ?? null;

    if (selectedDashboard) {
      cards = await getCards(panelId);
    }
  }

  return {
    user,
    notifications,
    privateDashboards,
    publicDashboards,
    globalDashboards,
    landingDashboards,
    teamsDashboard,
    allDashboards,
    cards,
    selectedDashboard,
  };
}

export default function Dashboard() {
  const {
    user,
    notifications,
    privateDashboards,
    publicDashboards,
    globalDashboards,
    landingDashboards,
    teamsDashboard,
    allDashboards,
    cards,
    selectedDashboard,
  } = useLoaderData<typeof loader>();

  return (
    <>
      <DashboardForm
        user={user}
        notifications={notifications}
        privateDashboards={privateDashboards}
        publicDashboards={publicDashboards}
        globalDashboards={globalDashboards}
        landingDashboards={landingDashboards}
        teamsDashboard={teamsDashboard}
        allDashboards={allDashboards}
        selectedDashboard={selectedDashboard}
        cards={cards}
      />
    </>
  );
}
