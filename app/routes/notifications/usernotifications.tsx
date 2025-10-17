import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authenticateAdmin } from "server/auth.queries.server";
import { getNotification, sendNotification, deleteNotification } from "server/notifications.queries.server";
import { requireUserId } from "server/session.server";
import UserNotificationsModal from "~/components/modals/UserNotificationsModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const isAdmin = await authenticateAdmin(userId);
  const notifications = await getNotification();
  if (!isAdmin) { return redirect("/dashboard");}
  return { isAdmin, notifications };
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string | null;
  const message = formData.get("message") as string | null;

  if (intent === "send" && title && message) {
    await sendNotification(title, message);
  }

  if (intent === "delete" && id) {
    await deleteNotification(id);
  }

  return redirect("/dashboard/notifications");
} 

export default function UserNotifications() {
  const { isAdmin, notifications } = useLoaderData<typeof loader>();
  if (!isAdmin) return null;

  return <UserNotificationsModal notifications={notifications}/>;
}
