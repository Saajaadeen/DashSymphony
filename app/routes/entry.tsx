import type { Route } from "./+types/entry";
import { getLoginInfo } from "server/dashboard.queries.server";
import LandingPage from "~/components/pages/landingPage";
import Login from "./authentication/login";
import { useLoaderData } from "react-router";
import { getCards } from "server/card.queries.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "🖥️ Home Dashboard" },
    { name: "", content: "" },
  ];
}

export async function loader() {
  const loginInfo = await getLoginInfo();
  let landingCards: any = [];
  if (loginInfo.landingEnabled && loginInfo.landingDashboardId) {
    landingCards = await getCards(loginInfo.landingDashboardId);
  }

  return { loginInfo, landingCards };
}

export default function Entry() {
  const { loginInfo, landingCards } = useLoaderData<typeof loader>();
  
  if (!loginInfo) {
    return <div className="text-center text-white mt-10">Loading...</div>;
  }
  
  return (
    <div>
      {loginInfo.landingEnabled ? (
        <LandingPage cards={landingCards} appInfo={loginInfo} />
      ) : (
        <Login />
      )}
    </div>
  );
}