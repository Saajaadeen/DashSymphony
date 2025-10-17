import NotificationsDropdownForm from "~/components/menus/NotificationsDropdownForm";
import { AdminIcon } from "../icons/AdminIcon";
import { BellIcon } from "../icons/BellIcon";
import { ChatBubbleIcon } from "../icons/ChatBubbleIcon";
import { CogIcon } from "../icons/CogIcon";
import { ExitIcon } from "../icons/ExitIcon";
import { NotificationIcon } from "../icons/NotificationIcon";
import { UserCircleIcon } from "../icons/UserCircleIcon";
import MenuDropdownForm from "../menus/DropdownForm";

export default function DashboardNavbarForm({
  user,
  notifications,
}: {
  user: any;
  notifications: any;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/5 backdrop-blur-sm border rounded-2xl border-white/10 shadow-md">
      <div className="text-lg font-semibold text-white">
        {user
          ? `Welcome Back, ${user.firstName} ${user.lastName}!`
          : "Welcome Back!"}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex justify-end p-4">
          <NotificationsDropdownForm
            items={notifications}
            user={user}
            trigger={
              <button className="relative p-2 rounded-full transition-colors">
                <BellIcon className="h-8 w-8 text-white" />
                {notifications.some((n: any) => !n.readById?.includes(user.id)) && (
                  <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900 animate-pulse"></span>
                )}
              </button>
            }
          />
        </div>

        <MenuDropdownForm
          trigger={
            <button className="p-2 rounded-full transition-colors">
              <UserCircleIcon className="h-8 w-8 text-white" />
            </button>
          }
          items={[
            user?.isAdmin && {
              icon: <AdminIcon className="w-5 h-5 text-white" />,
              label: "Administration",
              href: "/dashboard/administration",
            },
            user?.isAdmin && {
              icon: <NotificationIcon className="w-5 h-5 text-white" />,
              label: "Notifications",
              href: "/dashboard/notifications",
            },
            {
              icon: <CogIcon className="w-5 h-5 text-white" />,
              label: "Settings",
              href: "/dashboard/settings",
            },
            {
              icon: <ExitIcon className="w-5 h-5 text-white" />,
              label: "Logout",
              href: "/logout",
            },
          ].filter(Boolean)}
        />
      </div>
    </header>
  );
}
