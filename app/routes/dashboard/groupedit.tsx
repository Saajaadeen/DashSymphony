import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { deleteGroup, getGroupById, updateGroup } from "server/group.queries.server";
import { requireUserId } from "server/session.server";
import GroupEditModal from "~/components/modals/groups/GroupEditModal";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const groupId = (params.id) as string;
  const group = await getGroupById(groupId)

  return { group };
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    
    const intent = formData.get("intent") as string;
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    if (intent === "update") {
        updateGroup(name, id);
    } else if (intent === "delete") {
        deleteGroup(id)
    }

    return redirect("/dashboard");
}

export default function GroupEdit() {
    const { group } = useLoaderData<typeof loader>();
    return (<GroupEditModal group={group} />)
}