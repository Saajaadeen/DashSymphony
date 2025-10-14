import TeamEditModal from "~/components/modals/TeamEditModal";

import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { deleteTeam, getTeamById, getUserDetails, updateTeam } from "server/dashboard.queries.server";
import { requireUserId, getUserId } from "server/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);

  const team = await getTeamById(params.id!);

  console.log(team, user)

  return { user, team };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const teamId = formData.get("teamId") as string;
  const intent = formData.get("intent") as string;
  const name = formData.get("name") as string;
  const isAdmin = formData.get("isAdmin") === "on";

  if (intent === "update") {
    await updateTeam(teamId, name, isAdmin);
  } else if (intent === "delete") {
    await deleteTeam(teamId);
  }

  return redirect("/dashboard");
}

export default function TeamEdit() {
  const { user, team } = useLoaderData<typeof loader>();

  return (
    <TeamEditModal
      teamId={team?.id}
      name={team?.name}
      isAdmin={team?.isAdmin}
      userIsAdmin={user?.isAdmin}
    />
  );
}
