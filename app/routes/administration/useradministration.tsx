import {
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { authenticateAdmin } from "server/auth.queries.server";
import {
  getLandingDashboards,
  getLoginInfo,
  updateLoginInfo,
  updateLandingSettings,
} from "server/dashboard.queries.server";
import { requireUserId } from "server/session.server";
import UserAdministrationModal from "~/components/modals/UserAdministrationModal";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const isAdmin = await authenticateAdmin(userId);

  if (!isAdmin) {
    return redirect("/dashboard");
  }

  const loginInfo = await getLoginInfo();
  const landingPages = await getLandingDashboards();

  return { isAdmin, loginInfo, landingPages };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formType = formData.get("formType");

  if (formType === "login") {
    const loginName = formData.get("loginName")?.toString() || undefined;
    const loginImgUrl = formData.get("loginImgUrl")?.toString() || undefined;
    await updateLoginInfo(loginName, loginImgUrl);
    return redirect("/dashboard");
  }

  if (formType === "landing") {
    const landingEnabled = formData.get("landingEnabled") === "true";
    const selectedLandingId = formData.get("selectedLandingId")?.toString() || null;
    await updateLandingSettings({ landingEnabled, selectedLandingId });
    return redirect("/dashboard");
  }

  return null;
}

export default function UserAdministration() {
  const { isAdmin, loginInfo, landingPages } = useLoaderData<typeof loader>();
  if (!isAdmin) return null;
  return <UserAdministrationModal loginInfo={loginInfo} landingInfo={landingPages} />;
}
