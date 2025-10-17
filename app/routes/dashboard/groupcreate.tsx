import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { createGroup } from "server/group.queries.server";
import { getUserId, requireUserId } from "server/session.server";
import GroupCreateModal from "~/components/modals/groups/GroupCreateModal";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const userId = await getUserId(request);
  
  return userId;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const userId = formData.get("userId") as string | null;

    createGroup(name, userId!);
    return redirect("/dashboard");
}

export default function GroupCreate() {
    const userId = useLoaderData<typeof loader>();
    return (<GroupCreateModal userId={userId}/>)
}