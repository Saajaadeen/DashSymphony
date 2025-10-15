import { prisma } from "./db.server";
import bcrypt from "bcryptjs";

function generateAccessCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function getUserDetails(userId: string) {
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
      isAdmin: true,
    },
  });
  return userDetails;
}

export async function updateLoginInfo(loginName: string, loginImgUrl: string) {
  const loginInfo = await prisma.appSettings.upsert({
    where: { id: "DEFAULT" },
    update: {
      loginName,
      loginImgUrl,
    },
    create: {
      id: "DEFAULT",
      loginName,
      loginImgUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return loginInfo;
}

export async function getLoginInfo() {
  const loginInfo = await prisma.appSettings.upsert({
    where: { id: "DEFAULT" },
    update: {},
    create: {
      id: "DEFAULT",
      loginName: "Welcome Back",
      loginImgUrl: "",
      oAuthEnabled: false,
      landingEnabled: false,
      landingDashboardId: null,
    },
    include: {
      landingDashboard: true,
    },
  });
  return loginInfo;
}

export async function sendNotification(title: string, message: string) {
  const notification = await prisma.notifications.create({
    data: {
      title,
      message,
    },
  });
  return notification;
}

export async function getNotification() {
  const notification = await prisma.notifications.findMany({
    select: {
      id: true,
      title: true,
      message: true,
      createdAt: true,
      readById: true,
    },
  });
  return notification;
}

export async function deleteNotification(id: string) {
  return await prisma.notifications.delete({
    where: {
      id: id,
    },
  });
}

async function createTeamAccess(
  userId: string,
  teamId: string,
  accessCode?: string
) {
  const existingAccess = await prisma.teamAccess.findFirst({
    where: {
      teamId: teamId,
      userId: userId,
    },
  });

  if (!existingAccess) {
    return await prisma.teamAccess.create({
      data: {
        teamId: teamId,
        userId: userId,
        accessCode: accessCode || "",
      },
    });
  }

  return existingAccess;
}

export async function updateUserInfo(
  userId: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  teamId?: string,
  accessCode?: string
) {
  if (teamId) {
    const team = await prisma.teams.findUnique({
      where: { id: teamId },
      select: { privateTeam: true, accessCode: true },
    });

    if (!team) {
      return { error: "Team not found" };
    }

    if (team.privateTeam) {
      if (!accessCode) {
        return { error: "Access code is required for private teams" };
      }

      if (accessCode !== team.accessCode) {
        return { error: "Invalid access code" };
      }

      await createTeamAccess(userId, teamId, accessCode);
    } else {
      await createTeamAccess(userId, teamId);

    }
  }

  const data: any = {
    firstName,
    lastName,
    email,
    updatedAt: new Date(),
  };

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    data.password = hashed;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return { user: updatedUser };
}

export async function createDashboard(
  userId: string,
  visibility: string[],
  permissions: string[],
  name: string,
  description: string,
  connectUser: boolean,
  createdById: string,
  teamId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const restrictedVisibilities = ["GLOBAL", "LANDING"];
  const isRestricted = visibility.some((v) =>
    restrictedVisibilities.includes(v)
  );

  if (isRestricted && (!user || !Boolean(user.isAdmin))) {
    throw new Error(
      "Only admin users can create GLOBAL or LANDING dashboards."
    );
  }

  const data: any = {
    name,
    description,
    visibility,
    permissions,
    createdById,
    teamId,
  };

  if (connectUser) {
    data.userId = userId;
  }

  const dashboard = await prisma.dashboard.create({ data });
  return dashboard;
}

export async function getPublicDashboards() {
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId: null,
      visibility: {
        has: "PUBLIC",
      },
    },
  });

  return dashboard;
}

export async function getPrivateDashboards(userId: string) {
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId: userId,
      visibility: {
        has: "PRIVATE",
      },
    },
  });

  return dashboard;
}

export async function getGlobalDashboards() {
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId: null,
      visibility: {
        has: "GLOBAL",
      },
    },
  });

  return dashboard;
}

export async function getLandingDashboards() {
  const dashboard = await prisma.dashboard.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      userId: null,
      visibility: {
        has: "LANDING",
      },
    },
  });

  return dashboard;
}

export async function getDashboard(dashboardId: string) {
  const dashboard = await prisma.dashboard.findUnique({
    where: { id: dashboardId },
  });

  return dashboard;
}

export async function updateDashboard(
  dashboardId: string,
  visibility: string[],
  permissions: string[],
  name: string,
  description: string,
  userId?: string | null,
  teamId?: string
) {
  const data: any = {
    visibility,
    permissions,
    name,
    description,
  };

  if (userId) {
    data.user = { connect: { id: userId } };
  } else if (!visibility.includes("PRIVATE")) {
    data.user = { disconnect: true };
  }

  if (teamId) {
    data.team = { connect: { id: teamId } };
  } else {
    data.team = { disconnect: true };
  }

  const dashboard = await prisma.dashboard.update({
    where: { id: dashboardId },
    data,
  });

  return dashboard;
}

export async function deleteDashboard(dashboardId: string) {
  const dashboard = await prisma.dashboard.delete({
    where: { id: dashboardId },
  });
  return dashboard;
}

export async function updateLandingSettings({
  landingEnabled,
  selectedLandingId,
}: {
  landingEnabled: boolean;
  selectedLandingId: string | null;
}) {
  return prisma.appSettings.update({
    where: { id: "DEFAULT" },
    data: {
      landingEnabled,
      landingDashboardId: selectedLandingId,
    },
  });
}

export async function createTeam({
  name,
  isAdmin,
  privateTeam,
  userId,
}: {
  name: string;
  isAdmin: boolean;
  privateTeam: boolean;
  userId: string;
}) {
  const accessCode = privateTeam ? generateAccessCode() : null;

  return prisma.teams.create({
    data: {
      name,
      isAdmin,
      privateTeam,
      accessCode,
      createdById: userId,
    },
  });
}

export async function getTeams(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const isAdmin = user?.isAdmin ?? false;

  const teamOwner = await prisma.teams.findMany({
    where: { createdById: userId },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  const publicTeams = await prisma.teams.findMany({
    where: { privateTeam: false },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  let privateTeams;

  if (isAdmin) {
    privateTeams = await prisma.teams.findMany({
      where: { privateTeam: true },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        privateTeam: true,
      },
    });
  } else {
    privateTeams = await prisma.teamAccess.findMany({
      where: { userId },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            isAdmin: true,
            privateTeam: true,
          },
        },
      },
    });
  }

  return { publicTeams, privateTeams, teamOwner };
}

export async function getJoinableTeams(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  });

  const isAdmin = user?.isAdmin ?? false;

  const joinedTeams = await prisma.teamAccess.findMany({
    where: { userId },
    select: { teamId: true },
  });

  const joinedTeamIds = joinedTeams.map((t) => t.teamId);

  const joinableTeams = await prisma.teams.findMany({
    where: {
      ...(isAdmin ? {} : { isAdmin: false, privateTeam: true }),
      id: { notIn: joinedTeamIds.length > 0 ? joinedTeamIds : [""] },
      NOT: { createdById: userId },
    },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      privateTeam: true,
    },
  });

  return joinableTeams;
}

export async function getPrivateTeams(userId: string) {
  const teamOwner = await prisma.teams.findMany({
    where: { createdById: userId },
  });

  return { teamOwner };
}

export async function getTeamById(id: string) {
  return await prisma.teams.findUnique({
    where: { id },
  });
}

export async function updateTeam(
  id: string,
  name: string,
  isAdmin: boolean,
  privateTeam: boolean
) {
  const existing = await prisma.teams.findUnique({ where: { id } });
  let accessCode = existing?.accessCode ?? null;

  if (privateTeam && !existing?.accessCode) {
    accessCode = generateAccessCode();
  }

  if (!privateTeam) {
    accessCode = null;
  }

  return prisma.teams.update({
    where: { id },
    data: {
      name,
      isAdmin,
      privateTeam,
      accessCode,
    },
  });
}

export async function deleteTeam(id: string) {
  return prisma.teams.delete({
    where: { id },
  });
}

export async function leaveTeam(teamId: string, userId: string) {
  const update = await prisma.teams.updateMany({
    where: { id: teamId, createdById: userId },
    data: {
      privateTeam: false,
      accessCode: null,
    },
  });

  const leave = await prisma.teamAccess.deleteMany({
    where: {
      teamId: teamId,
      userId: userId,
    },
  });

  return { update, leave };
}

