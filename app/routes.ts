import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/entry.tsx"),
    route("/login", "./routes/authentication/login.tsx"),
    route("/logout", "./routes/authentication/logout.tsx"),
    route("/register", "./routes/authentication/register.tsx"),

    route("/dashboard", "./routes/dashboard/dashboard.tsx", [
        route("settings", "./routes/settings/usersettings.tsx"),
        route("notifications", "./routes/notifications/usernotifications.tsx"),
        route("administration", "./routes/administration/useradministration.tsx"),
        route("create", "./routes/dashboard/dashboardcreate.tsx"),
        route("team/create", "./routes/dashboard/teamcreate.tsx"),
        route(":id/team/edit", "./routes/dashboard/teamedit.tsx"),
        route(":id/edit", "./routes/dashboard/dashboardedit.tsx"),
        route(":id/card/create", "./routes/card/cardcreate.tsx"),
        route(":dashboardId/card/:cardId/edit", "./routes/card/cardedit.tsx")
    ]),

    route("*", "./routes/notfound/notfound.tsx")
] satisfies RouteConfig;
