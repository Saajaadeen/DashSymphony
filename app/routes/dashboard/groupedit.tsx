import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { getUserDetails } from "server/dashboard.queries.server";
import { deleteGroup, getGroupById, updateGroup } from "server/group.queries.server";
import { getUserId, requireUserId } from "server/session.server";
import GroupEditModal from "~/components/modals/groups/GroupEditModal";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  const user = await getUserDetails(userId);
  const groupId = (params.id) as string;
  const group = await getGroupById(groupId)

  return { group, user };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    
    const intent = formData.get("intent") as string;
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;
    const userId = formData.get("userId") as string | null;

    if (intent === "update") {
        updateGroup(name, id, userId!);
    } else if (intent === "delete") {
        deleteGroup(id)
    }

    return redirect("/dashboard");
}

export default function GroupEdit() {
    const { group, user } = useLoaderData<typeof loader>();
    return (<GroupEditModal group={group} user={user} />)
}