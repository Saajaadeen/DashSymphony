import { useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getUserDetails, updateUserInfo } from "server/dashboard.queries.server";
import { getUserId, requireUserId } from "server/session.server";
import { getJoinableTeams } from "server/team.queries.server";
import UserSettingsModal from "~/components/modals/UserSettingsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);

  let teams: any[] = [];
  if (!user?.isAdmin) {
    teams = await getJoinableTeams(userId);
  }
  return { user, teams };
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const firstName = formData.get("firstName")?.toString() || undefined;
  const lastName = formData.get("lastName")?.toString() || undefined;
  const email = formData.get("email")?.toString() || undefined;
  const newPassword = formData.get("newPassword")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const teamId = formData.get("teamId") as string;
  const accessCode = formData.get("accessCode") as string;

  if (newPassword && confirmPassword && newPassword === confirmPassword) {
    return updateUserInfo(userId, firstName, lastName, email, newPassword);
  }
  return updateUserInfo(userId, firstName, lastName, email, undefined, teamId, accessCode);
}

export default function UserSettings() {
  const { user, teams } = useLoaderData<typeof loader>();
  return <UserSettingsModal user={user} teams={teams}/>;
}
