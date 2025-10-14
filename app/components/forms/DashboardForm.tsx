import { Outlet } from "react-router";
import DashboardNavbarForm from "./DashboardNavbarForm";
import DashboardSidebarForm from "./DashboardSidebarForm";
import DashboardDisplayForm from "./DashboardDisplayForm";

export default function DashboardForm({ 
  user, 
  notifications, 
  privateDashboards, 
  publicDashboards, 
  globalDashboards, 
  landingDashboards,
  teamsDashboard, 
  cards, 
  selectedDashboard }: any) {

  return (
    <div className="p-5 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header>
        <DashboardNavbarForm
          notifications={notifications} 
          user={user}
        />
      </header>

      <div className="flex gap-6">
        <aside className="pt-5">
          <DashboardSidebarForm
            user={user}
            privateBoard={privateDashboards}
            publicBoard={publicDashboards}
            globalBoard={globalDashboards}
            landingBoard={landingDashboards}
            teamsBoard={teamsDashboard}
          />
        </aside>

        <main className="pt-5 w-full">
          <DashboardDisplayForm 
            cards={cards}
            selectedDashboard={selectedDashboard}/>
        </main>
      </div>

      <Outlet />
    </div>
  );
}
