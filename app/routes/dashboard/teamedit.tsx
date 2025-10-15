import TeamEditModal from "~/components/modals/TeamEditModal";

import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { deleteTeam, getTeamById, getUserDetails, leaveTeam, updateTeam } from "server/dashboard.queries.server";
import { requireUserId, getUserId } from "server/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);
  const team = await getTeamById(params.id!);

  return { user, team };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const teamId = formData.get("teamId") as string;
  const intent = formData.get("intent") as string;
  const name = formData.get("name") as string;
  const isAdmin = formData.get("isAdmin") === "on";
  const privateTeam = formData.get("privateTeam") === "on";
  const userId = formData.get("userId") as string;

  if (intent === "update") {
    await updateTeam(teamId, name, isAdmin, privateTeam);
  } else if (intent === "delete") {
    await deleteTeam(teamId);
  } else if (intent === "leave") {
    await leaveTeam(teamId, userId);
  }

  return redirect("/dashboard");
}

export default function TeamEdit() {
  const { user, team } = useLoaderData<typeof loader>();

  return (
    <TeamEditModal
      user={user?.id}
      owner={team?.createdById}
      privateTeam={team?.privateTeam}
      teamAccessCode={team?.accessCode}
      teamId={team?.id}
      name={team?.name}
      isAdmin={team?.isAdmin}
      userIsAdmin={user?.isAdmin}
    />
  );
}
