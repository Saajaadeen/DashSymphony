import {
  redirect,
  useLoaderData,
  useParams,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import {
  getUserDetails,
  getPrivateDashboards,
  updateDashboard,
  deleteDashboard,
  getPublicDashboards,
  getGlobalDashboards,
  getLandingDashboards,
  getTeams,
} from "server/dashboard.queries.server";
import { getUserId, requireUserId } from "server/session.server";
import DashboardEditModal from "~/components/modals/DashboardEditModal";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);

  const privateDashboards = await getPrivateDashboards(userId);
  const publicDashboards = await getPublicDashboards();
  const globalDashboards = await getGlobalDashboards();

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

  const teams = await getTeams(userId);

  return { user, teams, allDashboards };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const dashboardId = formData.get("dashboardId") as string;

  if (intent === "update") {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const visibilityRaw = formData.get("visibility") as string;
    const visibility = JSON.parse(visibilityRaw) as string[];
    const permissionsRaw = formData.get("permissions") as string;
    const permissions = permissionsRaw.split(",");
    const userId = formData.get("userId") as string | null;
    const teamId = formData.get("teamId") as string;

    await updateDashboard(
      dashboardId,
      visibility,
      permissions,
      name,
      description,
      userId,
      teamId
    );
  } else if (intent === "delete") {
    await deleteDashboard(dashboardId);
  }

  return redirect("/dashboard");
}

export default function DashboardEdit() {
  const { user, teams, allDashboards } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const selectedDashboard = allDashboards.find((d) => d.id === id);

  return (
    <DashboardEditModal
      isAdmin={user?.isAdmin}
      userId={user?.id}
      dashboard={selectedDashboard}
      dashboardId={id}
      teams={teams}
    />
  );
}
