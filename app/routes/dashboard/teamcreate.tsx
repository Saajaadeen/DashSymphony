import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getUserDetails } from "server/dashboard.queries.server";
import { requireUserId, getUserId } from "server/session.server";
import { createTeam } from "server/team.queries.server";
import TeamCreateModal from "~/components/modals/TeamCreateModal";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);
  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const isAdmin = formData.get("isAdmin") === "on";
    const privateTeam = formData.get("privateTeam") === "on";
    const userId = formData.get("userId") as string;

    createTeam({name, isAdmin, privateTeam, userId});
    return redirect("/dashboard");
}

export default function TeamCreate() {
    const { user } = useLoaderData<typeof loader>();
    return (<TeamCreateModal userId={user} />)
}